import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/lib/LangContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ChatBot from '@/components/ChatBot'

export const metadata: Metadata = {
  title: 'Poddar Wealth Management — Excellence in Service Since 1994',
  description: 'Insurance advisory by Ajay Kumar Poddar. 31+ years experience, MDRT member, Chairman\'s Club awardee. Life, Health, Retirement & Child Planning. Gorakhpur, UP.',
  keywords: 'insurance advisor Gorakhpur, LIC agent Gorakhpur, Ajay Kumar Poddar, MDRT advisor India, Star Health insurance, term insurance, health insurance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-13 text-gray-900 bg-white antialiased">
        <LangProvider>
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
