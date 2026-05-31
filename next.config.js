/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection',          value: '1; mode=block' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig = {
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        source: '/:all*(svg|jpg|png|webp|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
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
