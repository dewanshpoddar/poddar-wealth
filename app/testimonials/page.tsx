'use client'

import React from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { Star, ArrowRight, Quote, Shield } from 'lucide-react'

// Identify gender of each testimonial to apply blue (male) or pink (female) gradients
const GENDER_MAP: Record<string, 'male' | 'female'> = {
  'Sunita Devi': 'female',
  'सुनीता देवी': 'female',
  'Ramesh Gupta': 'male',
  'रमेश गुप्ता': 'male',
  'Alok Srivastava': 'male',
  'आलोक श्रीवास्तव': 'male',
  'Devendra Singh': 'male',
  'देवेंद्र सिंह': 'male',
  'Rahul Verma': 'male',
  'राहुल वर्मा': 'male',
  'Sanjay Agrawal': 'male',
  'संजय अग्रवाल': 'male',
  'Kiran Tripathi': 'female',
  'किरण त्रिपाठी': 'female',
  'Vikram Malhotra': 'male',
  'विक्रम मल्होत्रा': 'male',
  'Sunita Verma': 'female',
  'Rakesh Agarwal': 'male',
  'Priya Sharma': 'female',
  'Mohit Gupta': 'male',
  'Kavita Singh': 'female',
}

export default function TestimonialsPage() {
  const { t, lang } = useLang()

  // Safely fallback if en/hi templates take a second to update in RAM
  const testimonials = t.testimonials || { items: [] }
  const pageT = t.testimonialsPage || {
    heroEyebrow: 'TRUST & VERIFICATION',
    heroTitle: 'What Our Families Say',
    heroSubtitle: 'Real stories of secured futures, matured milestones, and cashless recoveries from families who have trusted Ajay sir since 1994.',
    trustStats: {
      families: '5000+ Families',
      years: '31 Years',
      claims: '₹500Cr+ Claims'
    },
    ctaTitle: 'Join our growing family',
    ctaSubtitle: 'Let Mr. Ajay Kumar Poddar build a financial fortress for your family\'s future.',
    ctaButton: 'Get Started Now'
  }

  const items = testimonials.items || []

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* ═══ HERO SECTION ═══ */}
      <section className="bg-navy py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_40%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            ✨ {pageT.heroEyebrow}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            {pageT.heroTitle}
          </h1>
          <p className="text-white/55 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {pageT.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ═══ TRUST STATS BAR ═══ */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? 'Advisor Credentials' : 'एडवाइज़र की साख'}
              </p>
              <p className="text-sm font-bold text-navy">
                {lang === 'en' ? 'MDRT (USA) & Chairman\'s Club' : 'MDRT (USA) और चेयरमैन क्लब'}
              </p>
            </div>
          </div>

          <div className="flex gap-8 md:gap-16">
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-display font-bold text-navy leading-none">5,000+</p>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{pageT.trustStats.families}</p>
            </div>
            <div className="h-8 w-px bg-gray-200 self-center" />
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-display font-bold text-navy leading-none">31</p>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{pageT.trustStats.years}</p>
            </div>
            <div className="h-8 w-px bg-gray-200 self-center" />
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-display font-bold text-navy leading-none">₹500Cr+</p>
              <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{pageT.trustStats.claims}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ GRID LAYOUT OF TESTIMONIALS ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item: any, idx: number) => {
              const gender = GENDER_MAP[item.name] || 'male'
              const avatarBg =
                gender === 'female'
                  ? 'bg-gradient-to-tr from-pink-500 to-rose-600 text-white'
                  : 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white'
              
              // Get initials (first character)
              const initial = item.name ? item.name.charAt(0) : 'P'

              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Decorative background quote sign */}
                  <Quote className="absolute right-6 top-6 text-gray-50/70 group-hover:text-gold/5 w-12 h-12 pointer-events-none transition-colors" />

                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Bar: Star Rating & Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex gap-0.5 text-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-gold" />
                          ))}
                        </div>
                        <span
                          className="text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider bg-slate-50 text-slate-600 border-slate-200"
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Quote Text */}
                      <p className="text-[14px] sm:text-[15px] text-navy font-medium leading-relaxed mb-6 italic">
                        &ldquo;{item.text}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Section: Avatar & Info */}
                    <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-gray-50">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shadow ${avatarBg}`}>
                        {initial}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-[14px] text-navy leading-none mb-1 group-hover:text-gold transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA SECTION ═══ */}
      <section className="py-16 px-6 bg-gold/5 border-t border-gold/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-navy mb-2">
            {pageT.ctaTitle}
          </h2>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            {pageT.ctaSubtitle}
          </p>
          <Link
            href="/contact"
            className="inline-flex h-12 md:h-14 px-8 bg-navy text-white rounded-full items-center justify-center font-bold text-sm gap-2.5 hover:bg-navy/95 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <span>{pageT.ctaButton}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
