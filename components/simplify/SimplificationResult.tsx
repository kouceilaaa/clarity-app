"use client";

import { useState } from "react";
import { Copy, Check, Star, Share2, Highlighter } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/stores";
import {
  selectFontSize,
  selectDyslexiaMode,
} from "@/lib/stores/preferencesSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShareDialog } from "@/components/shared/ShareDialog";
import { ExportButton } from "@/components/shared/ExportButton";
import { DynamicTextToSpeechHighlight } from "@/lib/lazy";
import { SIMPLIFICATION_CONFIG, FLESCH_RANGES } from "@/lib/utils/constants";
import type { SimplificationData } from "@/lib/types";

interface SimplificationResultProps {
  data: SimplificationData;
  onToggleFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
}

function getFleschLabel(score: number) {
  for (const [, range] of Object.entries(FLESCH_RANGES)) {
    if (score >= range.min && score < range.max) {
      return range;
    }
  }
  return FLESCH_RANGES.VERY_DIFFICULT;
}

export function SimplificationResult({
  data,
  onToggleFavorite,
}: SimplificationResultProps) {
  const [copied, setCopied] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  // Get user preferences from Redux
  const fontSize = useAppSelector(selectFontSize);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);

  const fleschBefore = getFleschLabel(data.statistics.fleschBefore);
  const fleschAfter = getFleschLabel(data.statistics.fleschAfter);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.simplifiedText);
      setCopied(true);
      toast.success("Text copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  // Calculate font size style based on preferences
  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: dyslexiaMode ? "'OpenDyslexic', sans-serif" : "inherit",
    letterSpacing: dyslexiaMode ? "0.05em" : "normal",
    lineHeight: dyslexiaMode ? "1.8" : "1.75",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Simplified Result
              <Badge variant="outline">
                {SIMPLIFICATION_CONFIG.MODE_EMOJIS[data.mode]}{" "}
                {SIMPLIFICATION_CONFIG.MODE_LABELS[data.mode]}
              </Badge>
            </CardTitle>
            <CardDescription>
              {data.sourceUrl ? `From: ${data.sourceUrl}` : "Direct text input"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(data.id)}
                aria-label={
                  data.isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Star
                  className={`h-4 w-4 ${
                    data.isFavorite
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">
              {data.statistics.wordsCountAfter}
            </p>
            <p className="text-xs text-muted-foreground">Words</p>
            <p className="text-xs text-green-600">
              -
              {data.statistics.wordsCountBefore -
                data.statistics.wordsCountAfter}{" "}
              reduced
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">
              {data.statistics.readingTimeAfter}min
            </p>
            <p className="text-xs text-muted-foreground">Reading Time</p>
            <p className="text-xs text-green-600">
              -
              {data.statistics.readingTimeBefore -
                data.statistics.readingTimeAfter}
              min saved
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{data.statistics.fleschBefore}</p>
            <p className="text-xs text-muted-foreground">Original Score</p>
            <p className="text-xs" style={{ color: fleschBefore.color }}>
              {fleschBefore.label}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{data.statistics.fleschAfter}</p>
            <p className="text-xs text-muted-foreground">Simplified Score</p>
            <p className="text-xs" style={{ color: fleschAfter.color }}>
              {fleschAfter.label}
            </p>
          </div>
        </div>

        {/* Readability Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Readability Improvement</span>
            <span className="text-green-600 font-medium">
              +{data.statistics.fleschAfter - data.statistics.fleschBefore}{" "}
              points
            </span>
          </div>
          <Progress value={data.statistics.fleschAfter} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Difficult</span>
            <span>Easy to Read</span>
          </div>
        </div>

        <Separator />

        {/* Text-to-Speech with Highlighting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Simplified Text</Label>
            <div className="flex items-center gap-2">
              <Highlighter className="h-4 w-4 text-muted-foreground" />
              <Label
                htmlFor="highlight-toggle"
                className="text-xs text-muted-foreground"
              >
                Word highlighting
              </Label>
              <Switch
                id="highlight-toggle"
                checked={highlightEnabled}
                onCheckedChange={setHighlightEnabled}
                aria-label="Toggle word highlighting during speech"
              />
            </div>
          </div>
          <ScrollArea className="h-75 rounded-md border p-4">
            {highlightEnabled ? (
              <DynamicTextToSpeechHighlight
                text={data.simplifiedText}
                textClassName="whitespace-pre-wrap"
                highlightColor="bg-yellow-200 dark:bg-yellow-900"
              />
            ) : (
              <p className="whitespace-pre-wrap" style={textStyle}>
                {data.simplifiedText}
              </p>
            )}
          </ScrollArea>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <ExportButton data={data} variant="outline" />
        <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        simplificationId={data.id}
        title={
          data.sourceUrl ? `Simplified: ${data.sourceUrl}` : "Simplified Text"
        }
      />
    </Card>
  );
}
