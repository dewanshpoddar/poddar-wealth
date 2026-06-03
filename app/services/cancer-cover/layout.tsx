import type { Metadata } from 'next'

const title = "Cancer Insurance — Early Detection Saves Lives & Money | Poddar Wealth"
const description = "Dedicated cancer-only insurance protection with lump sum payouts for early and major stages. Compare plans in Gorakhpur with Ajay Kumar Poddar."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
