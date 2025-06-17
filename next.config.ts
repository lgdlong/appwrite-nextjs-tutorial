import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Handle any potential routing issues
      {
        source: "/login/",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/signup/",
        destination: "/signup",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
