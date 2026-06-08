import type { Metadata } from 'next'
import { getServiceSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Child Education & Future Planning — LIC Child Plans | Poddar Wealth',
  description: 'Secure your child\'s education and marriage with LIC child plans. Waiver of premium benefit ensures the goal is met even if something happens to the parent.',
  openGraph: {
    title: 'Child Education & Future Planning — LIC Child Plans | Poddar Wealth',
    description: 'Secure your child\'s education and marriage with LIC child plans. Waiver of premium benefit ensures the goal is met even if something happens to the parent.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = getServiceSchema(
    'Child Education Planning',
    'https://www.poddarwealth.com/services/child-planning'
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
