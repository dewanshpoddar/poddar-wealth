'use client'
import { Phone, MessageCircle } from 'lucide-react'
import { ADVISOR_PHONE } from '@/lib/constants'
import { useLang } from '@/lib/LangContext'
import { trackEvent } from '@/lib/analytics'
import { usePathname } from 'next/navigation'

export default function MobileCTABar() {
  const { t } = useLang()
  const pathname = usePathname()
  const m = t.mobileCTABar || {
    call: 'Call Ajay sir',
    whatsapp: 'WhatsApp',
    whatsappText: 'Hello Ajay sir, I need help with insurance.',
  }

  const PHONE = ADVISOR_PHONE
  const WA_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent(m.whatsappText)}`

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9990] sm:hidden flex h-14 items-stretch bg-gray-900 border-t border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Call */}
      <a
        href={`tel:${PHONE}`}
        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white border-r border-gray-700 hover:bg-gray-800 active:bg-gray-700 transition-colors"
        aria-label={m.call}
        onClick={() => trackEvent('call_clicked', { source_page: pathname, source_component: 'mobile_cta_bar' })}
      >
        <Phone size={15} className="text-amber-400 flex-shrink-0" />
        <span>{m.call}</span>
      </a>

      {/* WhatsApp */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-700 transition-colors"
        aria-label="Chat on WhatsApp"
        onClick={() => trackEvent('whatsapp_clicked', { source_page: pathname, source_component: 'mobile_cta_bar' })}
      >
        <MessageCircle size={16} className="text-[#25D366] flex-shrink-0" />
        <span>{m.whatsapp}</span>
      </a>
    </div>
  )
}
