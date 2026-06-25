import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQs - Poddar Wealth Management',
  description: 'Common questions about LIC plans, health insurance, claims process, and working with Poddar Wealth Management.',
  openGraph: {
    title: 'FAQs - Poddar Wealth Management',
    description: 'Clear and honest answers to frequently asked questions about LIC policies, Star Health, and claims.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
