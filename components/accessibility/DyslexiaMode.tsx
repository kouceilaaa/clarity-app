"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { BookOpen } from "lucide-react";

interface DyslexiaModeProps {
  className?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  labelPosition?: "left" | "right";
}

/**
 * Toggle component for dyslexia-friendly mode.
 * Applies OpenDyslexic font and increased letter spacing when enabled.
 */
export function DyslexiaMode({
  className,
  showLabel = true,
  showIcon = true,
  labelPosition = "left",
}: DyslexiaModeProps) {
  const { dyslexiaMode, toggleDyslexia } = usePreferences();

  const labelContent = (
    <Label
      htmlFor="dyslexia-mode"
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none",
        labelPosition === "left" ? "order-first" : "order-last"
      )}
    >
      {showIcon && <BookOpen className="size-4" />}
      {showLabel && <span>Dyslexia-Friendly Mode</span>}
    </Label>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        labelPosition === "right" ? "flex-row-reverse" : "flex-row",
        className
      )}
      role="group"
      aria-label="Dyslexia mode toggle"
    >
      {(showLabel || showIcon) && labelContent}
      <Switch
        id="dyslexia-mode"
        checked={dyslexiaMode}
        onCheckedChange={toggleDyslexia}
        aria-describedby="dyslexia-mode-description"
      />
      <span id="dyslexia-mode-description" className="sr-only">
        Enables OpenDyslexic font and increased letter spacing for improved
        readability
      </span>
    </div>
  );
}

export default DyslexiaMode;
