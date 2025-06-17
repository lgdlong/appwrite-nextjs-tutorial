/**
 * API endpoint: GET/POST/PUT/DELETE /api/users/[id]
 * - GET: Get a specific user by ID
 * - POST: Create a new user
 * - PUT: Update an existing user
 * - DELETE: Delete a user
 *
 * All routes are protected and require authentication
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/dbConfig";
import { UserModel } from "@/models/user.model";
import { verifyAuthToken } from "@/helpers/auth";
import bcrypt from "bcryptjs";
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  DeleteUserRequestSchema,
  ShowProfileRequestSchema,
} from "@/dto/user";

async function dbConnect() {
  await connectToDatabase();
}

// GET: Fetch single user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user authentication
    const decodedToken = verifyAuthToken(req);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Validate params with Zod
    const validationResult = ShowProfileRequestSchema.safeParse({
      userId: params.id,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await UserModel.findById(params.id).select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Format the response
    return NextResponse.json({
      success: true,
      user: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        socialLinks: user.socialLinks,
        preferences: user.preferences,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create new user
export async function POST(req: NextRequest) {
  try {
    // Verify administrator access
    const decodedToken = verifyAuthToken(req);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has admin privileges
    if (!decodedToken.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Administrator access required" },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    // Parse and validate request body
    const body = await req.json();
    const validationResult = CreateUserRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Extract validated data
    const { email, username, password, isAdmin, isVerified } =
      validationResult.data;

    // Check for existing email or username
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      return NextResponse.json(
        {
          success: false,
          error: `${field === "email" ? "Email" : "Username"} already exists`,
          field,
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await UserModel.create({
      email,
      username,
      password: hashedPassword,
      isAdmin: isAdmin ?? false,
      isVerified: isVerified ?? false,
    });

    // Return success response without password
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          userId: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          isVerified: newUser.isVerified,
          createdAt: newUser.createdAt?.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update existing user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const decodedToken = verifyAuthToken(req);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Parse and validate request body
    const body = await req.json();
    const validationResult = UpdateUserRequestSchema.safeParse({
      userId: params.id,
      ...body,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await UserModel.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check permissions - only allow self-update or admin updates
    const isSelfUpdate = decodedToken.userId === params.id;
    const isAdminUpdate = decodedToken.isAdmin === true;

    if (!isSelfUpdate && !isAdminUpdate) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this user" },
        { status: 403 }
      );
    }

    // Extract data after validation
    const {
      email,
      username,
      password,
      displayName,
      bio,
      avatarUrl,
      socialLinks,
      preferences,
      isAdmin,
      isVerified,
    } = validationResult.data;

    // Check for existing email/username if changing
    if (email && email !== user.email) {
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: "Email already exists", field: "email" },
          { status: 409 }
        );
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return NextResponse.json(
          {
            success: false,
            error: "Username already exists",
            field: "username",
          },
          { status: 409 }
        );
      }
    }

    // Update user data
    const updateData: Record<string, unknown> = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
    if (preferences !== undefined) updateData.preferences = preferences;

    // Only admin can update admin status
    if (isAdminUpdate) {
      if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
      if (isVerified !== undefined) updateData.isVerified = isVerified;
    }

    // Apply updates
    const updatedUser = await UserModel.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    ).select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    );

    // Return response
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        userId: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
        isAdmin: updatedUser.isAdmin,
        isVerified: updatedUser.isVerified,
        socialLinks: updatedUser.socialLinks,
        preferences: updatedUser.preferences,
        updatedAt: updatedUser.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const decodedToken = verifyAuthToken(req);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Validate user ID
    const validationResult = DeleteUserRequestSchema.safeParse({
      userId: params.id,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Check permissions - only allow self-delete or admin delete
    const isSelfDelete = decodedToken.userId === params.id;
    const isAdminDelete = decodedToken.isAdmin === true;

    if (!isSelfDelete && !isAdminDelete) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this user" },
        { status: 403 }
      );
    }

    // Find and delete user
    const deletedUser = await UserModel.findByIdAndDelete(params.id);
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      userId: params.id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
