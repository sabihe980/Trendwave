import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  transpilePackages: ["recharts"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

