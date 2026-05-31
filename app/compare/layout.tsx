import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare LIC Plans Side by Side — Poddar Wealth',
  description: 'Compare 2-3 LIC insurance plans side by side. See premiums, maturity benefits, death benefits, and features at a glance. Free tool by Poddar Wealth.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
