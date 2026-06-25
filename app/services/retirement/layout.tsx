import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Retirement Income Plans - LIC Pension & Annuity | Poddar Wealth',
  description: 'Secure a guaranteed lifetime pension with LIC Jeevan Shanti and New Jeevan Akshay. Expert retirement planning by MDRT Member Ajay Kumar Poddar.',
  openGraph: {
    title: 'Retirement Income Plans - LIC Pension & Annuity | Poddar Wealth',
    description: 'Secure a guaranteed lifetime pension with LIC Jeevan Shanti and New Jeevan Akshay. Expert retirement planning by MDRT Member Ajay Kumar Poddar.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    'Retirement Planning',
    'https://www.poddarwealth.com/services/retirement'
  )
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  )
}
