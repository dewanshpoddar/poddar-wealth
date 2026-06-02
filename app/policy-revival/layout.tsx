import type { Metadata } from 'next'

const title = "How to Revive Lapsed LIC Policy 2026 — Documents, Cost, Process | Poddar Wealth"
const description = "Complete guide to reviving a lapsed LIC policy. Documents needed, cost calculation, step-by-step process. Help by MDRT advisor Ajay Kumar Poddar, Gorakhpur."

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
