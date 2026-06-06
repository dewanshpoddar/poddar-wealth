const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.groq.com https://www.google-analytics.com https://script.google.com https://www.googletagmanager.com https://o*.ingest.sentry.io",
  "frame-src 'self' https://www.google.com",
  "media-src 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection',          value: '1; mode=block' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy',   value: csp },
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
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "poddar-wealth",
  project: "poddarwealth",
  disableLogger: true,
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
})
