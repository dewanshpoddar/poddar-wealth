import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Ajay Kumar Poddar — MDRT Member, 31 Years Insurance Advisory',
  description: 'Meet Ajay Kumar Poddar — MDRT USA Member, LIC Chairman\'s Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
