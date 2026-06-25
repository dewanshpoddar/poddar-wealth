import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LIC Policy Loan Calculator - How Much Can You Borrow? | Poddar Wealth',
  description: 'Calculate maximum loan amount against your LIC policy. Free calculator with interest estimation.',
  openGraph: {
    title: 'LIC Policy Loan Calculator - How Much Can You Borrow? | Poddar Wealth',
    description: 'Calculate maximum loan amount against your LIC policy. Free calculator with interest estimation.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
