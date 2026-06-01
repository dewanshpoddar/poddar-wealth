import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '26+ LIC & Star Health Insurance Plans — Compare & Choose',
  description: 'Explore 26+ premium insurance plans from LIC of India and Star Health. Term, endowment, ULIP, health, pension, and child plans with expert guidance.',
  openGraph: {
    title: '26+ LIC & Star Health Insurance Plans — Compare & Choose',
    description: 'Explore 26+ premium insurance plans from LIC of India and Star Health. Term, endowment, ULIP, health, pension, and child plans with expert guidance.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
