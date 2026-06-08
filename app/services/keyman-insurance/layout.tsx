import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

const title = "Keyman Insurance — Protect Your Business | Poddar Wealth"
const description = "Protect your business from loss of key employees with keyman insurance. Expert guidance by Ajay Kumar Poddar, Gorakhpur."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    'Keyman Insurance Advisory',
    'https://www.poddarwealth.com/services/keyman-insurance'
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
