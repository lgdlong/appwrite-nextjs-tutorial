"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  // State to track if user is logged in
  const [user, setUser] = useState<{
    userId: string;
    username: string;
    email: string;
  } | null>(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // In a real app, you would call an API to invalidate the token
      // For example: await axios.post('/api/auth/logout');

      // For now, just clear local storage
      localStorage.removeItem("user");
      setUser(null);

      // Show success message - in a real app you might use a toast library
      alert("You have been logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error during logout. Please try again.");
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Auth status banner */}
      <div className="w-full flex justify-center">
        <div className="bg-[#1e1e1e] text-white rounded-lg p-4 max-w-4xl w-full mb-6 flex justify-between items-center">
          {user ? (
            <>
              <span className="text-lg">
                Welcome, <span className="font-bold">{user.username}</span>!
              </span>
              <div className="flex gap-4">
                <Link
                  href={`/profile/${user.userId}`}
                  className="text-blue-400 hover:underline"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-lg">Welcome, Guest!</span>
              <div className="flex gap-4">
                <Link href="/login" className="text-blue-400 hover:underline">
                  Login
                </Link>
                <Link href="/signup" className="text-green-400 hover:underline">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <main className="flex flex-col gap-[32px] items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            {user ? (
              <>You are successfully logged in!</>
            ) : (
              <>Please login to access your account.</>
            )}
          </li>
          <li className="tracking-[-.01em]">
            Navigate to see your profile and edit your information.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
