'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false })

declare function gtag(...args: unknown[]): void

export default function ClientOnlyBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    const consent = cookies.find(c => c.startsWith('poddar-wealth-consent='))
    if (consent) {
      // Returning visitor — restore GA4 consent without loading the library
      if (consent.includes('=true') && typeof gtag !== 'undefined') {
        gtag('consent', 'update', { analytics_storage: 'granted' })
      }
    } else {
      setShow(true)
    }
  }, [])

  if (!show) return null
  return <CookieBanner />
}
