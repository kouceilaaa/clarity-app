"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Trash2, Star, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "@/components/shared/ExportButton";
import { ShareDialog } from "@/components/shared/ShareDialog";
import type { SimplificationMode, SimplificationData } from "@/lib/types";

export interface HistoryItem {
  id: string;
  originalText: string;
  simplifiedText: string;
  mode: SimplificationMode;
  sourceUrl?: string;
  isFavorite: boolean;
  createdAt: string;
  statistics?: SimplificationData["statistics"];
}

interface HistoryListProps {
  items: HistoryItem[];
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onView?: (id: string) => void;
  emptyMessage?: string;
}

const modeColors: Record<SimplificationMode, string> = {
  simple: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  accessible: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  summary:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

export function HistoryList({
  items,
  onDelete,
  onToggleFavorite,
  onView,
  emptyMessage = "No items to display",
}: HistoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(null);
    onDelete?.(id);
  };

  const handleShare = (id: string) => {
    setSelectedItemId(id);
    setShareDialogOpen(true);
  };

  // Convert HistoryItem to SimplificationData for ExportButton
  const toSimplificationData = (item: HistoryItem): SimplificationData => ({
    id: item.id,
    originalText: item.originalText,
    simplifiedText: item.simplifiedText,
    mode: item.mode,
    sourceUrl: item.sourceUrl,
    isFavorite: item.isFavorite,
    createdAt: new Date(item.createdAt),
    statistics: item.statistics ?? {
      wordsCountBefore: item.originalText.split(/\s+/).length,
      wordsCountAfter: item.simplifiedText.split(/\s+/).length,
      readingTimeBefore: Math.ceil(item.originalText.split(/\s+/).length / 200),
      readingTimeAfter: Math.ceil(
        item.simplifiedText.split(/\s+/).length / 200
      ),
      fleschBefore: 50,
      fleschAfter: 70,
    },
  });

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base line-clamp-1">
                  {item.originalText.substring(0, 100)}
                  {item.originalText.length > 100 ? "..." : ""}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <Badge variant="secondary" className={modeColors[item.mode]}>
                    {item.mode}
                  </Badge>
                  {item.sourceUrl && (
                    <Badge variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      URL
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {item.simplifiedText}
            </p>
            <div className="flex items-center gap-2">
              {onView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(item.id)}
                >
                  View
                </Button>
              )}
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(item.id)}
                  className={item.isFavorite ? "text-yellow-500" : ""}
                >
                  <Star
                    className={`h-4 w-4 ${
                      item.isFavorite ? "fill-current" : ""
                    }`}
                  />
                </Button>
              )}
              <ExportButton
                data={toSimplificationData(item)}
                variant="ghost"
                size="sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(item.id)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {onDelete && (
                <AlertDialog
                  open={deletingId === item.id}
                  onOpenChange={(open) => !open && setDeletingId(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingId(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this simplification from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Share Dialog */}
      {selectedItemId && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          simplificationId={selectedItemId}
          title="Simplified Text"
        />
      )}
    </div>
  );
}
