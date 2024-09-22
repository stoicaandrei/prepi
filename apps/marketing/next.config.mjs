import createMDX from '@next/mdx'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  rewrites: async () => {
    return [
      {
        "source": "/ingest/static/:path*",
        "destination": "https://eu-assets.i.posthog.com/static/:path*"
      },
      {
        "source": "/ingest/:path*",
        "destination": "https://eu.i.posthog.com/:path*"
      }
    ]
  }
}
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)