import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { LangProvider } from '@/lib/LangContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AIChatButton from '@/components/AIChatButton'
import LeadPopup from '@/components/LeadPopup'
import ProblemSolutionSection from '@/components/ProblemSolutionSection'
import WhatsAppButton from '@/components/WhatsAppButton'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

export const metadata: Metadata = {
  title: 'Poddar Wealth Management — Excellence in Protection Since 1994',
  description: 'India\'s most trusted insurance advisor specializing in LIC, Star Health, and wealth planning by Mr. Ajay Kumar Poddar, MDRT Member & Chairman\'s Club awardee.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-13 text-gray-900 bg-white antialiased">
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

        {/* ── Microsoft Clarity ── */}
        {CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
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
