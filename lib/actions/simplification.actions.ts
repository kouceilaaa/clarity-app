"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import Simplification from "@/lib/db/models/Simplification";
import {
  SimplifyTextSchema,
  ExtractFromUrlSchema,
} from "@/lib/utils/validation";
import type {
  SimplificationMode,
  SimplificationData,
  SimplificationStatistics,
} from "@/lib/types";
import {
  calculateFleschScore,
  countWords,
  estimateReadingTime,
} from "@/lib/utils/text.utils";
import { nanoid } from "nanoid";

// Result type for server actions
export interface SimplificationResult {
  success: boolean;
  data?: SimplificationData;
  error?: string;
}

export interface HistoryResult {
  success: boolean;
  data?: SimplificationData[];
  total?: number;
  error?: string;
}

// Mock AI simplification (replace with actual AI API call)
async function mockSimplifyText(
  text: string,
  mode: SimplificationMode
): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simple mock simplification based on mode
  const sentences = text.split(/[.!?]+/).filter(Boolean);

  switch (mode) {
    case "simple":
      // Very basic simplification - shorter sentences, simpler words
      return (
        sentences
          .slice(0, Math.ceil(sentences.length * 0.6))
          .map((s) => s.trim().split(" ").slice(0, 10).join(" "))
          .join(". ") + "."
      );

    case "accessible":
      // Balanced simplification
      return (
        sentences
          .slice(0, Math.ceil(sentences.length * 0.8))
          .map((s) => s.trim())
          .join(". ") + "."
      );

    case "summary":
      // Just key points
      return (
        sentences
          .slice(0, Math.min(3, sentences.length))
          .map((s) => s.trim())
          .join(". ") + "."
      );

    default:
      return text;
  }
}

// Calculate statistics for the simplification
function calculateStatistics(
  originalText: string,
  simplifiedText: string
): SimplificationStatistics {
  return {
    fleschBefore: calculateFleschScore(originalText),
    fleschAfter: calculateFleschScore(simplifiedText),
    wordsCountBefore: countWords(originalText),
    wordsCountAfter: countWords(simplifiedText),
    readingTimeBefore: estimateReadingTime(originalText),
    readingTimeAfter: estimateReadingTime(simplifiedText),
  };
}

/**
 * Simplify text using AI
 */
