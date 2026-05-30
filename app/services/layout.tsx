import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insurance Services — Life, Health, Tax Planning, Retirement',
  description: 'Complete insurance services: life protection, health coverage, tax saving under 80C/80D, child planning, retirement income, and keyman insurance.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
