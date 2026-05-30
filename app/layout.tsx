import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '900'],
  style:    ['normal', 'italic'],
  variable: '--font-display',
  display:  'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display:  'swap',
})
import { LangProvider } from '@/lib/LangContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AIChatButton } from '@/src/features/ai-agent'
import LeadPopup from '@/components/LeadPopup'
import ProblemSolutionSection from '@/components/ProblemSolutionSection'
import WhatsAppButton from '@/components/WhatsAppButton'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL('https://www.poddarwealth.com'),
  title: 'Poddar Wealth Management — Excellence in Protection Since 1994',
  description: 'India\'s most trusted insurance advisor specializing in LIC, Star Health, and wealth planning by Mr. Ajay Kumar Poddar, MDRT Member & Chairman\'s Club awardee.',
  keywords: ['LIC agent Gorakhpur', 'life insurance Gorakhpur', 'LIC advisor UP', 'Ajay Kumar Poddar', 'wealth management Gorakhpur', 'health insurance UP'],
  authors: [{ name: 'Ajay Kumar Poddar' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.poddarwealth.com',
    siteName: 'Poddar Wealth Management',
    title: 'Poddar Wealth Management — 30+ Years of Trusted Insurance Advisory',
    description: 'MDRT Member & LIC Chairman\'s Club awardee Ajay Kumar Poddar. Expert in life, health & wealth planning for families in Gorakhpur and eastern UP since 1994.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poddar Wealth Management — Trusted Insurance Advisory',
    description: 'MDRT Member Ajay Kumar Poddar. LIC, health & wealth planning for Gorakhpur families since 1994.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Poddar Wealth Management',
  founder: 'Ajay Kumar Poddar',
  foundingDate: '1994',
  url: 'https://www.poddarwealth.com',
  telephone: '+919415313434',
  email: 'poddarwealth@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'AD Mall Compound, Vijay Chowk',
    addressLocality: 'Gorakhpur',
    addressRegion: 'Uttar Pradesh',
    postalCode: '273001',
    addressCountry: 'IN',
  },
  areaServed: 'Gorakhpur, Eastern Uttar Pradesh',
  description: 'Life insurance, health insurance, and wealth planning by MDRT Member Ajay Kumar Poddar since 1994.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans text-13 text-gray-900 bg-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {/* ── Google Analytics 4 ── */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}

        <LangProvider>
          <ProblemSolutionSection />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AIChatButton />
          <WhatsAppButton />
          <LeadPopup />
        </LangProvider>
      </body>
    </html>
  )
}
