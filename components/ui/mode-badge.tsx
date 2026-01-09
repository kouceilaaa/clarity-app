"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { SimplificationMode } from "@/lib/types";

interface ModeBadgeProps {
  mode: SimplificationMode;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const modeConfig: Record<
  SimplificationMode,
  { label: string; emoji: string; className: string }
> = {
  simple: {
    label: "Simple",
    emoji: "🌱",
    className: "badge-mode-simple border-0",
  },
  accessible: {
    label: "Accessible",
    emoji: "♿",
    className: "badge-mode-accessible border-0",
  },
  summary: {
    label: "Summary",
    emoji: "📝",
    className: "badge-mode-summary border-0",
  },
};

/**
 * Reusable badge component for simplification modes.
 * Displays consistent styling with mode-specific colors.
 */
export function ModeBadge({
  mode,
  showIcon = true,
  size = "default",
  className,
}: ModeBadgeProps) {
  const config = modeConfig[mode];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <Badge
      variant="outline"
      className={cn(config.className, sizeClasses[size], className)}
    >
      {showIcon && <span className="mr-1">{config.emoji}</span>}
      {config.label}
    </Badge>
  );
}
