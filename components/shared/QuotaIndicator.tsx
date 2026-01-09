"use client";

import { useEffect, useState } from "react";
import { Gauge, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserQuota } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";

interface QuotaIndicatorProps {
  className?: string;
  showUpgrade?: boolean;
}

export function QuotaIndicator({
  className,
  showUpgrade = true,
}: QuotaIndicatorProps) {
  const [quota, setQuota] = useState<{
    used: number;
    limit: number;
    tier: "free" | "premium";
    resetsAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const result = await getUserQuota();
        if (result.success && result.data) {
          setQuota(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch quota:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuota();
  }, []);

  if (isLoading) {
    return (
      <div
        className={cn("h-10 animate-pulse bg-muted rounded-lg", className)}
      />
    );
  }

  if (!quota) {
    return null;
  }

  const percentage = Math.min((quota.used / quota.limit) * 100, 100);
  const remaining = quota.limit - quota.used;
  const isLow = percentage >= 80;
  const isExhausted = remaining <= 0;

  // Calculate time until reset
  const resetTime = new Date(quota.resetsAt);
  const hoursUntilReset = Math.max(
    0,
    Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60 * 60))
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Simplifications</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "font-medium",
                  isExhausted && "text-destructive",
                  isLow && !isExhausted && "text-yellow-600"
                )}
              >
                {quota.used}/{quota.limit}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Réinitialisation dans {hoursUntilReset}h</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Progress
        value={percentage}
        className={cn(
          "h-2",
          isExhausted && "[&>div]:bg-destructive",
          isLow && !isExhausted && "[&>div]:bg-yellow-500"
        )}
      />

      {isExhausted && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>Quota épuisé - Réessayez dans {hoursUntilReset}h</span>
        </div>
      )}

      {isLow && !isExhausted && (
        <div className="flex items-center gap-2 text-sm text-yellow-600">
          <TrendingUp className="h-4 w-4" />
          <span>
            Plus que {remaining} simplification{remaining !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {showUpgrade && quota.tier === "free" && (
        <Button
          variant={isExhausted ? "default" : "outline"}
          size="sm"
          className="w-full mt-2"
          onClick={() => window.open("/pricing", "_blank")}
        >
          <Zap className="h-4 w-4 mr-2" />
          {isExhausted ? "Passer à Premium" : "Obtenir plus de simplifications"}
        </Button>
      )}
    </div>
  );
}
