/**
 * Open Router AI Service for text simplification
 * Uses Vercel AI SDK with OpenAI-compatible provider
 */

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import type { SimplificationMode } from "@/lib/types";

// Initialize Open Router client
const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  headers: {
    "HTTP-Referer": process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    "X-Title": "ClarityWeb - Text Simplification",
  },
});

// Model configurations for each simplification mode
export const MODELS = {
  simple: "meta-llama/llama-3.2-3b-instruct:free",
  accessible: "meta-llama/llama-3.2-3b-instruct:free",
  summary: "meta-llama/llama-3.2-3b-instruct:free",
} as const;

// Prompt templates for each mode
export const PROMPTS = {
  simple: {
    version: "1.0.0",
    system: `You are an expert text simplifier specializing in making content accessible to people with severe cognitive disabilities and young children (around 8 years old).

Your task is to simplify the given text following these strict rules:
- Use ONLY primary school vocabulary (words a 6-8 year old would know)
- Keep sentences SHORT: 6-8 words maximum per sentence
- Express ONE idea per sentence only
- Replace ALL complex words with simple alternatives
- Avoid abstract concepts - use concrete examples when possible
- Use active voice, not passive
- Remove all jargon, idioms, and metaphors
- Keep the core meaning intact

Example transformation:
BEFORE: "The implementation of sustainable practices necessitates collaborative efforts."
AFTER: "We need to work together. We must help the Earth. Everyone can do something."

Output ONLY the simplified text. Do not include explanations or notes.`,
  },

  accessible: {
    version: "1.0.0",
    system: `You are an expert text simplifier making content accessible to people with dyslexia, mild cognitive issues, elderly readers, and the general public seeking clearer text.

Your task is to simplify the given text following these rules:
- Use middle school vocabulary (words a 12-14 year old would know)
- Keep sentences at 12-15 words maximum
- Maintain a clear logical structure with good paragraph flow
- Replace complex technical terms with simpler alternatives
- Add helpful context when needed
- Use bullet points for lists when appropriate
- Keep the original meaning and all key information
- Break complex ideas into smaller, digestible parts

Example transformation:
BEFORE: "The implementation of sustainable environmental practices necessitates collaborative efforts from all stakeholders."
AFTER: "To protect our environment, everyone needs to work together. This includes governments, businesses, and regular people. When we all do our part, we can make a real difference."

Output ONLY the simplified text. Do not include explanations or notes.`,
  },

  summary: {
    version: "1.0.0",
    system: `You are an expert text summarizer helping users with ADHD, busy professionals, and anyone who needs quick access to key information.

Your task is to create a concise summary following these rules:
- Extract ONLY the main ideas (3-5 sentences total)
- Get straight to the point - no introduction or conclusion
- Prioritize the most important information
- Use clear, direct language
- Format with bullet points if there are multiple distinct points
- Include only essential details
- Remove all redundancy and filler content

Example transformation:
BEFORE: [Long paragraph about climate change impacts, causes, and solutions...]
AFTER: "• Climate change is causing rising temperatures globally. • Main causes include burning fossil fuels and deforestation. • Solutions include renewable energy and reducing consumption. • Individual actions can make a difference."

Output ONLY the summary. Do not include explanations or notes.`,
  },
} as const;

// Token usage tracking
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

interface SimplificationResult {
  text: string;
  usage?: TokenUsage;
  model: string;
}

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

/**
 * Sleep utility for exponential backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simplify text using Open Router AI
 */
export async function simplifyTextWithAI(
  text: string,
  mode: SimplificationMode
): Promise<SimplificationResult> {
  // Validate API key
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Please add it to your .env.local file."
    );
  }

  const model = MODELS[mode];
  const prompt = PROMPTS[mode];
  let lastError: Error | null = null;

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await generateText({
        model: openrouter.chatModel(model),
        system: prompt.system,
        prompt: `Please simplify the following text:\n\n${text}`,
        temperature: 0.3, // Lower temperature for more consistent output
      });

      return {
        text: result.text.trim(),
        usage: result.usage
          ? {
              promptTokens: result.usage.inputTokens ?? 0,
              completionTokens: result.usage.outputTokens ?? 0,
              totalTokens:
                (result.usage.inputTokens ?? 0) +
                (result.usage.outputTokens ?? 0),
            }
          : undefined,
        model,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed:`,
        lastError.message
      );

      // Don't retry if it's an authentication error
      if (
        lastError.message.includes("401") ||
        lastError.message.includes("unauthorized")
      ) {
        throw new Error(
          "Invalid API key. Please check your OPENROUTER_API_KEY."
        );
      }

      // Don't retry on the last attempt
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY * 2 ** (attempt - 1); // Exponential backoff
        // Wait before retrying
        await sleep(delay);
      }
    }
  }

  throw (
    lastError ?? new Error("Failed to simplify text after multiple attempts")
  );
}

/**
 * Check if the Open Router service is available and configured
 */
export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

/**
 * Get available models for simplification
 */
export function getAvailableModels(): typeof MODELS {
  return MODELS;
}
