// src/dto/auth/signup.dto.ts
import { z } from "zod";

/**
 * Schema dùng để validate input khi signup (API, test, client-side đều dùng được)
 * - email: bắt buộc, phải là email hợp lệ
 * - username: ít nhất 2 ký tự, không để trống
 * - password: ít nhất 8 ký tự, có số, chữ, ký tự đặc biệt
 */
export const SignupRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const SignupResponseSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  username: z.string(),
  token: z.string().optional(),
  sessionId: z.string().optional(),
});

export const SignupErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  field: z.string().optional(),
});

// Infer types cho code TS dùng type-check (an toàn khi code backend)
export type SignupRequestDto = z.infer<typeof SignupRequestSchema>;
export type SignupResponseDto = z.infer<typeof SignupResponseSchema>;
export type SignupErrorDto = z.infer<typeof SignupErrorSchema>;
