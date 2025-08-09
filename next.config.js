const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: { providerImportSource: '@mdx-js/react' },
});
module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'leetcard.jacoblin.cool' },
      { protocol: 'https', hostname: 'leetcode-stats.vercel.app' }
    ],
  },
});