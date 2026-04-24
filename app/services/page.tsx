'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'

import { motion } from 'framer-motion'

export default function ServicesPage() {
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-white">

      
      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 border border-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="pw-eyebrow text-gold/80 mb-4">{t.services.eyebrow}</div>
          <h1 className="text-[40px] md:text-[56px] font-display font-bold text-white italic leading-tight mb-6">
            Comprehensive Protection <span className="text-gold">For Everything You Value</span>
          </h1>
          <p className="text-white/60 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {t.services.items.map((svc: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-gold/10 hover:border-gold/30 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
            >
              {svc.badge && (
                <div className="absolute top-0 right-0 py-1.5 px-4 bg-gold text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-xl shadow-lg z-20">
                  {svc.badge}
                </div>
              )}

              <div className="w-16 h-16 rounded-2xl bg-warm flex items-center justify-center text-3xl mb-8 group-hover:bg-gold/10 transition-colors">
                {svc.icon}
              </div>
              
              <h3 className="text-[20px] font-bold text-navy mb-4 group-hover:text-gold transition-colors tracking-tight">
                {svc.title}
              </h3>
              
              <p className="text-[14px] text-muted leading-relaxed mb-8">
                {svc.desc}
              </p>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-navy/5 text-[10px] font-bold text-navy uppercase tracking-widest border border-navy/5 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-300">
                  {svc.tag}
                </span>
                
                <Link
                  href={svc.href || '#'}
                  className="flex items-center gap-2 text-13 font-bold text-navy hover:text-gold transition-colors"
                >
                  Details 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-warm/30 text-center px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-navy mb-4">Not sure which plan fits you?</h2>
          <p className="text-muted mb-8 italic text-14">Ajay sir personally reviews every profile to suggest the most optimal protection.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="pw-btn pw-btn--gold">Book Free Review</Link>
            <a href="tel:9415313434" className="pw-btn pw-btn--navy">Call 9415313434</a>
          </div>
        </div>
      </section>
    </div>
  )
}


