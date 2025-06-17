// src/dto/user/update-user.dto.ts
import { z } from "zod";

/**
 * Schema for validating user update requests
 * All fields are optional since updates may be partial
 */
export const UpdateUserRequestSchema = z.object({
  userId: z.string(),
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .optional(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  isAdmin: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  socialLinks: z
    .object({
      github: z.string().url().optional().nullable(),
      twitter: z.string().url().optional().nullable(),
      linkedin: z.string().url().optional().nullable(),
      website: z.string().url().optional().nullable(),
    })
    .optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      emailNotifications: z.boolean().optional(),
    })
    .optional(),
});

export const UpdateUserResponseSchema = z.object({
  userId: z.string(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  isAdmin: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  updatedAt: z.string().datetime(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  socialLinks: z
    .object({
      github: z.string().url().optional().nullable(),
      twitter: z.string().url().optional().nullable(),
      linkedin: z.string().url().optional().nullable(),
      website: z.string().url().optional().nullable(),
    })
    .optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      emailNotifications: z.boolean().optional(),
    })
    .optional(),
});

export const UpdateUserErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  field: z.string().optional(),
});

// Type definitions for TypeScript
export type UpdateUserRequestDto = z.infer<typeof UpdateUserRequestSchema>;
export type UpdateUserResponseDto = z.infer<typeof UpdateUserResponseSchema>;
export type UpdateUserErrorDto = z.infer<typeof UpdateUserErrorSchema>;
