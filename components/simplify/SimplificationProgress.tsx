"use client";

import { useEffect, useState, useCallback } from "react";
import { Progress } from "@/components/ui/progress";

interface SimplificationProgressProps {
  isLoading: boolean;
}

const STAGES = [
  { progress: 15, message: "Analyzing text complexity..." },
  { progress: 35, message: "Identifying key concepts..." },
  { progress: 55, message: "Simplifying vocabulary..." },
  { progress: 75, message: "Restructuring sentences..." },
  { progress: 90, message: "Finalizing result..." },
];

/**
 * Progress indicator for text simplification
 * Shows staged progress with descriptive messages
 */
export function SimplificationProgress({
  isLoading,
}: SimplificationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const advanceStage = useCallback((currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STAGES.length) {
      setProgress(STAGES[nextIndex].progress);
      setMessage(STAGES[nextIndex].message);
      return nextIndex;
    }
    return currentIndex;
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setMessage("");
      return;
    }

    // Initial stage
    setProgress(STAGES[0].progress);
    setMessage(STAGES[0].message);
    let currentStage = 0;

    // Progress through stages
    const interval = setInterval(() => {
      currentStage = advanceStage(currentStage);
    }, 800); // Advance every 800ms

    return () => clearInterval(interval);
  }, [isLoading, advanceStage]);

  if (!isLoading) return null;

  return (
    <div
      className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/10 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label={`Simplification progress: ${progress}% - ${message}`}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">{message}</span>
        <span className="text-primary font-semibold">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground text-center">
        This may take a few seconds depending on text length
      </p>
    </div>
  );
}
