import type { Metadata } from "next";
import { FavoritesContent } from "@/components/favorites";

export const metadata: Metadata = {
  title: "Favorites - ClarityWeb",
  description: "Your saved simplifications for easy access",
};

// Prevent static pre-rendering
export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  return <FavoritesContent />;
}
