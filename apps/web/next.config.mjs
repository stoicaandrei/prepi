/** @type {import('next').NextConfig} */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
// !process.env.SKIP_ENV_VALIDATION && (await import("./env/server.mjs"));

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@prepi/api", "@prepi/db"],
  // We already do linting in the CI pipeline
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
};

export default nextConfig;
