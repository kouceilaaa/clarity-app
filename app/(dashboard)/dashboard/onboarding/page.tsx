import type { Metadata } from "next";
import OnboardingPage from "@/components/onboarding/OnboardingPage";

export const metadata: Metadata = {
  title: "Onboarding - ClarityWeb",
  description: "Get started with ClarityWeb",
};

// Prevent static pre-rendering
export const dynamic = "force-dynamic";

export default function Page() {
  return <OnboardingPage />;
}
