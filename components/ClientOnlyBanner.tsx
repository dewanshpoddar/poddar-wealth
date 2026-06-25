'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false })

declare function gtag(...args: unknown[]): void

export default function ClientOnlyBanner() {
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const consent = cookies.find(c => c.startsWith('poddar-wealth-consent='))
    if (consent) {
      // Returning visitor - restore GA4 consent without loading the library
      if (consent.includes('=true') && typeof gtag !== 'undefined') {
        gtag('consent', 'update', { analytics_storage: 'granted' })
      }
    } else {
      setShow(true)
    }
  }, [])

  if (pathname?.startsWith('/lp/')) return null
  if (!show || !ready) return null
  return <CookieBanner />
}
