/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── www → non-www canonical redirect ───────────────────────────────────
  // Redirect poddarwealth.com → www.poddarwealth.com (permanent, SEO-safe)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'poddarwealth.com' }],
        destination: 'https://www.poddarwealth.com/:path*',
        permanent: true,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },

}

module.exports = nextConfig
