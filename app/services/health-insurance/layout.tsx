import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Health Insurance Solutions - Star Health Plans | Poddar Wealth',
  description: 'Cashless health insurance for your family with Star Health. Family floaters, critical illness, senior citizen plans. Expert advisory by Ajay Kumar Poddar.',
  openGraph: {
    title: 'Health Insurance Solutions - Star Health Plans | Poddar Wealth',
    description: 'Cashless health insurance for your family with Star Health. Family floaters, critical illness, senior citizen plans. Expert advisory by Ajay Kumar Poddar.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    'Health Insurance Advisory',
    'https://www.poddarwealth.com/services/health-insurance'
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
