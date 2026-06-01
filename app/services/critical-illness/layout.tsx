import type { Metadata } from 'next'

const title = "Critical Illness Insurance — Lump Sum Cover | Poddar Wealth"
const description = "Get lump sum payout for cancer, heart attack, stroke and 30+ critical illnesses. Gorakhpur insurance advisor Ajay Kumar Poddar."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
