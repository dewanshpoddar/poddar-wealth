import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ADVISOR_PHONE } from '@/lib/constants'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL('https://www.poddarwealth.com'),
  title: 'Poddar Wealth Management — Life Insurance & Wealth Planning Since 1994',
  description: 'Trusted insurance advisor in Gorakhpur. LIC, Star Health, wealth planning by MDRT Member Ajay Kumar Poddar. 31+ years, 5000+ families protected.',
  keywords: ['LIC agent Gorakhpur', 'life insurance Gorakhpur', 'LIC advisor UP', 'Ajay Kumar Poddar', 'wealth management Gorakhpur', 'health insurance UP'],
  authors: [{ name: 'Ajay Kumar Poddar' }],
  verification: { google: 'yhsT75V26EOLX22AbKa7E9GXKeK36erqfm0DLCq5EdM' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.poddarwealth.com',
    siteName: 'Poddar Wealth Management',
    title: 'Poddar Wealth Management — Life Insurance & Wealth Planning Since 1994',
    description: 'Trusted insurance advisor in Gorakhpur. LIC, Star Health, wealth planning by MDRT Member Ajay Kumar Poddar. 31+ years, 5000+ families protected.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poddar Wealth Management — Life Insurance & Wealth Planning Since 1994',
    description: 'Trusted insurance advisor in Gorakhpur. LIC, Star Health, wealth planning by MDRT Member Ajay Kumar Poddar. 31+ years, 5000+ families protected.',
  },
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://www.poddarwealth.com/feed.xml',
    },
  },
  manifest: '/manifest.json',
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Poddar Wealth Management',
  url: 'https://www.poddarwealth.com',
  logo: 'https://www.poddarwealth.com/favicon.svg',
  telephone: `+91${ADVISOR_PHONE}`,
  email: 'poddarwealth@gmail.com',
  foundingDate: '1994',
  founder: {
    '@type': 'Person',
    name: 'Ajay Kumar Poddar',
    jobTitle: 'MDRT Member & Insurance Advisor',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'AD Mall Compound, Vijay Chowk, Shahpur',
    addressLocality: 'Gorakhpur',
    addressRegion: 'Uttar Pradesh',
    postalCode: '273001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.7606,
    longitude: 83.3732,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '154',
    bestRating: '5',
  },
  areaServed: {
    '@type': 'City',
    name: 'Gorakhpur',
  },
  sameAs: ['https://www.google.com/maps/place/Poddar+Wealth+Management/'],
  description: 'Life insurance, health insurance, and wealth planning by MDRT Member Ajay Kumar Poddar since 1994.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://api.groq.com" />
      </head>
      <body className={`${fraunces.variable} ${plusJakartaSans.variable} font-sans text-13 text-gray-900 bg-white antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {/* ── Google Analytics 4 — default-deny until consent given ── */}
        {GA_ID && (
          <>
            <Script id="ga4-consent-default" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied'});`}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}

        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <Analytics />
        <SpeedInsights />
        <Script id="pwa-sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(err => {
                console.warn('Service worker registration failed:', err);
              });
            });
          }`}
        </Script>
      </body>
    </html>
  )
}
