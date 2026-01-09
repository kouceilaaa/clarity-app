"use client";

import { useState } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, selectDefaultMode } from "@/lib/stores";
import { SIMPLIFICATION_CONFIG } from "@/lib/utils/constants";
import { countWords } from "@/lib/utils/text.utils";
import type { SimplificationMode } from "@/lib/types";

interface SimplifyTextFormProps {
  onSubmit: (text: string, mode: SimplificationMode) => Promise<void>;
  isLoading?: boolean;
}

export function SimplifyTextForm({
  onSubmit,
  isLoading = false,
}: SimplifyTextFormProps) {
  const defaultMode = useAppSelector(selectDefaultMode);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<SimplificationMode>(defaultMode);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(text);
  const charCount = text.length;
  const isValidLength =
    charCount >= SIMPLIFICATION_CONFIG.MIN_TEXT_LENGTH &&
    charCount <= SIMPLIFICATION_CONFIG.MAX_TEXT_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (charCount < SIMPLIFICATION_CONFIG.MIN_TEXT_LENGTH) {
      setError(
        `Text must be at least ${SIMPLIFICATION_CONFIG.MIN_TEXT_LENGTH} characters`
      );
      return;
    }

    if (charCount > SIMPLIFICATION_CONFIG.MAX_TEXT_LENGTH) {
      setError(
        `Text cannot exceed ${SIMPLIFICATION_CONFIG.MAX_TEXT_LENGTH.toLocaleString()} characters`
      );
      return;
    }

    await onSubmit(text, mode);
  };

  const handleClear = () => {
    setText("");
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simplify Text</CardTitle>
        <CardDescription>
          Paste or type the text you want to simplify
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Input */}
          <FormFieldWrapper
            htmlFor="text-input"
            label="Your Text"
            error={error ?? undefined}
            description={`${wordCount} words, ${charCount.toLocaleString()} / ${SIMPLIFICATION_CONFIG.MAX_TEXT_LENGTH.toLocaleString()} characters`}
          >
            <Textarea
              id="text-input"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              className="min-h-[200px] resize-y"
              aria-invalid={Boolean(error)}
            />
          </FormFieldWrapper>

          {/* Mode Selection */}
          <FormFieldWrapper
            htmlFor="mode-select"
            label="Simplification Mode"
            description={SIMPLIFICATION_CONFIG.MODE_DESCRIPTIONS[mode]}
          >
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as SimplificationMode)}
              disabled={isLoading}
            >
              <SelectTrigger id="mode-select">
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                {SIMPLIFICATION_CONFIG.MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    <div className="flex items-center gap-2">
                      <span>{SIMPLIFICATION_CONFIG.MODE_EMOJIS[m]}</span>
                      <span>{SIMPLIFICATION_CONFIG.MODE_LABELS[m]}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {SIMPLIFICATION_CONFIG.MODE_EXAMPLES[m]}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={isLoading || !isValidLength || text.trim().length === 0}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Simplifying..." : "Simplify"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isLoading || text.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
