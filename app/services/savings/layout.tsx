import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Savings & Wealth Creation - Child Education, Retirement & Tax Save | Poddar Wealth',
  description: 'Build wealth and guarantee cash flows for key life milestones. Plan for your child\'s education, secure your retirement, save on taxes, and grow capital.',
  openGraph: {
    title: 'Savings & Wealth Creation - Child Education, Retirement & Tax Save | Poddar Wealth',
    description: 'Build wealth and guarantee cash flows for key life milestones. Plan for your child\'s education, secure your retirement, save on taxes, and grow capital.',
    url: 'https://www.poddarwealth.com/services/savings',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savings & Wealth Creation - Child Education, Retirement & Tax Save | Poddar Wealth',
    description: 'Build wealth and guarantee cash flows for key life milestones. Plan for your child\'s education, secure your retirement, save on taxes, and grow capital.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
