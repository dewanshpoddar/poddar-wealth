import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LIC Maturity Calculator 2026 - Estimate Your Returns | Poddar Wealth',
  description: 'Calculate estimated maturity amount for any LIC plan. Includes bonus calculation. Free tool by Ajay Kumar Poddar.',
  openGraph: {
    title: 'LIC Maturity Calculator 2026 - Estimate Your Returns | Poddar Wealth',
    description: 'Calculate estimated maturity amount for any LIC plan. Includes bonus calculation. Free tool by Ajay Kumar Poddar.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
