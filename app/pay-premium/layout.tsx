import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pay LIC Premium Online — Poddar Wealth Management',
  description: 'Pay your LIC premium quickly. We help track your payments and remind you before due dates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
