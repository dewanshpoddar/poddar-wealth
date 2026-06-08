'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { openLeadPopup } from '@/lib/events'

// Dynamic import with skeleton fallback
const LicPlans = dynamic(() => import('@/src/features/lic-plans').then(mod => mod.LicPlans), {
  ssr: false,
  loading: () => <ProductsSkeleton />
})

function ProductsSkeleton() {
  return (
    <section className="bg-[#f5f6fa] rounded-b-[40px] md:rounded-b-[60px] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 animate-pulse">
        {/* Header Hero Skeleton */}
        <div className="rounded-3xl bg-gray-200 mb-6 h-[260px]" />
        
        {/* Sidebar + Grid */}
        <div className="flex gap-6 items-start pb-12 md:pb-16">
          {/* Sidebar Skeleton */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-lg w-full" />
              ))}
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4 overflow-hidden h-[340px]">
                  {/* Category header skeleton */}
                  <div className="h-16 -mx-4 -mt-4 bg-gray-200" />
                  
                  {/* Badge + Title skeleton */}
                  <div className="space-y-2 mt-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  
                  {/* Key advantage box skeleton */}
                  <div className="h-14 bg-gray-200 rounded-xl p-3 border border-gray-200 space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                  
                  {/* Footer button skeleton */}
                  <div className="mt-auto space-y-2">
                    <div className="h-10 bg-gray-200 rounded-xl w-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

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
        className="py-12 md:py-14 px-6 text-center relative z-20 rounded-t-[48px] md:rounded-t-[72px] overflow-hidden"
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
          <p className="text-10 font-bold tracking-[0.18em] uppercase text-navy/45 mb-2">
            Personal Advisory
          </p>
          <h2 className="text-24 md:text-32 font-display font-bold mb-3 text-navy leading-tight">
            Not sure which plan is right for you?
          </h2>
          <p className="text-14 text-navy/60 mb-7 leading-relaxed max-w-lg mx-auto">
            Insurance is a long-term commitment. Mr. Ajay Kumar Poddar himself reviews each case to ensure you get the absolute best protection and returns.
          </p>
          <button
            onClick={() => openLeadPopup('General Product Consultation')}
            className="inline-flex items-center gap-2 bg-navy text-white font-bold text-14 h-14 px-10 rounded-full shadow-lg hover:bg-navy/90 active:scale-[0.98] transition-all duration-150"
          >
            Book Free Expert Consultation
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="text-11 text-navy/40 mt-5">No obligation · Free 30-min call · Available 6 days a week</p>
        </motion.div>
      </section>
    </main>
  )
}
