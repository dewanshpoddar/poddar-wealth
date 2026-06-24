import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Health Insurance Protection — Star Health floater & Cancer Cover | Poddar Wealth',
  description: 'Protect your family from medical inflation with comprehensive health covers, cancer protection plans, and group health insurance policies.',
  openGraph: {
    title: 'Health Insurance Protection — Star Health floater & Cancer Cover | Poddar Wealth',
    description: 'Protect your family from medical inflation with comprehensive health covers, cancer protection plans, and group health insurance policies.',
    url: 'https://www.poddarwealth.com/services/health',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health Insurance Protection — Star Health floater & Cancer Cover | Poddar Wealth',
    description: 'Protect your family from medical inflation with comprehensive health covers, cancer protection plans, and group health insurance policies.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
