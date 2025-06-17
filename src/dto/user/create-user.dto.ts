// src/dto/user/create-user.dto.ts
import { z } from "zod";

/**
 * Schema for validating user creation requests
 * Similar to signup but used in admin contexts for creating users
 */
export const CreateUserRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .trim(),
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
    .trim(),
  isAdmin: z.boolean().optional().default(false),
  isVerified: z.boolean().optional().default(false),
});

export const CreateUserResponseSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  username: z.string(),
  isAdmin: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
});

export const CreateUserErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  field: z.string().optional(),
});

// Type definitions for TypeScript
export type CreateUserRequestDto = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponseDto = z.infer<typeof CreateUserResponseSchema>;
export type CreateUserErrorDto = z.infer<typeof CreateUserErrorSchema>;
