import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333333] text-center">
        <h2 className="text-3xl font-bold text-white">404 - Page Not Found</h2>
        <p className="mt-2 text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link href="/" className="text-blue-400 hover:underline">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
