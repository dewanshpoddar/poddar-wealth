import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Life Insurance Calculator — How Much Cover Do You Need?',
  description: 'Calculate your ideal life insurance cover based on income, loans, and family needs. Free tool by Poddar Wealth Management.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
