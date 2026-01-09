"use server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import SharedLink from "@/lib/db/models/SharedLink";
import Simplification from "@/lib/db/models/Simplification";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import type { SimplificationMode, SimplificationStatistics } from "@/lib/types";

export interface ShareLinkResult {
  success: boolean;
  data?: {
    code: string;
    url: string;
    expiresAt: Date | null;
  };
  error?: string;
}

export interface SharedContentResult {
  success: boolean;
  data?: {
    originalText: string;
    simplifiedText: string;
    mode: SimplificationMode;
    statistics: SimplificationStatistics;
    createdAt: Date;
    expiresAt: Date | null;
  };
  error?: string;
}

/**
 * Create a shareable link for a simplification
 */
export async function createShareLink(
  simplificationId: string,
  options?: { expiresInDays?: number }
): Promise<ShareLinkResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to share",
      };
    }

    await connectToDatabase();

    // Convert userId to ObjectId for query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Verify the simplification exists and belongs to the user
    const simplification = await Simplification.findOne({
      _id: simplificationId,
      userId: userObjectId,
    });

    if (!simplification) {
      return {
        success: false,
        error: "Simplification not found",
      };
    }

    // Generate a unique share code
    const shortCode = nanoid(10);

    // Calculate expiration date
    const expiresAt = options?.expiresInDays
      ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days

    // Create the share link
    await SharedLink.create({
      simplificationId,
      shortCode,
      expiresAt,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      success: true,
      data: {
        code: shortCode,
        url: `${baseUrl}/shared/${shortCode}`,
        expiresAt,
      },
    };
  } catch (error) {
    console.error("Create share link error:", error);
    return {
      success: false,
      error: "Failed to create share link",
    };
  }
}

/**
 * Get shared content by code (public - no auth required)
 */
export async function getSharedContent(
  code: string
): Promise<SharedContentResult> {
  try {
    await connectToDatabase();

    // Find the share link
    const shareLink = await SharedLink.findOne({ shortCode: code });

    if (!shareLink) {
      return {
        success: false,
        error: "Share link not found",
      };
    }

    // Check if expired
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return {
        success: false,
        error: "This share link has expired",
      };
    }

    // Get the simplification
    const simplification = await Simplification.findById(
      shareLink.simplificationId
    );

    if (!simplification) {
      return {
        success: false,
        error: "Content not found",
      };
    }

    // Increment view count
    shareLink.views += 1;
    await shareLink.save();

    return {
      success: true,
      data: {
        originalText: simplification.originalText,
        simplifiedText: simplification.simplifiedText,
        mode: simplification.mode as SimplificationMode,
        statistics: simplification.statistics as SimplificationStatistics,
        createdAt: simplification.createdAt,
        expiresAt: shareLink.expiresAt ?? null,
      },
    };
  } catch (error) {
    console.error("Get shared content error:", error);
    return {
      success: false,
      error: "Failed to fetch shared content",
    };
  }
}

/**
 * Delete a share link
 */
export async function deleteShareLink(
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await connectToDatabase();

    const result = await SharedLink.deleteOne({
      shortCode: code,
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        error: "Share link not found",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete share link error:", error);
    return {
      success: false,
      error: "Failed to delete share link",
    };
  }
}

/**
 * Get all share links for a simplification
 */
export async function getShareLinksForSimplification(
  simplificationId: string
): Promise<{
  success: boolean;
  data?: Array<{
    code: string;
    url: string;
    views: number;
    expiresAt: Date | null;
    createdAt: Date;
  }>;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await connectToDatabase();

    // Convert userId to ObjectId for query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Verify ownership
    const simplification = await Simplification.findOne({
      _id: simplificationId,
      userId: userObjectId,
    });

    if (!simplification) {
      return {
        success: false,
        error: "Simplification not found",
      };
    }

    const shareLinks = await SharedLink.find({ simplificationId }).lean();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      success: true,
      data: shareLinks.map((link) => ({
        code: link.shortCode,
        url: `${baseUrl}/shared/${link.shortCode}`,
        views: link.views,
        expiresAt: link.expiresAt ?? null,
        createdAt: link.createdAt,
      })),
    };
  } catch (error) {
    console.error("Get share links error:", error);
    return {
      success: false,
      error: "Failed to fetch share links",
    };
  }
}

/**
 * Regenerate a share link (creates new link and expires old ones)
 */
export async function regenerateShareLink(
  simplificationId: string,
  options?: { expiresInDays?: number }
): Promise<ShareLinkResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to regenerate share links",
      };
    }

    await connectToDatabase();

    // Convert userId to ObjectId for query
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Verify the simplification exists and belongs to the user
    const simplification = await Simplification.findOne({
      _id: simplificationId,
      userId: userObjectId,
    });

    if (!simplification) {
      return {
        success: false,
        error: "Simplification not found",
      };
    }

    // Expire all existing share links for this simplification
    await SharedLink.updateMany(
      { simplificationId },
      { expiresAt: new Date() }
    );

    // Generate a new unique share code
    const shortCode = nanoid(10);

    // Calculate expiration date
    const expiresAt = options?.expiresInDays
      ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days

    // Create the new share link
    await SharedLink.create({
      simplificationId,
      shortCode,
      expiresAt,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      success: true,
      data: {
        code: shortCode,
        url: `${baseUrl}/shared/${shortCode}`,
        expiresAt,
      },
    };
  } catch (error) {
    console.error("Regenerate share link error:", error);
    return {
      success: false,
      error: "Failed to regenerate share link",
    };
  }
}
