import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retirement Calculator - Plan Your Financial Freedom',
  description: 'Calculate how much you need to retire comfortably. Factor in inflation, expenses, and pension income.',
  openGraph: {
    title: 'Retirement Calculator - Plan Your Financial Freedom',
    description: 'Calculate how much you need to retire comfortably. Factor in inflation, expenses, and pension income.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
