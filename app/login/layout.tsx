import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login — Poddar Wealth Management',
  robots: 'noindex, nofollow',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
