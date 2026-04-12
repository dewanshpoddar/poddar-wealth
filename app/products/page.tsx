'use client'

import LicPlans from '@/components/LicPlans'
import { motion } from 'framer-motion'
import { openLeadPopup } from '@/lib/events'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white pt-2 md:pt-3">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-navy/5 to-transparent -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <LicPlans />
      </div>

      {/* Gap between grey container and CTA */}
      <div className="h-8 md:h-12 bg-white" />

      {/* CTA Footer — gold theme */}
      <section
        className="py-20 px-6 text-center relative z-20 rounded-t-[48px] md:rounded-t-[72px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 40%, #b8941f 100%)' }}
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 0%, transparent 60%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <p className="text-11 font-bold tracking-[0.18em] uppercase text-navy/50 mb-3">
            Personal Advisory
          </p>
          <h2 className="text-28 md:text-38 font-display font-bold mb-5 text-navy leading-tight">
            Not sure which plan<br className="hidden md:block" /> is right for you?
          </h2>
          <p className="text-15 text-navy/65 mb-10 leading-relaxed max-w-xl mx-auto">
            Insurance is a long-term commitment. Mr. Ajay Kumar Poddar himself reviews each case to ensure you get the absolute best protection and returns.
          </p>
          <button
            onClick={() => openLeadPopup('General Product Consultation')}
            className="inline-flex items-center gap-2 bg-navy text-white font-bold text-14 h-14 px-10 rounded-full shadow-lg hover:bg-navy/90 active:scale-[0.98] transition-all duration-150"
          >
            Book Free Expert Consultation
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="text-11 text-navy/40 mt-6">No obligation · Free 30-min call · Available 6 days a week</p>
        </motion.div>
      </section>
    </main>
  )
}
