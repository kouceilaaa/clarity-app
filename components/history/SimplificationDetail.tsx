"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  FileText,
  Star,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeBadge } from "@/components/ui";
import { ExportButton } from "@/components/shared/ExportButton";
import { ShareDialog } from "@/components/shared/ShareDialog";
import { TextToSpeech } from "@/components/accessibility/TextToSpeech";
import type { SimplificationMode, SimplificationData } from "@/lib/types";

interface SimplificationDetailProps {
  item: {
    id: string;
    originalText: string;
    simplifiedText: string;
    mode: SimplificationMode;
    sourceUrl?: string;
    isFavorite: boolean;
    createdAt: string;
    statistics?: SimplificationData["statistics"];
  };
  onToggleFavorite?: (id: string) => void;
}

export function SimplificationDetail({
  item,
  onToggleFavorite,
}: SimplificationDetailProps) {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.simplifiedText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Calculate statistics if not provided
  const stats = item.statistics ?? {
    wordsCountBefore: item.originalText.split(/\s+/).filter(Boolean).length,
    wordsCountAfter: item.simplifiedText.split(/\s+/).filter(Boolean).length,
    readingTimeBefore: Math.ceil(
      item.originalText.split(/\s+/).filter(Boolean).length / 200
    ),
    readingTimeAfter: Math.ceil(
      item.simplifiedText.split(/\s+/).filter(Boolean).length / 200
    ),
    fleschBefore: 50,
    fleschAfter: 70,
  };

  const wordReduction = Math.round(
    ((stats.wordsCountBefore - stats.wordsCountAfter) /
      stats.wordsCountBefore) *
      100
  );

  const toSimplificationData = (): SimplificationData => ({
    id: item.id,
    originalText: item.originalText,
    simplifiedText: item.simplifiedText,
    mode: item.mode,
    sourceUrl: item.sourceUrl,
    isFavorite: item.isFavorite,
    createdAt: new Date(item.createdAt),
    statistics: stats,
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ModeBadge mode={item.mode} />
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  View source
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onToggleFavorite && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFavorite(item.id)}
                    className={cn(item.isFavorite && "text-yellow-500")}
                    aria-label={
                      item.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Star
                      className={cn(
                        "h-5 w-5",
                        item.isFavorite && "fill-yellow-500"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {item.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShareDialogOpen(true)}
                  aria-label="Share this simplification"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this simplification</p>
              </TooltipContent>
            </Tooltip>
            <ExportButton data={toSimplificationData()} variant="ghost" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Words Reduced"
              value={`${wordReduction}%`}
              trend="down"
            />
            <StatCard
              label="Words Before"
              value={stats.wordsCountBefore.toString()}
            />
            <StatCard
              label="Words After"
              value={stats.wordsCountAfter.toString()}
            />
            <StatCard
              label="Reading Time"
              value={`${stats.readingTimeAfter} min`}
              sublabel={`was ${stats.readingTimeBefore} min`}
            />
          </div>

          {/* Simplified Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Simplified Text</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <TextToSpeech text={item.simplifiedText} showSpeedControl />
              </div>
            </div>
            <Card className="bg-linear-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {item.simplifiedText}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Original Text (Collapsible) */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setShowOriginal(!showOriginal)}
              className="w-full justify-between text-sm text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Original Text</span>
              </div>
              {showOriginal ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showOriginal && (
              <Card className="mt-2 border-border/50 animate-fade-in">
                <CardContent className="p-4 sm:p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                      {item.originalText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        simplificationId={item.id}
        title="Simplified Text"
      />
    </div>
  );
}

// Small stat card for detail view
function StatCard({
  label,
  value,
  sublabel,
  trend,
}: {
  label: string;
  value: string;
  sublabel?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs",
              trend === "down" ? "text-green-500" : "text-red-500"
            )}
          >
            {trend === "down" ? "↓" : "↑"}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      )}
    </div>
  );
}
