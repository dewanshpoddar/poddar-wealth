import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insurance Insights & Guides — Poddar Wealth Blog',
  description: 'Expert articles on LIC plans, health insurance, tax saving, and wealth planning by Ajay Kumar Poddar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
