import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retirement Income Plans — LIC Pension & Annuity | Poddar Wealth',
  description: 'Secure a guaranteed lifetime pension with LIC Jeevan Shanti and New Jeevan Akshay. Expert retirement planning by MDRT Member Ajay Kumar Poddar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
