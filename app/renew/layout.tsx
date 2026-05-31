import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Renew Insurance Policy — Poddar Wealth Management',
  description: 'Renew your LIC or health insurance policy with Poddar Wealth. We track your renewal dates and remind you before they lapse.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
