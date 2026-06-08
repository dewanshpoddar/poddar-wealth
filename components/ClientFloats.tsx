'use client'

import dynamic from 'next/dynamic'
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

  if (pathname?.startsWith('/lp/')) return null

  return (
    <>
      <AIChatButton />
      <MobileCTABar />
      <WhatsAppButton />
      <LeadPopup />
      <ExitIntentPopup />
    </>
  )
}
