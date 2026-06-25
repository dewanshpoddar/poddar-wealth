import type { Metadata } from 'next'

const title = "MyLIC App Help - Download, Register, Pay Premium | Poddar Wealth"
const description = "Step-by-step guide: download MyLIC app, register, pay premium, check policy status. Common problems solved. Help by MDRT advisor Ajay Kumar Poddar, Gorakhpur."

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
