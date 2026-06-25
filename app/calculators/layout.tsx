import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Insurance Calculators — Poddar Wealth Management',
  description: 'Free LIC premium, maturity, surrender value, retirement, and policy health calculators. Powered by 31 years of advisory experience.',
  openGraph: {
    title: 'Free Insurance Calculators — Poddar Wealth Management',
    description: 'Free LIC premium, maturity, surrender value, retirement, and policy health calculators.',
    url: 'https://www.poddarwealth.com/calculators',
  },
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Poddar Wealth Insurance Calculators',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  provider: {
    '@type': 'Organization',
    name: 'Poddar Wealth Management',
    url: 'https://www.poddarwealth.com',
  },
  description: 'Free online calculators for LIC premium, maturity value, surrender value, retirement corpus, loan against policy, and AI-powered policy health score.',
  featureList: [
    'LIC Premium Calculator',
    'Maturity Value Calculator',
    'Surrender Value Calculator',
    'Retirement Corpus Planner',
    'Loan Against Policy Calculator',
    'Policy Health Score (AI)',
    'Life Insurance Need Calculator',
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {children}
    </>
  )
}
