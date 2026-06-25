import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Poddar Wealth Management',
  description: 'Terms and conditions for using the Poddar Wealth Management website and services.',
  openGraph: {
    title: 'Terms of Service - Poddar Wealth Management',
    description: 'Terms and conditions for using the Poddar Wealth Management website and services.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
