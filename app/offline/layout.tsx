import React from 'react'

export const metadata = {
  title: 'Offline - Poddar Wealth Management',
  description: 'You are currently offline. Check your connection or contact Ajay Kumar Poddar directly.',
  robots: 'noindex, nofollow',
}

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
