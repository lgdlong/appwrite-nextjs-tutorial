// src/lib/api/users.ts
import axios from "axios";
import * as yup from "yup";

// Define interfaces for user data
export interface SocialLinks {
  github?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  emailNotifications?: boolean;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  isVerified?: boolean;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  password?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  isVerified?: boolean;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
}

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ValidationErrorResponse {
  validationErrors: Record<string, string>;
}

// Define Yup schemas for client-side validation
export const createUserSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  username: yup
    .string()
    .required("Username is required")
    .min(2, "Username must be at least 2 characters long"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  isAdmin: yup.boolean().optional(),
  isVerified: yup.boolean().optional(),
});

export const updateUserSchema = yup.object({
  email: yup.string().email("Please enter a valid email").optional(),
  username: yup
    .string()
    .min(2, "Username must be at least 2 characters long")
    .optional(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .optional(),
  displayName: yup.string().optional(),
  bio: yup.string().optional(),
  avatarUrl: yup.string().url("Must be a valid URL").nullable().optional(),
  isAdmin: yup.boolean().optional(),
  isVerified: yup.boolean().optional(),
  socialLinks: yup
    .object({
      github: yup.string().url("Must be a valid URL").nullable().optional(),
      twitter: yup.string().url("Must be a valid URL").nullable().optional(),
      linkedin: yup.string().url("Must be a valid URL").nullable().optional(),
      website: yup.string().url("Must be a valid URL").nullable().optional(),
    })
    .optional(),
  preferences: yup
    .object({
      theme: yup.string().oneOf(["light", "dark", "system"]).optional(),
      emailNotifications: yup.boolean().optional(),
    })
    .optional(),
});

/**
 * Get a list of users with pagination
 */
export async function getUsers(options: PaginationOptions = {}) {
  try {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = options;
    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search) queryParams.append("search", search);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);

    const response = await axios.get(`/api/users?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Get a single user by ID
 */
export async function getUser(userId: string) {
  try {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

/**
 * Create a new user (admin only)
 */
export async function createUser(userData: CreateUserData) {
  try {
    // Client-side validation with Yup
    await createUserSchema.validate(userData, { abortEarly: false });

    const response = await axios.post("/api/users", userData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      // Handle Yup validation errors
      const validationErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      throw { validationErrors } as ValidationErrorResponse;
    }
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, userData: UpdateUserData) {
  try {
    // Client-side validation with Yup
    await updateUserSchema.validate(userData, { abortEarly: false });

    const response = await axios.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      // Handle Yup validation errors
      const validationErrors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      throw { validationErrors } as ValidationErrorResponse;
    }
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string) {
  try {
    const response = await axios.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
}
