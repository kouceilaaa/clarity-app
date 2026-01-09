import mongoose, { Schema, type Model } from "mongoose";

/**
 * Simplification document interface
 *
 * Represents a text simplification with original content, simplified output,
 * mode used, and readability statistics.
 *
 * @see DATABASE_SCHEMA.md for full documentation
 */
export interface ISimplification {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  originalText: string;
  simplifiedText: string;
  mode: "simple" | "accessible" | "summary";
  sourceUrl?: string;
  statistics: {
    fleschBefore: number;
    fleschAfter: number;
    wordsCountBefore: number;
    wordsCountAfter: number;
    readingTimeBefore: number;
    readingTimeAfter: number;
  };
  isFavorite: boolean;
  createdAt: Date;
}

const SimplificationSchema = new Schema<ISimplification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    simplifiedText: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["simple", "accessible", "summary"],
      required: true,
    },
    sourceUrl: {
      type: String,
    },
    statistics: {
      fleschBefore: { type: Number, required: true },
      fleschAfter: { type: Number, required: true },
      wordsCountBefore: { type: Number, required: true },
      wordsCountAfter: { type: Number, required: true },
      readingTimeBefore: { type: Number, required: true },
      readingTimeAfter: { type: Number, required: true },
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient queries
SimplificationSchema.index({ userId: 1, createdAt: -1 });

const Simplification: Model<ISimplification> =
  mongoose.models.Simplification ??
  mongoose.model<ISimplification>("Simplification", SimplificationSchema);

export default Simplification;
