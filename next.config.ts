import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/weekly', destination: '/weekly/index.html' }];
  },
};

export default nextConfig;
