import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/lib/LangContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ChatBot from '@/components/ChatBot'

import ProblemSolutionSection from '@/components/ProblemSolutionSection'

export const metadata: Metadata = {
  title: 'Poddar Wealth Management — Excellence in Protection Since 1994',
  description: 'India\'s most trusted insurance advisor specializing in LIC, Star Health, and wealth planning by Mr. Ajay Kumar Poddar, MDRT Member & Chairman\'s Club awardee.',
  icons: {
    icon: '/favicon.svg',
  },
  keywords: 'insurance advisor India, LIC agent, Ajay Kumar Poddar wealth, MDRT advisor, Star Health insurance expert, financial planner India',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-13 text-gray-900 bg-white antialiased">
        <LangProvider>
          <ProblemSolutionSection />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <ChatBot />
        </LangProvider>
      </body>
    </html>
  )
}
