'use client'

import LicPlans from '@/components/LicPlans'
import { motion } from 'framer-motion'
import { openLeadPopup } from '@/lib/events'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-navy/5 to-transparent -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <LicPlans />
      </div>

      {/* CTA Footer for Products */}
      <section className="py-20 px-6 bg-navy text-white text-center rounded-t-[40px] md:rounded-t-[80px] shadow-2xl mt-[-40px] md:mt-[-80px] relative z-20">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-3xl mx-auto"
         >
           <h2 className="text-28 md:text-36 font-display font-bold mb-6">
             Not sure which plan is right for you?
           </h2>
           <p className="text-15 text-white/70 mb-10 leading-relaxed">
             Insurance is a long-term commitment. Mr. Ajay Kumar Poddar himself reviews each case to ensure you get the absolute best protection and returns.
           </p>
           <button 
             onClick={() => openLeadPopup('General Product Consultation')}
             className="pw-btn--gold h-14 px-10 text-15"
           >
             Book Free Expert Consultation
           </button>
         </motion.div>
      </section>
    </main>
  )
}
