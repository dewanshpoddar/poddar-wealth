'use client'
import Link from 'next/link'
import Image from 'next/image'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const benefits = [
  'Save up to ₹1.5 lakh per year under Section 80C with LIC premiums',
  'Additional ₹50,000 deduction under Section 80D for health insurance',
  'Maturity proceeds from life insurance are fully tax-free under Section 10(10D)',
  'NPS contributions give extra ₹50,000 deduction under Section 80CCD(1B)',
  'ULIP gains after 5 years are exempt from long-term capital gains tax',
  'Pension annuity structured to minimise taxable income in retirement',
]

const taxTools = [
  {
    icon: '🛡️',
    title: 'Section 80C',
    limit: '₹1.5 Lakh/year',
    desc: 'Life insurance premiums, PPF, ELSS, NSC — all count toward this limit.',
  },
  {
    icon: '❤️',
    title: 'Section 80D',
    limit: '₹50,000/year',
    desc: 'Health insurance premiums for self, spouse, children, and parents.',
  },
  {
    icon: '🏛️',
    title: 'Section 80CCD(1B)',
    limit: '₹50,000/year',
    desc: 'Additional NPS contribution — over and above the 80C limit.',
  },
  {
    icon: '💰',
    title: 'Section 10(10D)',
    limit: 'Unlimited',
    desc: 'Life insurance maturity and death benefits — completely tax-free.',
  },
]

export default function TaxPlanningPage() {
  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
                💰 Wealth & Tax Planning
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Keep More of What You Earn
              </h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">
                Pay zero tax on ₹2 lakh+ every year — legally, with the right insurance and investment mix designed for Indian families.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="#lead-form"
                  className="inline-flex items-center gap-2 bg-gold text-white font-bold px-6 py-3.5 rounded-xl hover:bg-gold-hover transition-colors"
                >
                  Get My Tax Plan <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/calculators/life-insurance"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors font-medium"
                >
                  Calculate Coverage
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80"
                  alt="Tax planning and wealth management"
                  width={600}
                  height={450}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Tax Planning */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight mb-6">
                Protect Your Wealth from Taxes
              </h2>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-gold/5 border border-gold/20 rounded-2xl p-5">
                <div className="font-display font-bold text-navy text-lg mb-1">🏆 Ajay&apos;s Advice</div>
                <p className="text-navy/80 text-sm leading-relaxed">
                  &quot;Most families overpay tax simply because their insurance and investments are not structured correctly. A single review session can save you ₹30,000–₹80,000 every year.&quot;
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
                alt="Tax savings planning"
                width={600}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tax deduction sections */}
      <section className="section-padding bg-warm/50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight mb-3">
              Your Tax-Saving Toolkit
            </h2>
            <p className="text-slate-500 text-lg">Four government-approved deductions — maximise all of them</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {taxTools.map((tool, i) => (
              <div key={i} className="bg-white border border-gold/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-gold/5 transition-all duration-300">
                <div className="text-3xl mb-3">{tool.icon}</div>
                <div className="font-display font-bold text-navy text-lg mb-1">{tool.title}</div>
                <div className="inline-block bg-gold/10 text-gold text-xs font-bold px-2 py-1 rounded-full mb-3">{tool.limit}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-6">
            *Tax benefits as per prevailing Income Tax laws. Subject to change as per Finance Act. Consult your tax advisor.
          </p>
        </div>
      </section>

      {/* Savings illustration */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-slate-900 mb-3">
              How Much Can You Save?
            </h2>
            <p className="text-slate-500">Annual tax savings for a salaried individual in the 30% tax bracket</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: '80C (LIC + ELSS + PPF)', saving: '₹45,000', bracket: '30% slab on ₹1.5L', color: 'border-gold/40 bg-gold/5' },
              { label: '80D (Health insurance)', saving: '₹15,000', bracket: '30% slab on ₹50,000', color: 'border-green-300 bg-green-50' },
              { label: '80CCD(1B) — NPS top-up', saving: '₹15,000', bracket: '30% slab on ₹50,000', color: 'border-blue-300 bg-blue-50' },
            ].map((row, i) => (
              <div key={i} className={`rounded-2xl border-2 ${row.color} p-6 text-center`}>
                <div className="text-slate-600 text-sm mb-3 font-medium">{row.label}</div>
                <div className="font-display font-bold text-3xl text-slate-900 mb-1">{row.saving}</div>
                <div className="text-slate-400 text-xs">{row.bracket}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <div className="inline-block bg-navy text-white font-display font-bold text-xl px-8 py-4 rounded-2xl">
              Total annual saving: <span className="text-gold">₹75,000+</span>
            </div>
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">
            *Illustrative only. Actual savings depend on your income, slab, and existing investments.
          </p>
        </div>
      </section>

      <ConsultationSection intent="Tax Planning Consultation" />
    </div>
  )
}
