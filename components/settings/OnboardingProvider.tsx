"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { OnboardingWizard } from "@/components/settings/OnboardingWizard";

interface OnboardingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that checks if user needs onboarding and shows wizard.
 * Shows onboarding wizard for newly registered users who haven't completed it.
 */
export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { data: session, status } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check after session is loaded
    if (status === "loading") return;

    // Only show onboarding for authenticated users
    if (status === "authenticated" && session?.user) {
      // Check if user has completed onboarding from session or fetch
      const checkOnboardingStatus = async () => {
        try {
          const response = await fetch("/api/user/onboarding-status");
          if (response.ok) {
            const data = await response.json();
            if (!data.onboardingCompleted) {
              setShowOnboarding(true);
            }
          }
        } catch (error) {
          console.error("Failed to check onboarding status:", error);
        } finally {
          setHasChecked(true);
        }
      };

      checkOnboardingStatus();
    } else {
      setHasChecked(true);
    }
  }, [session, status]);

  const handleOnboardingComplete = async () => {
    try {
      await fetch("/api/user/complete-onboarding", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
    }
    setShowOnboarding(false);
  };

  // Don't render anything until we've checked onboarding status
  if (status === "loading" || !hasChecked) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showOnboarding && (
        <OnboardingWizard
          open={showOnboarding}
          onOpenChange={(open) => {
            if (!open) handleOnboardingComplete();
          }}
        />
      )}
    </>
  );
}
