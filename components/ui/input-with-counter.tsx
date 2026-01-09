"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface InputWithCounterProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
  showCounter?: boolean;
  warningThreshold?: number;
}

function InputWithCounter({
  maxLength,
  value,
  onChange,
  showCounter = true,
  warningThreshold = 0.9,
  className,
  ...props
}: InputWithCounterProps) {
  const currentLength = value.length;
  const percentage = currentLength / maxLength;
  const isWarning = percentage >= warningThreshold;
  const isError = currentLength >= maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleChange}
        className={cn(showCounter && "pr-16", className)}
        maxLength={maxLength}
        {...props}
      />
      {showCounter && (
        <span
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums transition-colors",
            isError
              ? "text-destructive font-medium"
              : isWarning
              ? "text-warning font-medium"
              : "text-muted-foreground"
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}

interface TextareaWithCounterProps
  extends Omit<React.ComponentProps<"textarea">, "onChange"> {
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
  showCounter?: boolean;
  warningThreshold?: number;
}

function TextareaWithCounter({
  maxLength,
  value,
  onChange,
  showCounter = true,
  warningThreshold = 0.9,
  className,
  ...props
}: TextareaWithCounterProps) {
  const currentLength = value.length;
  const percentage = currentLength / maxLength;
  const isWarning = percentage >= warningThreshold;
  const isError = currentLength >= maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={handleChange}
        className={className}
        maxLength={maxLength}
        {...props}
      />
      {showCounter && (
        <div
          className={cn(
            "absolute bottom-2 right-3 text-xs tabular-nums transition-colors",
            isError
              ? "text-destructive font-medium"
              : isWarning
              ? "text-warning font-medium"
              : "text-muted-foreground"
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{currentLength}</span>
          <span className="text-muted-foreground/60"> / </span>
          <span>{maxLength}</span>
        </div>
      )}
    </div>
  );
}

export { InputWithCounter, TextareaWithCounter };
export type { InputWithCounterProps, TextareaWithCounterProps };
