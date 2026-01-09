"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { Accessibility, RotateCcw } from "lucide-react";
import { DyslexiaMode } from "./DyslexiaMode";
import { ContrastMode } from "./ContrastMode";
import { FontSizeControl } from "./FontSizeControl";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Volume2 } from "lucide-react";

interface AccessibilityPanelProps {
  className?: string;
  trigger?: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback for open state changes */
  onOpenChange?: (open: boolean) => void;
  /** If null, no trigger button is rendered (use controlled mode) */
  triggerButton?: React.ReactNode | null;
}

/**
 * Accessibility panel combining all accessibility controls.
 * Can be opened as a dialog or embedded inline.
 * Supports both controlled and uncontrolled modes.
 */
export function AccessibilityPanel({
  className,
  trigger,
  open,
  onOpenChange,
  triggerButton,
}: AccessibilityPanelProps) {
  const { speechRate, updateSpeechRate, resetAllPreferences, isSyncing } =
    usePreferences();

  const content = (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Font Size Section */}
      <section aria-labelledby="font-size-heading">
        <h3 id="font-size-heading" className="sr-only">
          Font Size
        </h3>
        <FontSizeControl />
      </section>

      <Separator />

      {/* Visual Settings Section */}
      <section aria-labelledby="visual-heading">
        <h3
          id="visual-heading"
          className="text-sm font-medium mb-4 flex items-center gap-2"
        >
          Visual Settings
        </h3>
        <div className="flex flex-col gap-4">
          <DyslexiaMode />
          <ContrastMode />
        </div>
      </section>

      <Separator />

      {/* Speech Settings Section */}
      <section aria-labelledby="speech-heading">
        <h3
          id="speech-heading"
          className="text-sm font-medium mb-4 flex items-center gap-2"
        >
          <Volume2 className="size-4" />
          Speech Settings
        </h3>
        <div className="flex flex-col gap-3">
          <Label className="flex items-center justify-between">
            <span>Speech Rate</span>
            <span className="text-muted-foreground">
              {speechRate.toFixed(1)}x
            </span>
          </Label>
          <Slider
            value={[speechRate]}
            onValueChange={(value) => updateSpeechRate(value[0])}
            min={0.5}
            max={2}
            step={0.1}
            aria-label="Speech rate"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>
      </section>

      <Separator />

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={resetAllPreferences}
        disabled={isSyncing}
        className="w-full"
      >
        <RotateCcw className="size-4 mr-2" />
        Reset to Defaults
      </Button>
    </div>
  );

  const defaultTrigger = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Accessibility settings"
        >
          <Accessibility className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Accessibility settings</p>
      </TooltipContent>
    </Tooltip>
  );

  // Controlled mode (no trigger button, open state managed externally)
  if (triggerButton === null) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Accessibility className="size-5" />
              Accessibility Settings
            </DialogTitle>
            <DialogDescription>
              Customize your reading experience with these accessibility
              options.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Uncontrolled mode with trigger button
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {triggerButton ?? trigger ?? defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="size-5" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Customize your reading experience with these accessibility options.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Inline version of the accessibility panel without dialog wrapper.
 */
export function AccessibilityPanelInline({
  className,
}: {
  className?: string;
}) {
  const { speechRate, updateSpeechRate, resetAllPreferences, isSyncing } =
    usePreferences();

  return (
    <div className={cn("flex flex-col gap-6 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Accessibility className="size-5" />
          Accessibility Settings
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetAllPreferences}
          disabled={isSyncing}
        >
          <RotateCcw className="size-4 mr-1" />
          Reset
        </Button>
      </div>

      <Separator />

      {/* Font Size */}
      <FontSizeControl />

      <Separator />

      {/* Visual Settings */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Visual Settings</h3>
        <DyslexiaMode />
        <ContrastMode />
      </div>

      <Separator />

      {/* Speech Rate */}
      <div className="flex flex-col gap-3">
        <Label className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 className="size-4" />
            Speech Rate
          </span>
          <span className="text-muted-foreground">
            {speechRate.toFixed(1)}x
          </span>
        </Label>
        <Slider
          value={[speechRate]}
          onValueChange={(value) => updateSpeechRate(value[0])}
          min={0.5}
          max={2}
          step={0.1}
          aria-label="Speech rate"
        />
      </div>
    </div>
  );
}

export default AccessibilityPanel;
