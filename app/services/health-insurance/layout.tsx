import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Health Insurance Solutions — Star Health Plans | Poddar Wealth',
  description: 'Cashless health insurance for your family with Star Health. Family floaters, critical illness, senior citizen plans. Expert advisory by Ajay Kumar Poddar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
