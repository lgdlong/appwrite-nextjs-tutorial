import { z } from "zod";

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
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

export type SignupRequestDto = z.infer<typeof SignupRequestSchema>;
export type SignupResponseDto = z.infer<typeof SignupResponseSchema>;
export type SignupErrorDto = z.infer<typeof SignupErrorSchema>;
