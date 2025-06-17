// src/dto/user/delete-user.dto.ts
import { z } from "zod";

export const DeleteUserRequestSchema = z.object({
  userId: z.string(),
});

export const DeleteUserResponseSchema = z.object({
  userId: z.string(),
  success: z.boolean(),
  message: z.string(),
});

export const DeleteUserErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
});

// Type definitions for TypeScript
export type DeleteUserRequestDto = z.infer<typeof DeleteUserRequestSchema>;
export type DeleteUserResponseDto = z.infer<typeof DeleteUserResponseSchema>;
export type DeleteUserErrorDto = z.infer<typeof DeleteUserErrorSchema>;
