// src/models/user.model.ts
import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    github: String,
    twitter: String,
    linkedin: String,
    website: String,
  },
  { _id: false }
);

const preferencesSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    displayName: String,
    bio: String,
    avatarUrl: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      type: socialLinksSchema,
      default: {},
    },
    preferences: {
      type: preferencesSchema,
      default: {},
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

// Check if the model already exists to prevent the "OverwriteModelError"
// This is important in Next.js API routes which may be called multiple times
export const UserModel =
  mongoose.models.users || mongoose.model("users", userSchema);
