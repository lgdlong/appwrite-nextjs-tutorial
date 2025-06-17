import { z } from "zod";

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  userId: z.string(),
  username: z.string(),
  token: z.string().optional(),
  sessionId: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export const LoginErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  attemptsRemaining: z.number().optional(),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;
export type LoginErrorDto = z.infer<typeof LoginErrorSchema>;
