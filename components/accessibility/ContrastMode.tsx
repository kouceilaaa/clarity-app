"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { Contrast } from "lucide-react";

interface ContrastModeProps {
  className?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  labelPosition?: "left" | "right";
}

/**
 * Toggle component for high contrast mode.
 * Increases contrast ratios for better visibility.
 */
export function ContrastMode({
  className,
  showLabel = true,
  showIcon = true,
  labelPosition = "left",
}: ContrastModeProps) {
  const { theme, updateTheme } = usePreferences();
  const isHighContrast = theme === "high-contrast";

  const handleToggle = () => {
    updateTheme(isHighContrast ? "normal" : "high-contrast");
  };

  const labelContent = (
    <Label
      htmlFor="contrast-mode"
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none",
        labelPosition === "left" ? "order-first" : "order-last"
      )}
    >
      {showIcon && <Contrast className="size-4" />}
      {showLabel && <span>High Contrast Mode</span>}
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
      aria-label="High contrast mode toggle"
    >
      {(showLabel || showIcon) && labelContent}
      <Switch
        id="contrast-mode"
        checked={isHighContrast}
        onCheckedChange={handleToggle}
        aria-describedby="contrast-mode-description"
      />
      <span id="contrast-mode-description" className="sr-only">
        Enables high contrast colors for improved visibility
      </span>
    </div>
  );
}

export default ContrastMode;
