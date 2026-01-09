"use server";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import User, { defaultPreferences } from "@/lib/db/models/User";
import type { UserPreferences } from "@/lib/types";
import { z } from "zod";

// Validation schema for preferences
const PreferencesSchema = z.object({
  fontSize: z.number().min(12).max(32).optional(),
  theme: z.enum(["normal", "high-contrast", "dark", "cream"]).optional(),
  dyslexiaMode: z.boolean().optional(),
  speechRate: z.number().min(0.5).max(2).optional(),
  defaultMode: z.enum(["simple", "accessible", "summary"]).optional(),
});

export type PreferencesInput = z.infer<typeof PreferencesSchema>;

interface PreferencesResult {
  success: boolean;
  data?: UserPreferences;
  error?: string;
}

/**
 * Get user preferences from MongoDB
 *
 * @description Retrieves the user's accessibility and display preferences.
 * Returns default preferences for unauthenticated users.
 *
 * Default preferences:
 * - fontSize: 16
 * - theme: 'normal'
 * - dyslexiaMode: false
 * - speechRate: 1.0
 * - defaultMode: 'accessible'
 *
 * @returns Promise<PreferencesResult> with user preferences or defaults
 */
export async function getUserPreferences(): Promise<PreferencesResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      // Return defaults for unauthenticated users
      return {
        success: true,
        data: { ...defaultPreferences },
      };
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id)
      .select("preferences")
      .lean();

    if (!user) {
      return {
        success: true,
        data: { ...defaultPreferences },
      };
    }

    return {
      success: true,
      data: user.preferences ?? { ...defaultPreferences },
    };
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return {
      success: false,
      error: "Failed to fetch preferences",
    };
  }
}

/**
 * Update user preferences in MongoDB
 *
 * @description Updates one or more user preference fields. Only provided fields
 * are updated (partial update). Validates input against Zod schema.
 *
 * @param input - Partial preferences to update
 * @param input.fontSize - Font size (12-32 px)
 * @param input.theme - Theme: 'normal', 'high-contrast', 'dark', or 'cream'
 * @param input.dyslexiaMode - Enable OpenDyslexic font
 * @param input.speechRate - TTS speech rate (0.5-2.0)
 * @param input.defaultMode - Default simplification mode
 *
 * @returns Promise<PreferencesResult> with updated preferences
 *
 * @example
 * ```typescript
 * // Update only font size
 * await updatePreferences({ fontSize: 20 });
 *
 * // Update multiple settings
 * await updatePreferences({
 *   theme: 'high-contrast',
 *   dyslexiaMode: true
 * });
 * ```
 */
export async function updatePreferences(
  input: PreferencesInput
): Promise<PreferencesResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to update preferences",
      };
    }

    // Validate input
    const validated = PreferencesSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? "Invalid preferences",
      };
    }

    await connectToDatabase();

    // Update only the provided fields
    const updateFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated.data)) {
      if (value !== undefined) {
        updateFields[`preferences.${key}`] = value;
      }
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .select("preferences")
      .lean();

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: user.preferences,
    };
  } catch (error) {
    console.error("Error updating preferences:", error);
    return {
      success: false,
      error: "Failed to update preferences",
    };
  }
}

/**
 * Reset preferences to defaults
 *
 * @description Resets all user preferences to their default values.
 * Useful for troubleshooting or if user wants a fresh start.
 *
 * @returns Promise<PreferencesResult> with default preferences
 */
export async function resetPreferencesToDefaults(): Promise<PreferencesResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to reset preferences",
      };
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { preferences: { ...defaultPreferences } } },
      { new: true }
    )
      .select("preferences")
      .lean();

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: user.preferences,
    };
  } catch (error) {
    console.error("Error resetting preferences:", error);
    return {
      success: false,
      error: "Failed to reset preferences",
    };
  }
}

/**
 * Mark onboarding as completed
 *
 * @description Sets the onboardingCompleted flag to true in the user's profile.
 * This prevents the onboarding wizard from showing again.
 *
 * @returns Promise with success status or error
 */
export async function completeOnboarding(): Promise<{
  success: boolean;
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

    await User.findByIdAndUpdate(session.user.id, {
      $set: { onboardingCompleted: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return {
      success: false,
      error: "Failed to complete onboarding",
    };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return true; // Skip onboarding for unauthenticated
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id)
      .select("onboardingCompleted")
      .lean();

    return user?.onboardingCompleted ?? false;
  } catch {
    return true; // Default to true on error to avoid blocking
  }
}
