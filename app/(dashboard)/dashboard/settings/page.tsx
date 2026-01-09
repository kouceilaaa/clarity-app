import type { Metadata } from "next";
import { SettingsContent } from "@/components/settings";

export const metadata: Metadata = {
  title: "Settings - ClarityWeb",
  description: "Customize your ClarityWeb experience",
};

// Prevent static pre-rendering
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return <SettingsContent />;
}
