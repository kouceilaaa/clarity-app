import mongoose, { Schema, type Model } from "mongoose";
import type { UserPreferences, SimplificationMode } from "@/lib/types";

/**
 * User document interface
 *
 * Represents a user account with authentication credentials,
 * accessibility preferences, and subscription information.
 */
export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  subscription?: {
    tier: "free" | "premium";
    startDate?: Date;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  fontSize: 16,
  theme: "normal",
  dyslexiaMode: false,
  speechRate: 1,
  defaultMode: "accessible" as SimplificationMode,
};

const PreferencesSchema = new Schema<UserPreferences>(
  {
    fontSize: { type: Number, default: 16, min: 12, max: 32 },
    theme: {
      type: String,
      default: "normal",
      enum: ["normal", "high-contrast", "dark", "cream"],
    },
    dyslexiaMode: { type: Boolean, default: false },
    speechRate: { type: Number, default: 1, min: 0.5, max: 2 },
    defaultMode: {
      type: String,
      default: "accessible",
      enum: ["simple", "accessible", "summary"],
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    preferences: {
      type: PreferencesSchema,
      default: () => ({ ...defaultPreferences }),
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: {
        tier: {
          type: String,
          enum: ["free", "premium"],
          default: "free",
        },
        startDate: Date,
        endDate: Date,
      },
      default: () => ({ tier: "free" }),
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
export { defaultPreferences };
