import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333333]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
