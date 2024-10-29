import type { NextConfig } from "next";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
