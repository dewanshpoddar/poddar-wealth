import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Ajay Kumar Poddar — Insurance Advisor Since 1994',
  description: 'Meet Ajay Kumar Poddar — MDRT Member, LIC Chairman\'s Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.',
  openGraph: {
    title: 'About Ajay Kumar Poddar — Insurance Advisor Since 1994',
    description: 'Meet Ajay Kumar Poddar — MDRT Member, LIC Chairman\'s Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.',
    url: 'https://www.poddarwealth.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Ajay Kumar Poddar — Insurance Advisor Since 1994',
    description: 'Meet Ajay Kumar Poddar — MDRT Member, LIC Chairman\'s Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
