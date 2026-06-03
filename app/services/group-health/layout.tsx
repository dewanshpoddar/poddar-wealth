import type { Metadata } from 'next'

const title = "Group Health Insurance for Companies & Families | Poddar Wealth"
const description = "Employer-provided group medical benefits and family floater health plans. Check room rent, copay and no-claim bonuses with Ajay Kumar Poddar."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
