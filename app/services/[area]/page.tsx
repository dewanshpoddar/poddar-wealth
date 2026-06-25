import type { Metadata } from 'next'
import AreaServicePageClient from './AreaServicePageClient'
import { ADVISOR_PHONE } from '@/lib/constants'
import { AREAS } from '@/lib/data/areas'
import { getAreaServiceSchema } from '@/lib/schema'

export function generateStaticParams() {
  return AREAS.map((area) => ({
    area: area.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params
  const areaData = AREAS.find((a) => a.slug === area) || AREAS[0]

  const title = `Best LIC Agent in ${areaData.name} - Poddar Wealth Management`
  const description = areaData.description
    ? `${areaData.description} Trusted LIC advisor Ajay Kumar Poddar, MDRT member with 31 years experience. Call ${ADVISOR_PHONE}.`
    : `Looking for a trusted LIC insurance advisor in ${areaData.name}? Ajay Kumar Poddar, MDRT member, 31 years experience. Call ${ADVISOR_PHONE}.`

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function AreaServicePage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = AREAS.find((a) => a.slug === area) || AREAS[0]
  const schema = getAreaServiceSchema(
    `Life Insurance Advisory in ${areaData.name}`,
    `https://www.poddarwealth.com/services/${areaData.slug}`,
    areaData.name,
  )
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AreaServicePageClient params={params} />
    </>
  )
}
