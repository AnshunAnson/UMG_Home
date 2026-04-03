import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/UMG_Home',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
