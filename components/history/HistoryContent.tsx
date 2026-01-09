"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HistoryList, type HistoryItem } from "@/components/history";
import {
  getHistory,
  deleteSimplification,
  toggleFavorite,
} from "@/lib/actions/simplification.actions";
import { createShareLink } from "@/lib/actions/share.actions";
import type { SimplificationMode } from "@/lib/types";

export function HistoryContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<SimplificationMode | "all">(
    "all"
  );
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    console.log("🔄 HistoryContent: Fetching history...");
    setIsLoading(true);
    try {
      const response = await getHistory(1, 50, {
        mode: modeFilter,
        search: searchQuery,
      });
      console.log("📦 HistoryContent: Response:", response);

      if (response.success && response.data) {
        console.log("✅ HistoryContent: Got", response.data.length, "items");
        setHistory(
          response.data.map((item) => ({
            id: item.id,
            originalText: item.originalText,
            simplifiedText: item.simplifiedText,
            mode: item.mode,
            isFavorite: item.isFavorite,
            createdAt: new Date(item.createdAt).toISOString(),
          }))
        );
      } else {
        console.error(
          "❌ HistoryContent: Failed to load history:",
          response.error
        );
      }
    } catch (error) {
      console.error("❌ HistoryContent: Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, [modeFilter, searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSimplification(id);
      if (response.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        toast.success("Deleted successfully");
      } else {
        toast.error(response.error ?? "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await toggleFavorite(id);
      if (response.success && response.data) {
        setHistory((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, isFavorite: response.data!.isFavorite }
              : item
          )
        );
        toast.success(
          response.data.isFavorite
            ? "Added to favorites"
            : "Removed from favorites"
        );
      } else {
        toast.error(response.error ?? "Failed to update favorite");
      }
    } catch {
      toast.error("Failed to update favorite");
    }
  };

  const handleShare = async (id: string) => {
    try {
      const response = await createShareLink(id);
      if (response.success && response.data) {
        await navigator.clipboard.writeText(response.data.url);
        toast.success("Share link copied to clipboard!");
      } else {
        toast.error(response.error ?? "Failed to create share link");
      }
    } catch {
      toast.error("Failed to create share link");
    }
  };

  const handleView = (id: string) => {
    // Navigate to detail view within the dashboard
    router.push(`/dashboard/history/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Clock className="h-8 w-8" />
          History
        </h1>
        <p className="text-muted-foreground">
          View and manage your past simplifications
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={modeFilter}
          onValueChange={(value) =>
            setModeFilter(value as SimplificationMode | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-45">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="accessible">Accessible</SelectItem>
            <SelectItem value="summary">Summary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <HistoryList
          items={history}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
          onView={handleView}
          emptyMessage="No simplifications yet. Start by simplifying some text!"
        />
      )}
    </div>
  );
}
