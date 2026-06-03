import type { Metadata } from 'next'

const title = "Term Life Insurance — Maximum Protection at Lowest Cost | Poddar Wealth"
const description = "Protect your family's financial future with high-cover term life insurance. Compare LIC Tech Term vs e-Term options in Gorakhpur with Ajay Kumar Poddar."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
