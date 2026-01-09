import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./index.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { ThemeApplicator } from "@/components/shared/ThemeApplicator";
import { FloatingAccessibilityButton } from "@/components/accessibility/FloatingAccessibilityButton";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ClarityWeb - Make Any Text Accessible",
  description:
    "AI-powered text simplification for cognitive accessibility. Help millions understand complex content.",
  keywords: [
    "accessibility",
    "text simplification",
    "dyslexia",
    "cognitive accessibility",
    "AI",
  ],
  authors: [{ name: "ClarityWeb Team" }],
  openGraph: {
    title: "ClarityWeb - Make Any Text Accessible",
    description: "AI-powered text simplification for cognitive accessibility",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {/* Skip Links for Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-48 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to navigation
        </a>
        <Providers session={session}>
          <ThemeApplicator />
          {children}
          <FloatingAccessibilityButton />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
