'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'
import LeadForm from '@/components/LeadForm'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const whyPoints = [
  'Your family loses your income if something happens to you',
  'EMIs, school fees, household expenses don\'t stop',
  'A ₹1 crore term plan costs less than ₹1,000/month',
  'Tax benefits under Section 80C and 10(10D)',
  'Peace of mind for you and your entire family',
]

export default function LifeInsurancePage() {
  const { t } = useLang()

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">🛡️ Life Insurance</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">{t.lifeInsurance.heroTitle}</h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">{t.lifeInsurance.heroSubtitle}</p>
              <div className="flex gap-4">
                <Link href="#lead-form" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-6 py-3.5 rounded-xl hover:bg-brand-50 transition-colors">
                  Protect My Family <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/calculators/life-insurance" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                  Calculate Coverage
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <Image src="https://images.unsplash.com/photo-1511895426328-dc8714191011?w=600&q=80" alt="Family protection" width={600} height={450} className="w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{t.lifeInsurance.whyTitle}</h2>
              <ul className="space-y-3">
                {whyPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-brand-50 border border-brand-100 rounded-2xl p-5">
                <div className="font-display font-bold text-brand-900 text-lg mb-1">🏆 Ajay&apos;s Advice</div>
                <p className="text-brand-800 text-sm leading-relaxed">&quot;The best time to buy life insurance is when you&apos;re young and healthy. Your premiums will be lowest and your family will be protected the longest.&quot;</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card-hover">
              <Image src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&q=80" alt="Protected family" width={600} height={450} className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.lifeInsurance.typesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.lifeInsurance.types.map((type, i) => (
              <div key={i} className="card relative">
                <div className="absolute top-4 right-4 badge bg-brand-100 text-brand-700">{type.tag}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-4 mb-2">{type.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadForm />
    </div>
  )
}
