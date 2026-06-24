'use client'

import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'

interface CalculatorCTAProps {
  serviceLink: string
  serviceLabelEn: string
  serviceLabelHi: string
  whatsappMessage: string
  secondaryLabelEn?: string
  secondaryLabelHi?: string
}

export default function CalculatorCTA({
  serviceLink,
  serviceLabelEn,
  serviceLabelHi,
  whatsappMessage,
  secondaryLabelEn,
  secondaryLabelHi
}: CalculatorCTAProps) {
  const { lang } = useLang()

  const heading = lang === 'hi' ? '💡 इस पर एक्सपर्ट सलाह चाहिए?' : '💡 Need expert guidance on this?'
  const desc = lang === 'hi'
    ? 'अजय सर (31 वर्षों का अनुभव) से अपने परिवार के लिए सबसे बेहतरीन प्लान के बारे में बात करें।'
    : 'Talk to Ajay sir (31 years experience) about the best plan for your situation. It\'s free and won\'t take long.'
  const primaryLabel = lang === 'hi' ? serviceLabelHi : serviceLabelEn
  const secondaryLabel = lang === 'hi' 
    ? (secondaryLabelHi || 'अजय सर से WhatsApp पर बात करें') 
    : (secondaryLabelEn || 'WhatsApp Ajay sir')

  const whatsappUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 mt-6 space-y-4 text-left">
      <div className="space-y-1">
        <h4 className="font-display font-bold text-navy text-base">{heading}</h4>
        <p className="text-xs text-gray-600 leading-relaxed font-medium">{desc}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <Link
          href={serviceLink}
          className="flex-1 inline-flex h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <span>{primaryLabel}</span>
          <ArrowRight size={14} />
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <MessageCircle size={15} />
          <span>{secondaryLabel}</span>
        </a>
      </div>
    </div>
  )
}
