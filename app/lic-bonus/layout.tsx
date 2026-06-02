import type { Metadata } from 'next'

const title = "LIC Bonus Rates 2026 — All Plans with Calculator | Poddar Wealth"
const description = "Latest LIC bonus rates for Jeevan Anand, Jeevan Labh, Jeevan Umang and all plans. Calculate your maturity amount. MDRT advisor Ajay Kumar Poddar, Gorakhpur."

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
