import type { Metadata } from 'next'

const title = "Bima Sugam Portal 2026 — Complete Guide | Poddar Wealth Management"
const description = "What is Bima Sugam? IRDAI's digital insurance marketplace explained simply in Hindi & English. Compare plans, buy online. Guide by Ajay Kumar Poddar, Gorakhpur."

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
