/**
 * API endpoint: GET /api/users
 * - List all users with pagination, sorting, and filtering
 * - Protected route - requires authentication (JWT)
 * - Response is paginated and sorted according to query parameters
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/dbConfig";
import { UserModel } from "@/models/user.model";
import { ListUsersRequestSchema } from "@/dto/user/list-users.dto";
import { verifyAuthToken } from "@/helpers/auth";

async function dbConnect() {
  await connectToDatabase();
}

export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const decodedToken = verifyAuthToken(req);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    // Validate query parameters with Zod
    const validationResult = ListUsersRequestSchema.safeParse({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }
    // Build filter query
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { displayName: { $regex: search, $options: "i" } },
      ];
    }

    // Count total documents for pagination
    const total = await UserModel.countDocuments(filter);

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const users = await UserModel.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
      );

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Format user data according to DTO
    const formattedUsers = users.map((user) => ({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    // Return response
    return NextResponse.json({
      success: true,
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
