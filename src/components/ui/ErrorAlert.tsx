import React from "react";
import Link from "next/link";

interface ErrorAlertProps {
  message: string;
  linkText?: string;
  linkHref?: string;
}

export default function ErrorAlert({
  message,
  linkText,
  linkHref,
}: ErrorAlertProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] bg-[#121212] text-white p-4">
      <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
      <p className="text-gray-300">{message}</p>

      {linkText && linkHref && (
        <Link href={linkHref} className="mt-4 text-blue-400 hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}
