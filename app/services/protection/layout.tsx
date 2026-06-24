import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protection Solutions — Term Life, Critical Illness & Personal Accident | Poddar Wealth',
  description: 'Secure your family\'s future with pure protection policies including term life insurance, personal accident cover, critical illness protection, and keyman business insurance.',
  openGraph: {
    title: 'Protection Solutions — Term Life, Critical Illness & Personal Accident | Poddar Wealth',
    description: 'Secure your family\'s future with pure protection policies including term life insurance, personal accident cover, critical illness protection, and keyman business insurance.',
    url: 'https://www.poddarwealth.com/services/protection',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protection Solutions — Term Life, Critical Illness & Personal Accident | Poddar Wealth',
    description: 'Secure your family\'s future with pure protection policies including term life insurance, personal accident cover, critical illness protection, and keyman business insurance.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
