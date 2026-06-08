import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refer a Friend — Free Policy Review | Poddar Wealth',
  description: 'Share the trust! Refer a friend or family member to Poddar Wealth, and both of you get a comprehensive policy review audit from Ajay Kumar Poddar (MDRT Member).',
  keywords: 'refer a friend, lic advice, policy review, free insurance audit, poddar wealth referral',
  openGraph: {
    title: 'Refer a Friend — Free Policy Review | Poddar Wealth',
    description: 'Share the trust! Refer a friend or family member to Poddar Wealth, and both of you get a comprehensive policy review audit from Ajay Kumar Poddar (MDRT Member).',
    url: 'https://poddarwealth.com/refer',
    type: 'website',
  }
}

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
