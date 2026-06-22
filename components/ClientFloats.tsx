'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MobileCTABar } from '@/src/features/ai-agent'
import WhatsAppButton from '@/components/WhatsAppButton'

// Defer heavy components (framer-motion) until after first paint
const AIChatButton = dynamic(
  () => import('@/src/features/ai-agent').then(m => ({ default: m.AIChatButton })),
  { ssr: false }
)
const LeadPopup = dynamic(() => import('@/components/LeadPopup'), { ssr: false })
const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), { ssr: false })

export default function ClientFloats() {
  const pathname = usePathname()
  const [renderDeferred, setRenderDeferred] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderDeferred(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  if (pathname?.startsWith('/lp/')) return null

  return (
    <>
      <AIChatButton />
      <MobileCTABar />
      <WhatsAppButton />
      {renderDeferred && (
        <>
          <LeadPopup />
          <ExitIntentPopup />
        </>
      )}
    </>
  )
}
