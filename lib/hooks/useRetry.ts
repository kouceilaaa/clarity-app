"use client";

import { useState, useCallback } from "react";

interface UseRetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxAttemptsReached?: (error: Error) => void;
}

interface UseRetryReturn<T> {
  execute: (fn: () => Promise<T>) => Promise<T | null>;
  isRetrying: boolean;
  attempt: number;
  lastError: Error | null;
  reset: () => void;
}

export function useRetry<T>(options: UseRetryOptions = {}): UseRetryReturn<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = true,
    onRetry,
    onMaxAttemptsReached,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setAttempt(0);
    setLastError(null);
    setIsRetrying(false);
  }, []);

  const execute = useCallback(
    async (fn: () => Promise<T>): Promise<T | null> => {
      setIsRetrying(true);
      setLastError(null);

      let currentAttempt = 0;
      let lastErr: Error | null = null;

      while (currentAttempt < maxAttempts) {
        try {
          setAttempt(currentAttempt + 1);
          const result = await fn();
          setIsRetrying(false);
          return result;
        } catch (error) {
          lastErr = error instanceof Error ? error : new Error(String(error));
          setLastError(lastErr);
          currentAttempt++;

          if (currentAttempt < maxAttempts) {
            onRetry?.(currentAttempt, lastErr);
            const delay = backoff ? delayMs * currentAttempt : delayMs;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      setIsRetrying(false);
      if (lastErr) {
        onMaxAttemptsReached?.(lastErr);
      }
      return null;
    },
    [maxAttempts, delayMs, backoff, onRetry, onMaxAttemptsReached]
  );

  return {
    execute,
    isRetrying,
    attempt,
    lastError,
    reset,
  };
}

// Simpler version for common use cases
interface RetryButtonState {
  isLoading: boolean;
  error: string | null;
  attempts: number;
}

export function useRetryAction(
  action: () => Promise<void>,
  options: UseRetryOptions = {}
) {
  const [state, setState] = useState<RetryButtonState>({
    isLoading: false,
    error: null,
    attempts: 0,
  });

  const { execute, reset: resetRetry } = useRetry<void>(options);

  const handleAction = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await execute(async () => {
      await action();
    });

    if (result === null && options.maxAttempts) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Action failed after multiple attempts. Please try again later.",
        attempts: prev.attempts + 1,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    }
  }, [action, execute, options.maxAttempts]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, attempts: 0 });
    resetRetry();
  }, [resetRetry]);

  return {
    ...state,
    execute: handleAction,
    reset,
  };
}
