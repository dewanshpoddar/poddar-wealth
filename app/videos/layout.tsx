import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insurance Video Guides | Poddar Wealth',
  description: "Watch expert video guides on life insurance, health insurance, and wealth planning by Ajay Kumar Poddar (MDRT Member & Chairman's Club awardee).",
  keywords: 'insurance videos, lic guides, star health reviews, wealth planning tutorials, ajay poddar video',
  openGraph: {
    title: 'Insurance Video Guides | Poddar Wealth',
    description: "Watch expert video guides on life insurance, health insurance, and wealth planning by Ajay Kumar Poddar (MDRT Member & Chairman's Club awardee).",
    url: 'https://poddarwealth.com/videos',
    type: 'website',
  }
}

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
