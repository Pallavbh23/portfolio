const withMDX = require('@next/mdx')({ extension: /\.mdx?$/ });

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    // allow external images you actually use
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },                 // avatar
      { protocol: 'https', hostname: 'leetcard.jacoblin.cool' },     // if using that LeetCode card
      { protocol: 'https', hostname: 'leetcode-stats.vercel.app' }   // if using this LeetCode card
    ],
  },
});
