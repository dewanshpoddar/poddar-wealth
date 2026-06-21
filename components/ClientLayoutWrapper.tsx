'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProblemSolutionSection from '@/components/ProblemSolutionSection'
import ClientFloats from '@/components/ClientFloats'
import ClientOnlyBanner from '@/components/ClientOnlyBanner'
import { LangProvider } from '@/lib/LangContext'

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = pathname?.startsWith('/admin') || pathname === '/login'

  if (hideChrome) {
    return <LangProvider>{children}</LangProvider>
  }

  return (
    <LangProvider>
      <ProblemSolutionSection />
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <ClientFloats />
      <ClientOnlyBanner />
    </LangProvider>
  )
}
