"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md text-center shadow-lg animate-scale-in">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <p className="text-muted-foreground">
            An unexpected error occurred. Don&apos;t worry, your data is safe.
            Please try again or return to the home page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left text-sm bg-muted p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-destructive flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 -rotate-90" />
                Technical details (dev mode)
              </summary>
              <div className="mt-3 space-y-2">
                <p className="font-mono text-xs break-all">
                  <strong>Message:</strong> {error.message}
                </p>
                {error.digest && (
                  <p className="font-mono text-xs">
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full btn-hover-lift" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
