"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/lib/stores/store";
import { queryClient } from "@/lib/utils/queryClient";
import { ThemeApplicator } from "@/components/shared/ThemeApplicator";
import { OnboardingProvider } from "@/components/settings/OnboardingProvider";
import { Session } from "next-auth";

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeApplicator />
          <OnboardingProvider>{children}</OnboardingProvider>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
