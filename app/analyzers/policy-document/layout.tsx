import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Policy Analyzer - Understand Your LIC Policy | Poddar Wealth',
  description: 'Upload your LIC policy PDF and get an instant AI-powered summary. Free tool by Ajay Kumar Poddar, MDRT Member.',
  openGraph: {
    title: 'AI Policy Analyzer - Understand Your LIC Policy | Poddar Wealth',
    description: 'Upload your LIC policy PDF and get an instant AI-powered summary. Free tool by Ajay Kumar Poddar, MDRT Member.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
