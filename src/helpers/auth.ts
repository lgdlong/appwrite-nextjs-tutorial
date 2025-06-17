// src/helpers/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Define our own TokenPayload interface
export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  [key: string]: string | boolean | number | Record<string, unknown>; // Allow for additional properties
}

/**
 * Verify JWT token and return decoded payload if valid
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyJWT(token: string): TokenPayload | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

/**
 * Generate JWT token for a user
 * @param payload Data to include in JWT token
 * @param expiresIn Token expiration time (default: 1 day)
 * @returns Generated JWT token
 */
export function generateJWT(
  payload: Record<string, string | boolean | number | Record<string, unknown>>
): string {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

  // Helper function to convert object to Buffer to avoid TS error
  const signJwt = (payload: object, secret: string): string => {
    return jwt.sign(payload, secret);
  };

  return signJwt(payload, JWT_SECRET);
}

/**
 * Extract and verify token from request
 * @param req NextRequest object
 * @returns Decoded token or null if invalid/missing
 */
export function verifyAuthToken(req: NextRequest): TokenPayload | null {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return null;
    }

    return verifyJWT(token);
  } catch (error) {
    console.error("Auth token verification error:", error);
    return null;
  }
}
