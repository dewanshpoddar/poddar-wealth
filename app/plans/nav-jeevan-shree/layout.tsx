import type { Metadata } from 'next'

const title = "LIC Nav Jeevan Shree Plan 2026 - Features, Benefits, Premium | Poddar Wealth"
const description = "Complete guide to LIC's new Nav Jeevan Shree savings plan. Features, benefits, critical illness rider. Expert advice by MDRT advisor Ajay Kumar Poddar, Gorakhpur."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
