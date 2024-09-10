/** @type {import('next').NextConfig} */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@prepi/api", "@prepi/db"],
  // We already do linting in the CI pipeline
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  }
};

export default nextConfig;
