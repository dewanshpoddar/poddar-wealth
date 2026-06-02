import type { Metadata } from 'next'
import BestPlanAgeClient from './BestPlanAgeClient'

const AGE_GROUPS = [
  { slug: '25', label: '25', labelHi: '25', range: '22-28' },
  { slug: '30', label: '30', labelHi: '30', range: '28-32' },
  { slug: '35', label: '35', labelHi: '35', range: '32-38' },
  { slug: '40', label: '40', labelHi: '40', range: '38-42' },
  { slug: '45', label: '45', labelHi: '45', range: '42-48' },
  { slug: '50', label: '50', labelHi: '50', range: '48-55' },
]

export function generateStaticParams() {
  return AGE_GROUPS.map((group) => ({
    age: group.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ age: string }> }): Promise<Metadata> {
  const { age } = await params
  const group = AGE_GROUPS.find((g) => g.slug === age) || AGE_GROUPS[1] // default to 30 if not found
  
  const title = `Best Insurance Plan for Age ${group.label} — 2026 Guide | Poddar Wealth`
  const description = `Find the best LIC and health insurance plans for age ${group.label}. Expert recommendations by MDRT advisor Ajay Kumar Poddar, Gorakhpur.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default function BestPlanAgePage({ params }: { params: Promise<{ age: string }> }) {
  return <BestPlanAgeClient params={params} />
}
