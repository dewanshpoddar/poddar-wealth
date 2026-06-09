import React from 'react'

export const metadata = {
  title: 'Poddar Wealth Campaigns',
  robots: 'noindex, nofollow',
}

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 antialiased selection:bg-amber-500 selection:text-white">
      {children}
    </div>
  )
}
