import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;
