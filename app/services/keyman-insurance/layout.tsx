import type { Metadata } from 'next'

const title = "Keyman Insurance — Protect Your Business | Poddar Wealth"
const description = "Protect your business from loss of key employees with keyman insurance. Expert guidance by Ajay Kumar Poddar, Gorakhpur."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
