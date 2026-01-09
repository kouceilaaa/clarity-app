"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Loader2, Trash2, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getFavorites,
  deleteSimplification,
  toggleFavorite,
} from "@/lib/actions/simplification.actions";
import { createShareLink } from "@/lib/actions/share.actions";
import { truncateText } from "@/lib/utils/text.utils";
import { formatRelativeDate } from "@/lib/utils/date";
import { SIMPLIFICATION_CONFIG } from "@/lib/utils/constants";
import type { SimplificationData } from "@/lib/types";

export function FavoritesContent() {
  const [favorites, setFavorites] = useState<SimplificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    console.log("⭐ FavoritesContent: Fetching favorites...");
    setIsLoading(true);
    try {
      const response = await getFavorites(1, 50);
      console.log("📦 FavoritesContent: Response:", response);
      if (response.success && response.data) {
        console.log(
          "✅ FavoritesContent: Got",
          response.data.length,
          "favorites"
        );
        setFavorites(response.data);
      } else {
        console.error("❌ FavoritesContent: Failed:", response.error);
      }
    } catch (error) {
      console.error("❌ FavoritesContent: Error:", error);
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (id: string) => {
    try {
      const response = await toggleFavorite(id);
      if (response.success) {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
        toast.success("Removed from favorites");
      } else {
        toast.error(response.error ?? "Failed to remove from favorites");
      }
    } catch {
      toast.error("Failed to remove from favorites");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSimplification(id);
      if (response.success) {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
        toast.success("Deleted successfully");
      } else {
        toast.error(response.error ?? "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
          Favorites
        </h1>
        <p className="text-muted-foreground">
          Your saved simplifications for easy access
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No favorites yet</p>
              <p className="text-sm">
                Star your simplifications to save them here for quick access
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline">
                    {SIMPLIFICATION_CONFIG.MODE_EMOJIS[item.mode]}{" "}
                    {SIMPLIFICATION_CONFIG.MODE_LABELS[item.mode]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFavorite(item.id)}
                    aria-label="Remove from favorites"
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </Button>
                </div>
                <CardDescription>
                  {formatRelativeDate(new Date(item.createdAt))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {truncateText(item.simplifiedText, 150)}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(item.id)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/shared/${item.id}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
