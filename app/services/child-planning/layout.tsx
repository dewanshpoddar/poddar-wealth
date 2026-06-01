import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Child Education & Future Planning — LIC Child Plans | Poddar Wealth',
  description: 'Secure your child\'s education and marriage with LIC child plans. Waiver of premium benefit ensures the goal is met even if something happens to the parent.',
  openGraph: {
    title: 'Child Education & Future Planning — LIC Child Plans | Poddar Wealth',
    description: 'Secure your child\'s education and marriage with LIC child plans. Waiver of premium benefit ensures the goal is met even if something happens to the parent.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
