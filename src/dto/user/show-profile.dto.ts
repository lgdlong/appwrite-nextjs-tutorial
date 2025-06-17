import { z } from "zod";

export const ShowProfileRequestSchema = z.object({
  userId: z.string(),
});

const SocialLinksSchema = z
  .object({
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
  })
  .catchall(z.string().optional());

const PreferencesSchema = z
  .object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    emailNotifications: z.boolean().optional(),
  })
  .catchall(z.union([z.string(), z.boolean(), z.number()]).optional());

export const ShowProfileResponseSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  socialLinks: SocialLinksSchema.optional(),
  preferences: PreferencesSchema.optional(),
});

export const ShowProfileErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
});

export type ShowProfileRequestDto = z.infer<typeof ShowProfileRequestSchema>;
export type ShowProfileResponseDto = z.infer<typeof ShowProfileResponseSchema>;
export type ShowProfileErrorDto = z.infer<typeof ShowProfileErrorSchema>;
