import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Poddar Wealth Management',
  description: 'Common questions about LIC plans, health insurance, claims process, and working with Poddar Wealth Management.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
