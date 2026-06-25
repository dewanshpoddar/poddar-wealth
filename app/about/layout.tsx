import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Ajay Kumar Poddar — Insurance Advisor Since 1994',
  description: "Meet Ajay Kumar Poddar — MDRT USA Member, LIC Chairman's Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.",
  openGraph: {
    title: 'About Ajay Kumar Poddar — Insurance Advisor Since 1994',
    description: "Meet Ajay Kumar Poddar — MDRT USA Member, LIC Chairman's Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.",
    url: 'https://www.poddarwealth.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Ajay Kumar Poddar — Insurance Advisor Since 1994',
    description: "Meet Ajay Kumar Poddar — MDRT USA Member, LIC Chairman's Club awardee. Serving Gorakhpur families since 1994 with life insurance and wealth planning.",
  }
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ajay Kumar Poddar',
  jobTitle: 'Chief Life Insurance Advisor',
  worksFor: { '@type': 'Organization', name: 'Poddar Wealth Management' },
  url: 'https://www.poddarwealth.com/about',
  telephone: '+919415313434',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'AD Mall Compound, Vijay Chowk',
    addressLocality: 'Gorakhpur',
    addressRegion: 'Uttar Pradesh',
    postalCode: '273001',
    addressCountry: 'IN',
  },
  knowsAbout: ['Life Insurance', 'Health Insurance', 'Wealth Planning', 'Retirement Planning', 'LIC Policies'],
  award: ['MDRT USA Member', "LIC Chairman's Club Awardee"],
  description: "Ajay Kumar Poddar is an MDRT USA Member and LIC Chairman's Club awardee with over 31 years of experience in life insurance and wealth planning, based in Gorakhpur, Uttar Pradesh.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      {children}
    </>
  )
}
