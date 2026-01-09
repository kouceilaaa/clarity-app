import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
