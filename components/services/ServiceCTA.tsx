'use client'
import { ADVISOR_PHONE } from '@/lib/constants'
import { Star, Phone, MessageSquare } from 'lucide-react'

interface ServiceCTAProps {
  title: string
  subheadline: string
  whatsappPrefill: string
  lang: 'en' | 'hi' | 'bn'
}

export default function ServiceCTA({
  title,
  subheadline,
  whatsappPrefill,
  lang,
}: ServiceCTAProps) {
  const isHi = lang === 'hi'
  const whatsappUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(whatsappPrefill)}`

  return (
    <section className="py-24 bg-[#0f1225] text-white relative overflow-hidden text-center">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 z-10">
        <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-6 max-w-2xl mx-auto tracking-tight">
          {title}
        </h2>
        
        <p className="text-16 md:text-18 text-gray-300 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
          {subheadline}
        </p>

        {/* Dual Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-gold transform hover:-translate-y-0.5 min-h-[48px] text-15"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{isHi ? 'अजय जी से WhatsApp पर बात करें' : 'WhatsApp Ajay Ji'}</span>
          </a>
          
          <a
            href={`tel:${ADVISOR_PHONE}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/5 transform hover:-translate-y-0.5 min-h-[48px] text-15"
          >
            <Phone className="w-4 h-4" />
            <span>
              {isHi ? `कॉल करें: ${ADVISOR_PHONE}` : `Call Now: ${ADVISOR_PHONE}`}
            </span>
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-8 pt-8 border-t border-white/10 text-12 font-bold tracking-wider uppercase text-gray-400">
          <span>MDRT USA Member</span>
          <span className="hidden sm:inline w-1.5 h-1.5 bg-gold rounded-full" />
          <span>5,000+ Families Protected</span>
          <span className="hidden sm:inline w-1.5 h-1.5 bg-gold rounded-full" />
          <span className="flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span>Google Reviews</span>
          </span>
        </div>
      </div>
    </section>
  )
}
