'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import ConsultationSection from '@/components/ConsultationSection'

const benefits = [
  'Immediate lump-sum payout upon medical diagnosis of cancer, heart attack, stroke, or 30+ major ailments',
  'Payout is completely separate from regular health insurance plans and can be used for advanced treatments overseas',
  'Use the sum assured to clear major home loans, personal loans, or cover ongoing household expenses during recovery',
  'Tax benefits on health premium payments under Section 80D up to ₹50,000 for self, spouse, and parents',
  'Full peace of mind that your family\'s future financial milestones (child education, marriage) remain protected',
  'Cashless diagnostics, hospitalization, and treatment at over 12,000+ top hospitals in India through partner networks',
]

const PHONE = '9415313434'
const WA_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent('Hello Ajay sir, I need information about Critical Illness Insurance for my family.')}`

export default function CriticalIllnessPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              {/* Breadcrumb / Category Tag */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
                🩺 Services / Critical Illness
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Shield Your Life Savings from Major Illnesses
              </h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">
                Get a guaranteed lump sum payout on diagnosis of cancer, heart ailments, or organ failure — focus on recovery, not treatment bills.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="#consultation"
                  className="inline-flex items-center gap-2 bg-gold text-white font-bold px-6 py-3.5 rounded-xl hover:bg-gold-hover transition-colors"
                >
                  Protect My Family <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#20c45a] transition-all shadow-md"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"
                  alt="Doctor holding patient's hand for support"
                  width={600}
                  height={450}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight mb-6">
                Comprehensive Financial Shield Against Critical Ailments
              </h2>
              <ul className="space-y-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-15 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              
              {/* Advisor Note */}
              <div className="mt-8 bg-gold/5 border border-gold/20 rounded-2xl p-5">
                <div className="font-display font-bold text-navy text-lg mb-1">🏆 Ajay sir&apos;s Advisory</div>
                <p className="text-navy/80 text-sm leading-relaxed">
                  &quot;Medical inflation in India is rising at 14% annually. A major diagnosis like cancer or a bypass surgery doesn&apos;t just impact health — it can wipe out a lifetime of family savings. A critical illness plan guarantees a massive tax-free cash payout upon diagnosis, ensuring you get top-tier hospital care without borrowing loans.&quot;
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80"
                alt="Healthy active life and recovery support"
                width={600}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display font-bold text-22 text-slate-900 mb-2">Want to compare health floaters vs critical illness cover?</h3>
          <p className="text-slate-500 text-sm mb-6">Discuss details directly with Ajay sir on WhatsApp for clear, honest financial guidance.</p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] text-white font-bold h-12 px-8 rounded-full shadow-lg hover:bg-[#20c45a] active:scale-[0.98] transition-all"
          >
            Send WhatsApp Query (9415313434)
          </a>
        </div>
      </section>

      {/* Consultation Section */}
      <div id="consultation">
        <ConsultationSection intent="Critical Illness Consultation" />
      </div>
    </div>
  )
}
