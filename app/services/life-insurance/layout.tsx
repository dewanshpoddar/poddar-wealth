import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Life Insurance Plans — Term & Endowment | Poddar Wealth Management',
  description: 'Protect your family with LIC term and endowment plans. Expert guidance by MDRT Member Ajay Kumar Poddar. Income replacement, loan coverage, tax saving.',
  openGraph: {
    title: 'Life Insurance Plans — Term & Endowment | Poddar Wealth Management',
    description: 'Protect your family with LIC term and endowment plans. Expert guidance by MDRT Member Ajay Kumar Poddar. Income replacement, loan coverage, tax saving.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
