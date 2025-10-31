import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Skip ESLint during Next.js production builds to avoid linting generated Prisma files
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "ovco9b5jyh.ufs.sh",
      },
      {
        hostname: "0rgtt53d3i.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
