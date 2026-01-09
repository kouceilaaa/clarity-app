"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { completeOnboarding } from "@/lib/actions/preferences.actions";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Type,
  Accessibility,
  Volume2,
  Palette,
} from "lucide-react";
import { FontSizeControl } from "@/components/accessibility/FontSizeControl";
import { DyslexiaMode } from "@/components/accessibility/DyslexiaMode";
import { ContrastMode } from "@/components/accessibility/ContrastMode";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SimplificationMode } from "@/lib/types";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

/**
 * Multi-step onboarding wizard for new users.
 * Guides users through accessibility preferences and app features.
 */
export function OnboardingWizard({
  open,
  onOpenChange,
  onComplete,
  onSkip,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const {
    speechRate,
    defaultMode,
    updateSpeechRate,
    updateDefaultMode,
    isAuthenticated,
  } = usePreferences();

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to ClarityWeb",
      description:
        "Let's customize your reading experience in just a few steps.",
      icon: <Sparkles className="size-8 text-primary" />,
      content: (
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-10 text-primary" />
          </div>
          <p className="text-muted-foreground max-w-sm">
            ClarityWeb helps you simplify complex text into easy-to-understand
            language. We&apos;ll help you set up your preferences for the best
            experience.
          </p>
        </div>
      ),
    },
    {
      id: "font-size",
      title: "Adjust Text Size",
      description: "Choose a comfortable text size for reading.",
      icon: <Type className="size-8 text-primary" />,
      content: (
        <div className="py-6">
          <FontSizeControl showButtons showValue showIcon showLabel />
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm" style={{ fontSize: "inherit" }}>
              Preview: The quick brown fox jumps over the lazy dog. This
              sentence contains every letter of the alphabet.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "accessibility",
      title: "Accessibility Options",
      description: "Enable features for improved readability.",
      icon: <Accessibility className="size-8 text-primary" />,
      content: (
        <div className="flex flex-col gap-6 py-6">
          <DyslexiaMode showLabel showIcon />
          <p className="text-sm text-muted-foreground pl-6">
            Uses OpenDyslexic font with increased spacing for easier reading.
          </p>

          <ContrastMode showLabel showIcon />
          <p className="text-sm text-muted-foreground pl-6">
            Increases color contrast for better visibility.
          </p>
        </div>
      ),
    },
    {
      id: "speech",
      title: "Text-to-Speech",
      description: "Configure how text is read aloud.",
      icon: <Volume2 className="size-8 text-primary" />,
      content: (
        <div className="flex flex-col gap-6 py-6">
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Normal (1.0x)</span>
              <span>Faster</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            You can use the play button on any simplified text to hear it read
            aloud.
          </p>
        </div>
      ),
    },
    {
      id: "mode",
      title: "Default Simplification Mode",
      description: "Choose your preferred simplification style.",
      icon: <Palette className="size-8 text-primary" />,
      content: (
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-3">
            <Label>Default Mode</Label>
            <Select
              value={defaultMode}
              onValueChange={(value) =>
                updateDefaultMode(value as SimplificationMode)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">
                  <div className="flex flex-col">
                    <span>Simple</span>
                    <span className="text-xs text-muted-foreground">
                      Basic simplification
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="accessible">
                  <div className="flex flex-col">
                    <span>Accessible</span>
                    <span className="text-xs text-muted-foreground">
                      Clear and easy to understand
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="summary">
                  <div className="flex flex-col">
                    <span>Summary</span>
                    <span className="text-xs text-muted-foreground">
                      Key points only
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Mode Descriptions:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong>Simple:</strong> Reduces complexity while maintaining
                detail.
              </li>
              <li>
                <strong>Accessible:</strong> Optimized for clarity and
                understanding.
              </li>
              <li>
                <strong>Summary:</strong> Extracts the main points only.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "complete",
      title: "You're All Set!",
      description: "Your preferences have been saved.",
      icon: <Check className="size-8 text-green-500" />,
      content: (
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="size-10 text-green-500" />
          </div>
          <p className="text-muted-foreground max-w-sm">
            Your preferences have been saved. You can change them anytime from
            the settings menu. Start simplifying text now!
          </p>
        </div>
      ),
    },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      if (isAuthenticated) {
        await completeOnboarding();
      } else {
        // Store in localStorage for non-authenticated users
        localStorage.setItem("clarity-onboarding-completed", "true");
      }
      onComplete?.();
      onOpenChange?.(false);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      onComplete?.(); // Complete anyway
      onOpenChange?.(false);
    } finally {
      setIsCompleting(false);
    }
  }, [isAuthenticated, onComplete, onOpenChange]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [isLastStep, totalSteps, handleComplete]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSkip = useCallback(async () => {
    if (onSkip) {
      onSkip();
    } else {
      await handleComplete();
    }
  }, [onSkip, handleComplete]);

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {currentStepData.icon}
            <div>
              <DialogTitle>{currentStepData.title}</DialogTitle>
              <DialogDescription>
                {currentStepData.description}
              </DialogDescription>
            </div>
          </div>
          <Progress value={progress} className="h-1" />
        </DialogHeader>

        <div className="min-h-64">{currentStepData.content}</div>

        <DialogFooter className="flex-row justify-between gap-2">
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="size-4 mr-2" />
                Previous
              </Button>
            )}
            {isFirstStep && onSkip && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip Setup
              </Button>
            )}
          </div>

          <Button onClick={handleNext} disabled={isCompleting}>
            {isLastStep ? (
              isCompleting ? (
                "Saving..."
              ) : (
                <>
                  Get Started
                  <Check className="size-4 ml-2" />
                </>
              )
            ) : (
              <>
                Next
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mt-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "size-2 rounded-full transition-colors",
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              )}
              aria-label={`Go to step ${index + 1}: ${step.title}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingWizard;
