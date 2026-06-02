import type { Metadata } from 'next'
import AreaServicePageClient from './AreaServicePageClient'

const AREAS = [
  { slug: 'golghar', name: 'Golghar', nameHi: 'गोलघर' },
  { slug: 'shahpur', name: 'Shahpur', nameHi: 'शाहपुर' },
  { slug: 'padrauna', name: 'Padrauna', nameHi: 'पडरौना' },
  { slug: 'deoria', name: 'Deoria', nameHi: 'देवरिया' },
  { slug: 'kushinagar', name: 'Kushinagar', nameHi: 'कुशीनगर' },
]

export function generateStaticParams() {
  return AREAS.map((area) => ({
    area: area.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params
  const areaData = AREAS.find((a) => a.slug === area) || AREAS[0]
  
  const title = `Best LIC Agent in ${areaData.name}, Gorakhpur — Poddar Wealth`
  const description = `Looking for a trusted LIC insurance advisor in ${areaData.name}? Ajay Kumar Poddar, MDRT member, 31 years experience. Call 9415313434.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default function AreaServicePage({ params }: { params: Promise<{ area: string }> }) {
  return <AreaServicePageClient params={params} />
}
