import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

const title = "Cancer Insurance - Early Detection Saves Lives & Money | Poddar Wealth"
const description = "Dedicated cancer-only insurance protection with lump sum payouts for early and major stages. Compare plans in Gorakhpur with Ajay Kumar Poddar."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    'Cancer Cover Insurance',
    'https://www.poddarwealth.com/services/cancer-cover'
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
