import type { Metadata } from 'next'

const title = "Free LIC Premium Reminder — Never Miss a Payment | Poddar Wealth"
const description = "Get free WhatsApp reminders before your LIC premium due date. Trusted service by Ajay Kumar Poddar, MDRT member, Gorakhpur."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
