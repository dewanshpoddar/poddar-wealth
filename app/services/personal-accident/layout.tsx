import type { Metadata } from 'next'

const title = "Personal Accident Insurance — Complete Protection | Poddar Wealth"
const description = "Protect your family's income against accidental death, disability, and medical bills in Gorakhpur. Learn about LIC and Star Health options."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
