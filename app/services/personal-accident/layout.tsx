import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

const title = "Personal Accident Insurance — Complete Protection | Poddar Wealth"
const description = "Protect your family's income against accidental death, disability, and medical bills in Gorakhpur. Learn about LIC and Star Health options."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    'Personal Accident Insurance',
    'https://www.poddarwealth.com/services/personal-accident'
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
