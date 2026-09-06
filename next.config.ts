import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Protocol + www normalization handled by middleware.ts at the edge.
      // Add application-level redirects here for URL consolidation if needed.
    ]
  },
};

export default nextConfig;
