// Simplified Next.js config without MDX – using remark at runtime for markdown parsing
/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'leetcard.jacoblin.cool' },
      { protocol: 'https', hostname: 'leetcode-stats.vercel.app' }
    ],
  },
  trailingSlash: true,
};
module.exports = config;