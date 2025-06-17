import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({
  size = "medium",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
