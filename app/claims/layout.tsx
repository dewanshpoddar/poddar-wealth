import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claim Support — Step-by-Step Insurance Claim Process',
  description: 'File your insurance claim with expert guidance. Documents checklist, step-by-step process, and direct support from Ajay Kumar Poddar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
