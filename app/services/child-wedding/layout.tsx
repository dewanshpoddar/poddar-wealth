import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: "Daughter's Wedding Fund Planning - LIC Marriage Plans | Poddar Wealth",
  description: "Secure your daughter's future wedding fund with guaranteed savings plans. Protect the goal with premium waiver benefits and ensure tax-free payouts.",
  openGraph: {
    title: "Daughter's Wedding Fund Planning - LIC Marriage Plans | Poddar Wealth",
    description: "Secure your daughter's future wedding fund with guaranteed savings plans. Protect the goal with premium waiver benefits and ensure tax-free payouts.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    "Daughter's Wedding Fund Planning",
    'https://www.poddarwealth.com/services/child-wedding'
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
