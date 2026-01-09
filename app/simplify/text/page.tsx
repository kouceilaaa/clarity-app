"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout";
import { SimplifyTextForm, SimplificationResult } from "@/components/simplify";
import {
  simplifyText,
  toggleFavorite,
} from "@/lib/actions/simplification.actions";
import { createShareLink } from "@/lib/actions/share.actions";
import type { SimplificationData, SimplificationMode } from "@/lib/types";

export default function SimplifyTextPage() {
  const [result, setResult] = useState<SimplificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (text: string, mode: SimplificationMode) => {
    setIsLoading(true);
    try {
      const response = await simplifyText({ text, mode, saveToHistory: true });
      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Text simplified successfully!");
      } else {
        toast.error(response.error ?? "Failed to simplify text");
      }
    } catch {
      toast.error("Failed to simplify text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await toggleFavorite(id);
      if (response.success && response.data) {
        setResult(response.data);
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Simplify Text</h1>
            <p className="text-muted-foreground">
              Paste your text and we&apos;ll make it easier to understand
            </p>
          </div>

          <SimplifyTextForm onSubmit={handleSubmit} isLoading={isLoading} />

          {result && (
            <SimplificationResult
              data={result}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          )}
        </div>
      </main>
    </div>
  );
}
