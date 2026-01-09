"use client";

import { useState } from "react";
import { Link as LinkIcon, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout";
import { SimplificationResult } from "@/components/simplify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/stores";
import { SIMPLIFICATION_CONFIG } from "@/lib/utils/constants";
import { isValidUrl } from "@/lib/utils/text.utils";
import {
  simplifyFromUrl,
  toggleFavorite,
} from "@/lib/actions/simplification.actions";
import { createShareLink } from "@/lib/actions/share.actions";
import type { SimplificationData, SimplificationMode } from "@/lib/types";

export default function SimplifyUrlPage() {
  const defaultMode = useAppSelector((state) => state.preferences.defaultMode);
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<SimplificationMode>(defaultMode);
  const [result, setResult] = useState<SimplificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setIsLoading(true);
    try {
      const response = await simplifyFromUrl({ url, mode });
      if (response.success && response.data) {
        setResult({ ...response.data, sourceUrl: url });
        toast.success("URL content simplified successfully!");
      } else {
        toast.error(response.error ?? "Failed to extract content from URL");
      }
    } catch {
      toast.error("Failed to extract content from URL. Please try again.");
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
            <h1 className="text-3xl font-bold">Simplify from URL</h1>
            <p className="text-muted-foreground">
              Enter a URL and we&apos;ll extract and simplify the content
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Enter URL
              </CardTitle>
              <CardDescription>
                We&apos;ll extract the main content from the webpage and
                simplify it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">Website URL</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "url-error" : undefined}
                  />
                  {error && (
                    <p id="url-error" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode-select">Simplification Mode</Label>
                  <Select
                    value={mode}
                    onValueChange={(value) =>
                      setMode(value as SimplificationMode)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="mode-select">
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIMPLIFICATION_CONFIG.MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          <div className="flex items-center gap-2">
                            <span>{SIMPLIFICATION_CONFIG.MODE_EMOJIS[m]}</span>
                            <span>{SIMPLIFICATION_CONFIG.MODE_LABELS[m]}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {SIMPLIFICATION_CONFIG.MODE_EXAMPLES[m]}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {SIMPLIFICATION_CONFIG.MODE_DESCRIPTIONS[mode]}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Extracting & Simplifying..." : "Simplify URL"}
                </Button>
              </form>
            </CardContent>
          </Card>

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
