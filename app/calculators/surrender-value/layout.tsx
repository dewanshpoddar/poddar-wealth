import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LIC Surrender Value Calculator 2026 — Free Online | Poddar Wealth',
  description: 'Calculate your LIC policy surrender value instantly. Free calculator for Jeevan Anand, Jeevan Labh and all LIC plans.',
  openGraph: {
    title: 'LIC Surrender Value Calculator 2026 — Free Online | Poddar Wealth',
    description: 'Calculate your LIC policy surrender value instantly. Free calculator for Jeevan Anand, Jeevan Labh and all LIC plans.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
