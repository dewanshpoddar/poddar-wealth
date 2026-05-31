import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tax Saving with Insurance — Section 80C & 80D | Poddar Wealth',
  description: 'Save tax with insurance under Section 80C (up to ₹1.5L) and 80D (health premium). Tax-free maturity under 10(10D). Expert guidance by Ajay Poddar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
