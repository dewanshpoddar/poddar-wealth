import type { Metadata } from 'next'
import { ADVISOR_PHONE } from '@/lib/constants'

const description = `Book a free consultation with Ajay Kumar Poddar. Visit AD Mall Compound, Vijay Chowk, Gorakhpur or call ${ADVISOR_PHONE}.`

export const metadata: Metadata = {
  title: 'Contact Poddar Wealth — Free Insurance Consultation Gorakhpur',
  description,
  openGraph: {
    title: 'Contact Poddar Wealth — Free Insurance Consultation Gorakhpur',
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
