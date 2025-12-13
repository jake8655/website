import type { NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    ppr: true,
  },
  transpilePackages: ["three"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
