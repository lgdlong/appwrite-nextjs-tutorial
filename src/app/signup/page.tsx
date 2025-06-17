"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with Appwrite"
    >
      <SignupForm />
    </AuthLayout>
  );
}
