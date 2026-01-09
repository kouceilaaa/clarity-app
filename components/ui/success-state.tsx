"use client";

import { CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SuccessStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export function SuccessState({
  title,
  description,
  icon: Icon = CheckCircle2,
  action,
  secondaryAction,
  className,
  compact = false,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-6 px-4" : "py-12 px-8",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 animate-scale-in",
          compact ? "p-3" : "p-4"
        )}
      >
        <Icon
          className={cn(
            "text-green-600 dark:text-green-400",
            compact ? "h-6 w-6" : "h-8 w-8"
          )}
        />
      </div>

      <h3
        className={cn(
          "font-semibold text-foreground animate-fade-in",
          compact ? "text-base mb-1" : "text-xl mb-2"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground animate-fade-in",
            compact ? "text-sm mb-4" : "text-base mb-6 max-w-md"
          )}
        >
          {description}
        </p>
      )}

      {(action ?? secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-2 animate-slide-up">
          {action && (
            <Button onClick={action.onClick} size={compact ? "sm" : "default"}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size={compact ? "sm" : "default"}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
