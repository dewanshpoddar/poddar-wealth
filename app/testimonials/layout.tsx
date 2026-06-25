import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Client Testimonials - Poddar Wealth Management",
  description: "Read what 5000+ families say about Ajay Kumar Poddar's insurance advisory services. Real stories from Gorakhpur and beyond.",
  openGraph: {
    title: "Client Testimonials - Poddar Wealth Management",
    description: "Read what 5000+ families say about Ajay Kumar Poddar's insurance advisory services. Real stories from Gorakhpur and beyond.",
  },
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
