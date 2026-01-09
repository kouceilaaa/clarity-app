import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Login - ClarityWeb",
  description: "Sign in to your ClarityWeb account",
};

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md space-y-4 p-6">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
