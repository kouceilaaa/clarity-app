"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SimplificationDetail } from "@/components/history/SimplificationDetail";
import {
  getSimplificationById,
  toggleFavorite,
  deleteSimplification,
} from "@/lib/actions/simplification.actions";
import type { SimplificationData } from "@/lib/types";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [simplification, setSimplification] =
    useState<SimplificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSimplification() {
      console.log("🔍 HistoryDetailPage: Fetching simplification:", id);
      setIsLoading(true);
      setError(null);

      try {
        const response = await getSimplificationById(id);
        console.log("📦 HistoryDetailPage: Response:", response);

        if (response.success && response.data) {
          setSimplification(response.data);
        } else {
          setError(response.error ?? "Failed to load simplification");
        }
      } catch (err) {
        console.error("❌ HistoryDetailPage: Error:", err);
        setError("Failed to load simplification");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchSimplification();
    }
  }, [id]);

  const handleToggleFavorite = async (simplificationId: string) => {
    try {
      const response = await toggleFavorite(simplificationId);
      if (response.success && response.data) {
        setSimplification(response.data);
        toast.success(
          response.data.isFavorite
            ? "Added to favorites"
            : "Removed from favorites"
        );
      } else {
        toast.error(response.error ?? "Failed to update favorite");
      }
    } catch {
      toast.error("Failed to update favorite status");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSimplification(id);
      if (response.success) {
        toast.success("Deleted successfully");
        router.push("/dashboard/history");
      } else {
        toast.error(response.error ?? "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !simplification) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/history")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {error ?? "Simplification not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/history")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </Button>

      <SimplificationDetail
        item={{
          id: simplification.id,
          originalText: simplification.originalText,
          simplifiedText: simplification.simplifiedText,
          mode: simplification.mode,
          sourceUrl: simplification.sourceUrl,
          isFavorite: simplification.isFavorite,
          createdAt:
            simplification.createdAt instanceof Date
              ? simplification.createdAt.toISOString()
              : String(simplification.createdAt),
          statistics: simplification.statistics,
        }}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleDelete}>
          Delete this simplification
        </Button>
      </div>
    </div>
  );
}
