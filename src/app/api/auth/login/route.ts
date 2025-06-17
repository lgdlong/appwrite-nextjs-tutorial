// src/app/api/auth/login/route.ts

/**
 * API endpoint: POST /api/auth/login
 * - Xác thực thông tin đăng nhập (username, password)
 * - Validate dữ liệu đầu vào bằng Zod (LoginRequestSchema)
 * - So sánh mật khẩu đã hash bằng bcrypt
 * - Nếu thành công: trả về user info và JWT token (set cookie)
 * - Nếu thất bại: trả về lỗi kèm message chi tiết
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/config/dbConfig";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs"; // Dùng để so sánh hash password
import jwt from "jsonwebtoken"; // Sinh JWT token xác thực
import { LoginRequestSchema } from "@/dto/auth/login.dto"; // Zod schema validate

// Đảm bảo kết nối MongoDB được thiết lập
async function dbConnect() {
  await connectToDatabase();
}

export async function POST(req: NextRequest) {
  try {
    // 1. Kết nối database
    await dbConnect();

    // 2. Parse dữ liệu gửi lên (body)
    const body = await req.json();

    // 3. Validate input bằng Zod
    const validation = LoginRequestSchema.safeParse(body);
    if (!validation.success) {
      // Nếu không hợp lệ, trả về lỗi chi tiết từng field
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.format(), // Trả lỗi dạng object {field: { _errors: [msg] } }
        },
        { status: 400 }
      );
    }

    // 4. Lấy username & password hợp lệ đã validate
    const { username, password } = validation.data;

    // 5. Tìm user trong database (theo username)
    const user = await UserModel.findOne({ username });
    if (!user) {
      // Không tìm thấy user, trả về lỗi
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 6. So sánh password client gửi lên với password đã hash trong DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Password không đúng
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 7. Tạo JWT token để xác thực
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Token hết hạn sau 1 ngày
    );

    // 8. Trả về thông tin user & set cookie token (httpOnly, secure)
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        token,
      },
      {
        status: 200,
        headers: {
          // Lưu ý: chỉ httpOnly cookie mới bảo mật trên trình duyệt
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
        },
      }
    );
  } catch (error) {
    // 9. Bắt lỗi hệ thống (ví dụ lỗi DB)
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
