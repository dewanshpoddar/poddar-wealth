import type { Metadata } from 'next'

const title = "Free Insurance Quiz - Which Plan Do You Need? | Poddar Wealth"
const description = "2-minute quiz to find the right insurance for your life stage. Expert guidance by MDRT advisor Ajay Kumar Poddar, Gorakhpur."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
