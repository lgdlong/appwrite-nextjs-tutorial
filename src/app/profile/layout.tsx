"use client";

import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Navigation Bar */}
      <nav className="bg-[#1e1e1e] border-b border-[#333333] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl">
            Appwrite App
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
            <Link href="/signup" className="text-gray-300 hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pb-12">{children}</div>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] border-t border-[#333333] p-6 text-center text-gray-400">
        <p className="text-sm">
          © {new Date().getFullYear()} Appwrite Next.js Tutorial. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
