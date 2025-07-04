// src/components/auth/LoginForm.tsx
"use client";

/**
 * Component: LoginForm
 * - Validate input (username, password) bằng Yup/react-hook-form
 * - Gửi POST request tới API /api/auth/login
 * - Hiển thị lỗi, xử lý UX khi đăng nhập
 */

import { useState } from "react";
import Link from "next/link";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

// 1. Định nghĩa schema validate bằng Yup cho UX realtime phía client
const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export default function LoginForm() {
  // State để lưu lỗi (hiển thị lên UI)
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo react-hook-form với yupResolver để validate form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  /**
   * Hàm submit form login
   * - Gửi dữ liệu tới API login
   * - Nếu login thành công: lưu user, chuyển trang
   * - Nếu thất bại: hiển thị lỗi
   */
  const onLogin = async (values: LoginFormValues) => {
    setError(null); // Reset lỗi cũ
    try {
      // Gửi request tới API login (trả về cookie httpOnly nếu thành công)
      const response = await axios.post("/api/auth/login", values);

      if (response.data.success) {
        // Lưu user vào localStorage (nếu cần)
        localStorage.setItem("user", JSON.stringify(response.data.user));
        reset(); // Reset lại form sau khi login thành công
        window.location.href = "/"; // Redirect về trang chủ (hoặc trang profile tuỳ ý)
      } else {
        // Lỗi này hiếm gặp (đa số error sẽ vào catch)
        setError(response.data.error || "Login failed");
      }
    } catch (err) {
      // Bắt lỗi chi tiết với axios
      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status;
        const errorMessage = err.response?.data?.error;

        if (statusCode === 401) {
          setError(errorMessage || "Invalid username or password");
        } else if (statusCode === 404) {
          setError(errorMessage || "User not found");
        } else if (statusCode === 400) {
          setError(errorMessage || "Invalid input data");
        } else if (statusCode === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(errorMessage || "Login failed");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onLogin)} noValidate>
        {/* Username field */}
        <FormInput
          id="username"
          label="Username"
          type="text"
          placeholder="johndoe"
          required
          {...register("username")}
          error={errors.username?.message}
        />

        {/* Password field */}
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          {...register("password")}
          error={errors.password?.message}
        />

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="text-red-500 text-sm font-semibold">{error}</div>
        )}

        {/* Nút submit: disable khi đang gửi */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </form>
      {/* Link chuyển sang signup */}
      <div className="text-center text-sm">
        <p className="text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
