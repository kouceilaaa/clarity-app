"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "next-auth/react";
import { connectToDatabase } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { RegisterSchema } from "@/lib/utils/validation";
import { auth } from "../auth";

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterInput): Promise<AuthResult> {
  try {
    // Validate input
    const validatedData = RegisterSchema.parse(data);

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      const issues = error.issues;
      return {
        success: false,
        error: issues[0]?.message ?? "Validation error",
      };
    }

    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
}

/**
 * Login user with credentials
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Logout user
 */
export async function logoutUser() {
  await signOut({ redirect: true, callbackUrl: "/" });
}

/**
 * Change user password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to change your password",
      };
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters",
      };
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: "Failed to change password. Please try again.",
    };
  }
}

/**
 * Delete user account and all associated data
 */
export async function deleteAccount(password: string): Promise<AuthResult> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to delete your account",
      };
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        success: false,
        error: "Incorrect password",
      };
    }

    // Import models for cascade delete
    const Simplification = (await import("@/lib/db/models/Simplification"))
      .default;
    const SharedLink = (await import("@/lib/db/models/SharedLink")).default;

    // Get all user's simplifications
    const simplifications = await Simplification.find({ userId: user._id });
    const simplificationIds = simplifications.map((s) => s._id);

    // Delete all shared links for user's simplifications
    await SharedLink.deleteMany({
      simplificationId: { $in: simplificationIds },
    });

    // Delete all user's simplifications
    await Simplification.deleteMany({ userId: user._id });

    // Delete user
    await User.deleteOne({ _id: user._id });

    // Sign out will happen on the client side
    return { success: true };
  } catch (error) {
    console.error("Delete account error:", error);
    return {
      success: false,
      error: "Failed to delete account. Please try again.",
    };
  }
}
