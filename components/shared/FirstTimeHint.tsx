"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FirstTimeHintProps {
  /** Unique key for localStorage persistence */
  hintKey: string;
  /** The hint message to display */
  message: string;
  /** Optional title for the hint */
  title?: string;
  /** Position of the hint relative to its container */
  position?: "top" | "bottom" | "inline";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the hint (overrides persistence) */
  forceShow?: boolean;
  /** Callback when hint is dismissed */
  onDismiss?: () => void;
}

const STORAGE_PREFIX = "clarity_hint_dismissed_";

/**
 * FirstTimeHint - A dismissible hint component for first-time users.
 *
 * Shows helpful tips that can be permanently dismissed. Persists dismissal
 * state in localStorage so hints don't reappear after being dismissed.
 *
 * @example
 * ```tsx
 * <FirstTimeHint
 *   hintKey="simplify-mode"
 *   title="Choose your mode"
 *   message="Simple mode uses very basic language, while Accessible provides a balance."
 * />
 * ```
 */
export function FirstTimeHint({
  hintKey,
  message,
  title,
  position = "inline",
  className,
  forceShow = false,
  onDismiss,
}: FirstTimeHintProps) {
  const [isDismissed, setIsDismissed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage for dismissal state
    const storageKey = `${STORAGE_PREFIX}${hintKey}`;
    const dismissed = localStorage.getItem(storageKey) === "true";
    setIsDismissed(dismissed);

    // Show hint with animation after mount
    if (!dismissed || forceShow) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [hintKey, forceShow]);

  const handleDismiss = () => {
    setIsVisible(false);

    // Wait for animation to complete before hiding
    setTimeout(() => {
      const storageKey = `${STORAGE_PREFIX}${hintKey}`;
      localStorage.setItem(storageKey, "true");
      setIsDismissed(true);
      onDismiss?.();
    }, 200);
  };

  // Don't render if dismissed (unless forced)
  if (isDismissed && !forceShow) {
    return null;
  }

  const positionClasses = {
    top: "mb-4",
    bottom: "mt-4",
    inline: "",
  };

  return (
    <div
      role="note"
      aria-label="Helpful tip"
      className={cn(
        "relative flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm",
        "transition-all duration-200",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        positionClasses[position],
        className
      )}
    >
      <Lightbulb className="size-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-foreground mb-0.5">{title}</p>}
        <p className="text-muted-foreground leading-relaxed">{message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 shrink-0 -mr-1 -mt-1 hover:bg-primary/10"
        onClick={handleDismiss}
        aria-label="Dismiss hint"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

/**
 * Helper to reset all dismissed hints (useful for testing or user request)
 */
export function resetAllHints() {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith(STORAGE_PREFIX)
  );
  keys.forEach((key) => localStorage.removeItem(key));
}

/**
 * Helper to check if a specific hint has been dismissed
 */
export function isHintDismissed(hintKey: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}${hintKey}`) === "true";
}
