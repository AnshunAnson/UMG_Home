import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: process.env.NEXT_DIST_DIR || 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/UMG_Home' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
