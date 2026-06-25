import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LIC Premium Calculator - Calculate Your Insurance Premium Online',
  description: 'Free LIC premium calculator. Get instant premium quotes for all LIC plans based on your age, sum assured, and policy term.',
  openGraph: {
    title: 'LIC Premium Calculator - Calculate Your Insurance Premium Online',
    description: 'Free LIC premium calculator. Get instant premium quotes for all LIC plans based on your age, sum assured, and policy term.',
    url: 'https://www.poddarwealth.com/calculators/premium',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIC Premium Calculator - Calculate Your Insurance Premium Online',
    description: 'Free LIC premium calculator. Get instant premium quotes for all LIC plans based on your age, sum assured, and policy term.',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
