"use client";

import { useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { Minus, Plus, Type } from "lucide-react";

interface FontSizeControlProps {
  className?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  showValue?: boolean;
  showButtons?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Font size control with slider and +/- buttons.
 * Allows users to adjust the base font size for better readability.
 */
export function FontSizeControl({
  className,
  showLabel = true,
  showIcon = true,
  showValue = true,
  showButtons = true,
  min = 12,
  max = 24,
  step = 1,
}: FontSizeControlProps) {
  const { fontSize, updateFontSize } = usePreferences();

  const handleSliderChange = useCallback(
    (value: number[]) => {
      updateFontSize(value[0]);
    },
    [updateFontSize]
  );

  const decreaseFontSize = useCallback(() => {
    const newSize = Math.max(min, fontSize - step);
    updateFontSize(newSize);
  }, [fontSize, min, step, updateFontSize]);

  const increaseFontSize = useCallback(() => {
    const newSize = Math.min(max, fontSize + step);
    updateFontSize(newSize);
  }, [fontSize, max, step, updateFontSize]);

  const resetFontSize = useCallback(() => {
    updateFontSize(16);
  }, [updateFontSize]);

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="group"
      aria-label="Font size control"
    >
      {/* Label */}
      {showLabel && (
        <Label className="flex items-center gap-2">
          {showIcon && <Type className="size-4" />}
          <span>Font Size</span>
          {showValue && (
            <span className="ml-auto text-muted-foreground">{fontSize}px</span>
          )}
        </Label>
      )}

      {/* Slider with buttons */}
      <div className="flex items-center gap-3">
        {showButtons && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={decreaseFontSize}
            disabled={fontSize <= min}
            aria-label="Decrease font size"
          >
            <Minus className="size-4" />
          </Button>
        )}

        <Slider
          value={[fontSize]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="flex-1"
          aria-label="Font size slider"
        />

        {showButtons && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={increaseFontSize}
            disabled={fontSize >= max}
            aria-label="Increase font size"
          >
            <Plus className="size-4" />
          </Button>
        )}
      </div>

      {/* Size indicators */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Small</span>
        <button
          type="button"
          onClick={resetFontSize}
          className="hover:text-foreground transition-colors cursor-pointer"
          aria-label="Reset to default font size"
        >
          Default (16px)
        </button>
        <span>Large</span>
      </div>
    </div>
  );
}

export default FontSizeControl;
