import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insurance Insights & Guides — Poddar Wealth Blog',
  description: 'Expert articles on LIC plans, health insurance, tax saving, and wealth planning by Ajay Kumar Poddar.',
  openGraph: {
    title: 'Insurance Insights & Guides — Poddar Wealth Blog',
    description: 'Read expert insights, guides, and practical advice on LIC plans, health insurance, and tax savings by Ajay Kumar Poddar.',
    url: 'https://www.poddarwealth.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Insights & Guides — Poddar Wealth Blog',
    description: 'Expert articles on LIC plans, health insurance, tax saving, and wealth planning by Ajay Kumar Poddar.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
