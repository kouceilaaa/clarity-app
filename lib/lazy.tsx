"use client";

// Dynamic imports for heavy components
// This file provides lazy-loaded versions of components for better performance

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

// Lazy load export button (uses jsPDF which is heavy)
export const DynamicExportButton = dynamic(
  () =>
    import("@/components/shared/ExportButton").then((mod) => ({
      default: mod.ExportButton,
    })),
  {
    loading: () => <LoadingFallback />,
    ssr: false, // Don't SSR PDF generation
  }
);

// Lazy load TTS component (uses Web Speech API)
export const DynamicTextToSpeech = dynamic(
  () =>
    import("@/components/accessibility/TextToSpeech").then((mod) => ({
      default: mod.TextToSpeech,
    })),
  {
    loading: () => <LoadingFallback />,
    ssr: false, // Don't SSR speech synthesis
  }
);

// Lazy load TTS with highlighting (more complex)
export const DynamicTextToSpeechHighlight = dynamic(
  () =>
    import("@/components/accessibility/TextToSpeechHighlight").then((mod) => ({
      default: mod.TextToSpeechHighlight,
    })),
  {
    loading: () => <LoadingFallback />,
    ssr: false,
  }
);

// Lazy load share dialog
export const DynamicShareDialog = dynamic(
  () =>
    import("@/components/shared/ShareDialog").then((mod) => ({
      default: mod.ShareDialog,
    })),
  {
    loading: () => <LoadingFallback />,
  }
);

// Lazy load account management (has multiple dialogs)
export const DynamicAccountManagement = dynamic(
  () =>
    import("@/components/settings/AccountManagement").then((mod) => ({
      default: mod.AccountManagement,
    })),
  {
    loading: () => <LoadingFallback />,
  }
);

// Lazy load testimonials carousel (autoplay feature)
export const DynamicTestimonialsCarousel = dynamic(
  () =>
    import("@/components/landing/TestimonialsCarousel").then((mod) => ({
      default: mod.TestimonialsCarousel,
    })),
  {
    loading: () => <LoadingFallback />,
    ssr: true, // Can SSR this one for SEO
  }
);

// Lazy load interactive demo (preview feature)
export const DynamicInteractiveDemo = dynamic(
  () =>
    import("@/components/landing/InteractiveDemo").then((mod) => ({
      default: mod.InteractiveDemo,
    })),
  {
    loading: () => <LoadingFallback />,
    ssr: false, // Interactive, no need for SSR
  }
);

// Lazy load history search (heavy with filters)
export const DynamicHistorySearch = dynamic(
  () =>
    import("@/components/history/HistorySearch").then((mod) => ({
      default: mod.HistorySearch,
    })),
  {
    loading: () => <LoadingFallback />,
  }
);
