import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Poddar Wealth Management',
  description: 'How Poddar Wealth Management collects, uses, and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy — Poddar Wealth Management',
    description: 'How Poddar Wealth Management collects, uses, and protects your personal information.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