export async function simplifyText(input: {
  text: string;
  mode: SimplificationMode;
  saveToHistory?: boolean;
}): Promise<SimplificationResult> {
  try {
    console.log("🔄 simplifyText called with:", {
      textLength: input.text.length,
      mode: input.mode,
      saveToHistory: input.saveToHistory,
    });

    // Validate input
    const validated = SimplifyTextSchema.safeParse(input);
    if (!validated.success) {
      console.error("❌ Validation failed:", validated.error.issues);
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { text, mode, saveToHistory } = validated.data;

    // Simplify the text
    const simplifiedText = await mockSimplifyText(text, mode);
    console.log("✅ Text simplified, length:", simplifiedText.length);

    // Calculate statistics
    const statistics = calculateStatistics(text, simplifiedText);
    console.log("📊 Statistics calculated:", statistics);

    // Create base data
    const simplificationData: SimplificationData = {
      id: nanoid(),
      originalText: text,
      simplifiedText,
      mode,
      statistics,
      isFavorite: false,
      createdAt: new Date(),
    };

    // Save to database if user is authenticated and wants to save
    if (saveToHistory) {
      console.log("💾 Attempting to save to history...");
      const session = await auth();
      console.log(
        "👤 Session:",
        session?.user?.id ? "authenticated" : "not authenticated"
      );

      if (session?.user?.id) {
        await connectToDatabase();
        console.log("🔌 Database connected");

        // Convert userId to ObjectId for proper MongoDB storage
        const userObjectId = new mongoose.Types.ObjectId(session.user.id);

        const saved = await Simplification.create({
          userId: userObjectId,
          originalText: text,
          simplifiedText,
          mode,
          statistics,
          isFavorite: false,
        });
        simplificationData.id = saved._id.toString();
        console.log("✅ Saved to history with ID:", saved._id.toString());
      } else {
        console.log("⚠️ User not authenticated, skipping save to history");
      }
    } else {
      console.log("ℹ️ saveToHistory is false, not saving");
    }

    return {
      success: true,
      data: simplificationData,
    };
  } catch (error) {
    console.error("❌ Simplification error:", error);
    return {
      success: false,
      error: "Failed to simplify text. Please try again.",
    };
  }
}

/**
 * Extract and simplify content from a URL
 */
export async function simplifyFromUrl(input: {
  url: string;
  mode: SimplificationMode;
  includeImages?: boolean;
  preserveLinks?: boolean;
}): Promise<SimplificationResult> {
  try {
    // Validate input
    const validated = ExtractFromUrlSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { url, mode } = validated.data;

    // Mock URL content extraction (replace with actual implementation)
    // In production, use a service like @mozilla/readability or similar
    const mockExtractedText = `Content extracted from ${url}. This is a placeholder for the actual content that would be extracted from the webpage. The real implementation would fetch the page, parse it, and extract the main content.`;

    // Use the simplifyText function
    return simplifyText({
      text: mockExtractedText,
      mode,
      saveToHistory: true,
    });
  } catch (error) {
    console.error("URL extraction error:", error);
    return {
      success: false,
      error: "Failed to extract content from URL. Please try again.",
    };
  }
}

/**
 * Get user's simplification history
 */
export async function getHistory(
  page: number = 1,
  limit: number = 10,
  filters?: {
    mode?: SimplificationMode | "all";
    favoritesOnly?: boolean;
    search?: string;
  }
): Promise<HistoryResult> {
  try {
    console.log("📋 getHistory called with:", { page, limit, filters });

    const session = await auth();
    console.log(
      "👤 Session user ID:",
      session?.user?.id ?? "not authenticated"
    );

    if (!session?.user?.id) {
      console.log("❌ User not authenticated");
      return {
        success: false,
        error: "You must be logged in to view history",
      };
    }

    await connectToDatabase();
    console.log("🔌 Database connected");

    // Convert userId to ObjectId for proper MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Build query
    const query: Record<string, unknown> = { userId: userObjectId };

    if (filters?.mode && filters.mode !== "all") {
      query.mode = filters.mode;
    }

    if (filters?.favoritesOnly) {
      query.isFavorite = true;
    }

    if (filters?.search) {
      query.$or = [
        { originalText: { $regex: filters.search, $options: "i" } },
        { simplifiedText: { $regex: filters.search, $options: "i" } },
      ];
    }

    console.log("🔍 Query userId:", userObjectId.toString());

    // Get total count
    const total = await Simplification.countDocuments(query);
    console.log("📊 Total documents matching query:", total);

    // Get paginated results
    const simplifications = await Simplification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    console.log("📦 Found simplifications:", simplifications.length);

    const data: SimplificationData[] = simplifications.map((s) => ({
      id: s._id.toString(),
      originalText: s.originalText,
      simplifiedText: s.simplifiedText,
      mode: s.mode as SimplificationMode,
      sourceUrl: s.sourceUrl,
      statistics: s.statistics as SimplificationStatistics,
      isFavorite: s.isFavorite,
      createdAt: s.createdAt,
    }));

    console.log("✅ Returning", data.length, "items");

    return {
      success: true,
      data,
      total,
    };
  } catch (error) {
    console.error("❌ Get history error:", error);
    return {
      success: false,
      error: "Failed to fetch history",
    };
  }
}

/**
 * Get a single simplification by ID
 */
export async function getSimplificationById(
  id: string
): Promise<SimplificationResult> {
  try {
    console.log("🔍 getSimplificationById called with ID:", id);

    const session = await auth();
    if (!session?.user?.id) {
      console.log("❌ User not authenticated");
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await connectToDatabase();

    // Convert userId to ObjectId for proper MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const simplification = await Simplification.findOne({
      _id: id,
      userId: userObjectId,
    }).lean();

    if (!simplification) {
      console.log("❌ Simplification not found for ID:", id);
      return {
        success: false,
        error: "Simplification not found",
      };
    }

    console.log("✅ Found simplification:", simplification._id.toString());

    return {
      success: true,
      data: {
        id: simplification._id.toString(),
        originalText: simplification.originalText,
        simplifiedText: simplification.simplifiedText,
        mode: simplification.mode as SimplificationMode,
        sourceUrl: simplification.sourceUrl,
        statistics: simplification.statistics as SimplificationStatistics,
        isFavorite: simplification.isFavorite,
        createdAt: simplification.createdAt,
      },
    };
  } catch (error) {
    console.error("❌ Get simplification error:", error);
    return {
      success: false,
      error: "Failed to fetch simplification",
    };
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  id: string
): Promise<SimplificationResult> {
  try {
    console.log("⭐ toggleFavorite called with ID:", id);

    const session = await auth();
    if (!session?.user?.id) {
      console.log("❌ User not authenticated");
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await connectToDatabase();

    // Convert userId to ObjectId for proper MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const simplification = await Simplification.findOne({
      _id: id,
      userId: userObjectId,
    });

    if (!simplification) {
      console.log("❌ Simplification not found for ID:", id);
      return {
        success: false,
        error: "Simplification not found",
      };
    }

    simplification.isFavorite = !simplification.isFavorite;
    await simplification.save();

    console.log("✅ Favorite toggled to:", simplification.isFavorite);

    return {
      success: true,
      data: {
        id: simplification._id.toString(),
        originalText: simplification.originalText,
        simplifiedText: simplification.simplifiedText,
        mode: simplification.mode as SimplificationMode,
        sourceUrl: simplification.sourceUrl,
        statistics: simplification.statistics as SimplificationStatistics,
        isFavorite: simplification.isFavorite,
        createdAt: simplification.createdAt,
      },
    };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return {
      success: false,
      error: "Failed to update favorite status",
    };
  }
}

/**
 * Delete a simplification
 */
export async function deleteSimplification(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("🗑️ deleteSimplification called with ID:", id);

    const session = await auth();
    if (!session?.user?.id) {
      console.log("❌ User not authenticated");
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await connectToDatabase();

    // Convert userId to ObjectId for proper MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    const result = await Simplification.deleteOne({
      _id: id,
      userId: userObjectId,
    });

    if (result.deletedCount === 0) {
      console.log("❌ Simplification not found or not owned by user");
      return {
        success: false,
        error: "Simplification not found",
      };
    }

    console.log("✅ Simplification deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Delete simplification error:", error);
    return {
      success: false,
      error: "Failed to delete simplification",
    };
  }
}

/**
 * Get user's favorites
 */
export async function getFavorites(
  page: number = 1,
  limit: number = 10
): Promise<HistoryResult> {
  console.log("⭐ getFavorites called");
  return getHistory(page, limit, { favoritesOnly: true });
}
