import type { Metadata } from "next";
import { HistoryContent } from "@/components/history";

export const metadata: Metadata = {
  title: "History - ClarityWeb",
  description: "View and manage your past simplifications",
};

// Prevent static pre-rendering
export const dynamic = "force-dynamic";

export default function HistoryPage() {
  return <HistoryContent />;
}
