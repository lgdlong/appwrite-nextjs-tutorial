"use client";

/**
 * SignupForm component
 * - Validate field phía client (yup/react-hook-form)
 * - Gửi POST tới API signup (dùng axios)
 * - Hiển thị lỗi hoặc redirect về login khi thành công
 */

import { useState } from "react";
import Link from "next/link";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";

// Dùng Yup để UX realtime, KHÔNG nhất thiết phải match 100% backend Zod (có thể lỏng hơn để UX tốt)
const signupSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  username: yup.string().min(2, "Username must be at least 2 characters").required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .required("Password is required"),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

export default function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Setup react-hook-form với yup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
  });

  // Xử lý khi submit form
  const onSignup = async (values: SignupFormValues) => {
    setServerError(null);
    setSuccess(null);
    try {
      // Gửi POST request tới API signup (axios sẽ tự set header + parse JSON)
      await axios.post("/api/auth/signup", values);

      // Thành công: báo thành công, redirect
      setSuccess("Signup successful! You can now log in.");
      reset();
      router.push("/login");
    } catch (error) {
      // Bắt lỗi trả về từ API
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error;

        if (statusCode === 409) {
          setServerError(errorMessage || "User with this email or username already exists.");
        } else if (statusCode === 400) {
          // Có thể lấy chi tiết từng field nếu cần
          setServerError(errorMessage || "Invalid data provided. Please check your information.");
        } else if (statusCode === 500) {
          setServerError("Server error. Please try again later.");
        } else if (error.request) {
          setServerError("Network error. Please check your internet connection.");
        } else {
          setServerError(error.message || "Signup failed. Please try again.");
        }
      } else {
        setServerError(
          `Something went wrong. Please try again. ${
            error instanceof Error ? error.message : ""
          }`
        );
      }
      setSuccess(null);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSignup)} noValidate>
        {/* Email field */}
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          {...register("email")}
          error={errors.email?.message}
        />

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

        {/* Hiển thị lỗi */}
        {serverError && (
          <div className="text-red-500 text-sm font-semibold">
            {serverError}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm font-semibold">{success}</div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
