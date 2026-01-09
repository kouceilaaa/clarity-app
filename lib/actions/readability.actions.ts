"use server";

import { extractFromUrl as extractFromUrlService } from "@/lib/services/readability.service";

interface ExtractResult {
  success: boolean;
  data?: {
    title: string | undefined;
    content: string;
    excerpt?: string;
    byline?: string;
    siteName?: string;
  };
  error?: string;
}

/**
 * Server action to extract readable content from a URL
 *
 * @description Wraps the Mozilla Readability service for client-side use.
 * Extracts the main readable content from a web page, removing ads,
 * navigation, and other non-essential elements.
 *
 * Returns:
 * - title: The article/page title
 * - content: Main text content
 * - excerpt: Short description/summary
 * - byline: Author information
 * - siteName: Name of the website
 *
 * @param url - The URL to extract content from
 * @returns Promise<ExtractResult> with extracted data or error
 *
 * @example
 * ```typescript
 * const result = await extractFromUrl("https://example.com/article");
 * if (result.success) {
 *   console.log(result.data.title);
 *   console.log(result.data.content);
 * }
 * ```
 */
export async function extractFromUrl(url: string): Promise<ExtractResult> {
  try {
    const result = await extractFromUrlService(url);

    if (!result.success) {
      return {
        success: false,
        error: result.error ?? "Failed to extract content from URL",
      };
    }

    return {
      success: true,
      data: {
        title: result.title,
        content: result.content ?? "",
        excerpt: result.excerpt,
        byline: result.byline,
        siteName: result.siteName,
      },
    };
  } catch (error) {
    console.error("Extract from URL error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while extracting content",
    };
  }
}
