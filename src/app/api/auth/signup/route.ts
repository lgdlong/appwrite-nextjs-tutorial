/**
 * API endpoint: POST /api/auth/signup
 * - Validate input dùng Zod schema (SignupRequestSchema)
 * - Check trùng email/username
 * - Hash password (bcrypt)
 * - Lưu user vào database
 * - Trả về thông tin user (không trả password)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/dbConfig";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { SignupRequestSchema } from "@/dto/auth/signup.dto"; // Đã định nghĩa ở trên

async function dbConnect() {
  await connectToDatabase();
}

export async function POST(req: NextRequest) {
  const HASH_COST = 10; // Số vòng lặp hash password, lấy từ env nếu muốn

  try {
    // Kết nối DB
    await dbConnect();

    // Parse body request
    const body = await req.json();

    // Validate input dùng Zod DTO
    const validationResult = SignupRequestSchema.safeParse(body);
    if (!validationResult.success) {
      // Trả lỗi chi tiết từng trường cho client
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Lấy dữ liệu đã validate ra
    const { email, username, password } = validationResult.data;

    // Check email đã tồn tại?
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already exists", field: "email" },
        { status: 409 }
      );
    }

    // Check username đã tồn tại?
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: "Username already exists", field: "username" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, HASH_COST);

    // Tạo user mới
    const user = await UserModel.create({
      email,
      username,
      password: hashedPassword,
    });

    // Trả về user info (không trả password)
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          userId: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Bắt mọi lỗi hệ thống (DB, server...)
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
