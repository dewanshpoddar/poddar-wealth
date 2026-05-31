import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claim Support — Step-by-Step Insurance Claim Process',
  description: 'File your insurance claim with expert guidance. Documents checklist, step-by-step process, and direct support from Ajay Kumar Poddar.',
  openGraph: {
    title: 'Claim Support — Step-by-Step Insurance Claim Process',
    description: 'Get professional support and a step-by-step checklist of documents for a fast and hassle-free claim settlement.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
