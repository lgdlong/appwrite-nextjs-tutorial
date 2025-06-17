// src/dto/user/list-users.dto.ts
import { z } from "zod";

export const ListUsersRequestSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(["username", "email", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

const UserSummarySchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  isAdmin: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ListUsersResponseSchema = z.object({
  users: z.array(UserSummarySchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const ListUsersErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
});

// Type definitions for TypeScript
export type ListUsersRequestDto = z.infer<typeof ListUsersRequestSchema>;
export type ListUsersResponseDto = z.infer<typeof ListUsersResponseSchema>;
export type ListUsersErrorDto = z.infer<typeof ListUsersErrorSchema>;
export type UserSummaryDto = z.infer<typeof UserSummarySchema>;
