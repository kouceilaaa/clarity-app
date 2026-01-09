/**
 * Readability Service for extracting content from URLs
 * Uses Mozilla Readability with JSDOM for parsing
 */

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { z } from "zod";

// URL validation schema
const UrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must use HTTP or HTTPS protocol" }
  );

// Extraction result type
interface ExtractionResult {
  success: boolean;
  title?: string;
  content?: string;
  excerpt?: string;
  byline?: string;
  siteName?: string;
  error?: string;
}

// Timeout configuration
const FETCH_TIMEOUT = 10000; // 10 seconds

// User agent to avoid bot blocking
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Fetch URL content with timeout
 */
async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Clean extracted text content
 */
function cleanText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replaceAll(/[\t\r]+/g, " ")
      // Normalize newlines
      .replaceAll(/\n{3,}/g, "\n\n")
      // Remove leading/trailing whitespace from lines
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      // Remove excessive spaces
      .replaceAll(/ {2,}/g, " ")
      .trim()
  );
}

/**
 * Extract readable content from a URL
 */
export async function extractFromUrl(url: string): Promise<ExtractionResult> {
  // Validate URL
  const urlValidation = UrlSchema.safeParse(url);
  if (!urlValidation.success) {
    return {
      success: false,
      error: urlValidation.error.issues[0]?.message ?? "Invalid URL format",
    };
  }

  try {
    // Fetch the page
    const response = await fetchWithTimeout(url, FETCH_TIMEOUT);

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessages: Record<number, string> = {
        401: "This page requires authentication",
        403: "Access to this page is forbidden",
        404: "The page was not found",
        429: "Too many requests. Please try again later",
        500: "The server encountered an error",
        502: "Bad gateway - the server is temporarily unavailable",
        503: "The service is temporarily unavailable",
      };

      return {
        success: false,
        error:
          errorMessages[response.status] ??
          `Failed to fetch URL: ${response.status} ${response.statusText}`,
      };
    }

    // Get content type
    const contentType = response.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      return {
        success: false,
        error: "URL does not point to an HTML page",
      };
    }

    // Parse HTML
    const html = await response.text();
    const dom = new JSDOM(html, { url });

    // Use Readability to extract content
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article?.textContent) {
      return {
        success: false,
        error:
          "Could not extract readable content from this page. It may be behind a paywall or use JavaScript rendering.",
      };
    }

    // Clean and return the extracted content
    const cleanedContent = cleanText(article.textContent);

    // Check if content is too short (likely extraction failed)
    if (cleanedContent.length < 100) {
      return {
        success: false,
        error:
          "Extracted content is too short. The page may use JavaScript rendering or have limited text content.",
      };
    }

    return {
      success: true,
      title: article.title ?? undefined,
      content: cleanedContent,
      excerpt: article.excerpt ?? undefined,
      byline: article.byline ?? undefined,
      siteName: article.siteName ?? undefined,
    };
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timed out. The page took too long to load.",
        };
      }

      if (error.message.includes("ENOTFOUND")) {
        return {
          success: false,
          error: "Could not find the website. Please check the URL.",
        };
      }

      if (error.message.includes("ECONNREFUSED")) {
        return {
          success: false,
          error: "Connection refused. The website may be down.",
        };
      }

      if (error.message.includes("certificate")) {
        return {
          success: false,
          error:
            "SSL certificate error. The website's security certificate may be invalid.",
        };
      }
    }

    console.error("URL extraction error:", error);
    return {
      success: false,
      error:
        "Failed to extract content from URL. Please try again or use text input instead.",
    };
  }
}

/**
 * Validate a URL without fetching it
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  const result = UrlSchema.safeParse(url);
  return result.success
    ? { valid: true }
    : { valid: false, error: result.error.issues[0]?.message };
}
