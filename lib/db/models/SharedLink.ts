import mongoose, { Schema, type Model } from "mongoose";

/**
 * SharedLink document interface
 *
 * Represents a public share link for a simplification.
 * Links can have optional expiration dates and track view counts.
 *
 * @see DATABASE_SCHEMA.md for full documentation
 */
export interface ISharedLink {
  _id: mongoose.Types.ObjectId;
  simplificationId: mongoose.Types.ObjectId;
  shortCode: string;
  expiresAt?: Date;
  views: number;
  createdAt: Date;
}

const SharedLinkSchema = new Schema<ISharedLink>(
  {
    simplificationId: {
      type: Schema.Types.ObjectId,
      ref: "Simplification",
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const SharedLink: Model<ISharedLink> =
  mongoose.models.SharedLink ??
  mongoose.model<ISharedLink>("SharedLink", SharedLinkSchema);

export default SharedLink;
