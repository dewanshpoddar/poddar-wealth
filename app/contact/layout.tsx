import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Poddar Wealth — Free Insurance Consultation Gorakhpur',
  description: 'Book a free consultation with Ajay Kumar Poddar. Visit AD Mall Compound, Vijay Chowk, Gorakhpur or call 9415313434.',
  openGraph: {
    title: 'Contact Poddar Wealth — Free Insurance Consultation Gorakhpur',
    description: 'Book a free consultation with Ajay Kumar Poddar. Visit AD Mall Compound, Vijay Chowk, Gorakhpur or call 9415313434.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
