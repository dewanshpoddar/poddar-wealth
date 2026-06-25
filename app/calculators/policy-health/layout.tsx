import type { Metadata } from 'next'

const title = "Policy Health Score - Is Your Insurance Enough? | Poddar Wealth"
const description = "Get a free health score for your insurance portfolio. Find out if you're underinsured, overinsured, or just right."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
