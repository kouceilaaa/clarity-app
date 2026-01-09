"use server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import Simplification from "@/lib/db/models/Simplification";
import User from "@/lib/db/models/User";

// Constants for quota limits
const FREE_TIER_DAILY_LIMIT = 10;
const PREMIUM_TIER_DAILY_LIMIT = 100;

export interface QuotaResult {
  success: boolean;
  data?: {
    used: number;
    limit: number;
    tier: "free" | "premium";
    resetsAt: string;
  };
  error?: string;
}

/**
 * Get user's simplification quota for today
 *
 * @description Retrieves the user's daily quota information including:
 * - Number of simplifications used today
 * - Daily limit based on tier (free: 10, premium: 100)
 * - When the quota resets (midnight UTC)
 *
 * @returns Promise<QuotaResult> with quota data or error
 *
 * @example
 * ```typescript
 * const quota = await getUserQuota();
 * if (quota.success) {
 *   console.log(`${quota.data.used}/${quota.data.limit} used`);
 *   console.log(`Resets at: ${quota.data.resetsAt}`);
 * }
 * ```
 */
export async function getUserQuota(): Promise<QuotaResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to view quota",
      };
    }

    await connectToDatabase();

    // Get user to check tier
    const user = await User.findById(session.user.id).lean();
    const isPremium = user?.subscription?.tier === "premium";

    // Calculate start of today (midnight UTC)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    // Calculate reset time (midnight tomorrow UTC)
    const resetTime = new Date(todayStart);
    resetTime.setUTCDate(resetTime.getUTCDate() + 1);

    // Count simplifications created today
    const todayCount = await Simplification.countDocuments({
      userId: session.user.id,
      createdAt: { $gte: todayStart },
    });

    return {
      success: true,
      data: {
        used: todayCount,
        limit: isPremium ? PREMIUM_TIER_DAILY_LIMIT : FREE_TIER_DAILY_LIMIT,
        tier: isPremium ? "premium" : "free",
        resetsAt: resetTime.toISOString(),
      },
    };
  } catch (error) {
    console.error("Get quota error:", error);
    return {
      success: false,
      error: "Failed to fetch quota",
    };
  }
}

export interface UserStatsResult {
  success: boolean;
  data?: {
    totalSimplifications: number;
    totalFavorites: number;
    thisWeek: number;
    thisMonth: number;
    favoriteMode: "simple" | "accessible" | "summary" | null;
    averageImprovement: number;
  };
  error?: string;
}

/**
 * Get comprehensive user statistics
 *
 * @description Retrieves aggregated statistics about the user's usage including:
 * - Total lifetime simplifications
 * - Total favorites count
 * - Simplifications this week/month
 * - Most frequently used mode
 * - Average readability improvement
 *
 * @returns Promise<UserStatsResult> with aggregated statistics
 *
 * @example
 * ```typescript
 * const stats = await getUserStats();
 * if (stats.success) {
 *   console.log(`Total: ${stats.data.totalSimplifications}`);
 *   console.log(`Favorite mode: ${stats.data.favoriteMode}`);
 * }
 * ```
 */
export async function getUserStats(): Promise<UserStatsResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to view stats",
      };
    }

    await connectToDatabase();

    // Get dates for filtering
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setMonth(monthStart.getMonth() - 1);

    // Total counts
    const totalSimplifications = await Simplification.countDocuments({
      userId: session.user.id,
    });

    const totalFavorites = await Simplification.countDocuments({
      userId: session.user.id,
      isFavorite: true,
    });

    // This week/month
    const thisWeek = await Simplification.countDocuments({
      userId: session.user.id,
      createdAt: { $gte: weekStart },
    });

    const thisMonth = await Simplification.countDocuments({
      userId: session.user.id,
      createdAt: { $gte: monthStart },
    });

    // Find favorite mode using aggregation
    const modeStats = await Simplification.aggregate([
      { $match: { userId: session.user.id } },
      { $group: { _id: "$mode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const favoriteMode = modeStats.length > 0 ? modeStats[0]._id : null;

    // Calculate average improvement
    const avgImprovement = await Simplification.aggregate([
      {
        $match: {
          userId: session.user.id,
          "statistics.improvement": { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          avgImprovement: { $avg: "$statistics.improvement" },
        },
      },
    ]);

    return {
      success: true,
      data: {
        totalSimplifications,
        totalFavorites,
        thisWeek,
        thisMonth,
        favoriteMode,
        averageImprovement:
          avgImprovement.length > 0
            ? Math.round(avgImprovement[0].avgImprovement)
            : 0,
      },
    };
  } catch (error) {
    console.error("Get stats error:", error);
    return {
      success: false,
      error: "Failed to fetch stats",
    };
  }
}
