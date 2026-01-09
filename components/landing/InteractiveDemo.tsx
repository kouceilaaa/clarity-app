"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DemoResult {
  original: string;
  simplified: string;
}

const SAMPLE_TEXTS = [
  {
    label: "Academic",
    text: "The implementation of sustainable development practices necessitates a comprehensive understanding of the multifaceted environmental, economic, and social considerations that are intrinsically interconnected within the broader context of global resource management.",
    simplified:
      "Using sustainable practices means understanding how the environment, economy, and society are all connected when managing resources worldwide.",
  },
  {
    label: "Legal",
    text: "Notwithstanding any provision to the contrary contained herein, the party of the first part shall indemnify and hold harmless the party of the second part against any and all claims arising from the performance of obligations under this agreement.",
    simplified:
      "Despite anything else in this document, the first party must protect and cover any costs for the second party if there are any problems from following this agreement.",
  },
  {
    label: "Medical",
    text: "The patient exhibited symptoms consistent with acute myocardial infarction, including substernal chest pain radiating to the left arm, accompanied by diaphoresis and shortness of breath.",
    simplified:
      "The patient had signs of a heart attack, including chest pain spreading to the left arm, sweating, and difficulty breathing.",
  },
];

export function InteractiveDemo() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<DemoResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // Reset progress when not simulating
  useEffect(() => {
    if (!isSimulating) {
      setProgress(0);
      setStatusMessage("");
    }
  }, [isSimulating]);

  // Simulate simplification for demo purposes
  const simulateSimplification = (text: string): string => {
    // Check if it's one of our sample texts
    const sample = SAMPLE_TEXTS.find((s) => s.text === text);
    if (sample) {
      return sample.simplified;
    }

    // Basic mock simplification for custom text
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const simplified = sentences
      .map((s) => {
        const words = s.trim().split(" ");
        // Keep first 12 words and simplify
        return words.slice(0, Math.min(words.length, 12)).join(" ");
      })
      .join(". ");

    return simplified + (simplified.endsWith(".") ? "" : ".");
  };

  const handleSimplify = async () => {
    if (!inputText.trim()) return;

    setIsSimulating(true);
    setProgress(0);

    // Simulate loading stages
    const stages = [
      { progress: 20, message: "Analyzing text complexity...", duration: 400 },
      { progress: 45, message: "Identifying key concepts...", duration: 350 },
      { progress: 70, message: "Simplifying vocabulary...", duration: 400 },
      { progress: 90, message: "Finalizing result...", duration: 300 },
      { progress: 100, message: "Complete!", duration: 200 },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, stage.duration));
      setProgress(stage.progress);
      setStatusMessage(stage.message);
    }

    const simplified = simulateSimplification(inputText);
    setResult({ original: inputText, simplified });
    setIsSimulating(false);
  };

  const handleSampleClick = (sample: (typeof SAMPLE_TEXTS)[0]) => {
    setInputText(sample.text);
    setResult(null);
  };

  const clearDemo = () => {
    setInputText("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Sample text buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground mr-2">
          Try a sample:
        </span>
        {SAMPLE_TEXTS.map((sample) => (
          <Button
            key={sample.label}
            variant="outline"
            size="sm"
            onClick={() => handleSampleClick(sample)}
            className="text-xs"
          >
            {sample.label}
          </Button>
        ))}
      </div>

      {/* Input/Output area */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">Original Text</Badge>
              <span className="text-xs text-muted-foreground">
                {inputText.length} characters
              </span>
            </div>
            <Textarea
              placeholder="Paste any complex text here to see it simplified..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (result) setResult(null);
              }}
              className="min-h-[150px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card
          className={cn(
            "transition-all duration-300",
            result
              ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
              : ""
          )}
        >
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={
                  result
                    ? "border-green-500 text-green-700 dark:text-green-400"
                    : ""
                }
              >
                Simplified Text
              </Badge>
              {result && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  {Math.round(
                    (1 - result.simplified.length / result.original.length) *
                      100
                  )}
                  % shorter
                </span>
              )}
            </div>
            <div
              className={cn(
                "min-h-[150px] rounded-md border p-3 text-sm",
                result ? "bg-white dark:bg-background" : "bg-muted/30"
              )}
            >
              {isSimulating ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[130px] gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div className="w-full max-w-[200px] space-y-2">
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-xs text-center text-muted-foreground animate-pulse">
                      {statusMessage}
                    </p>
                  </div>
                </div>
              ) : result ? (
                <p className="leading-relaxed">{result.simplified}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  The simplified version will appear here...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={handleSimplify}
          disabled={!inputText.trim() || isSimulating}
          size="lg"
        >
          {isSimulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simplifying...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Simplify Text
            </>
          )}
        </Button>

        {result && (
          <Button variant="outline" onClick={clearDemo} size="lg">
            Try Another
          </Button>
        )}
      </div>

      {/* CTA after demo */}
      {result && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            Want more features? Save history, get detailed statistics, and
            access accessibility tools.
          </p>
          <Button variant="link" className="text-primary" asChild>
            <a href="/simplify/text">
              Try the Full Version
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
