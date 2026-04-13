'use client'
import Image from 'next/image'
import ConsultationSection from '@/components/ConsultationSection'
import ServicePageWrapper from '@/components/ServicePageWrapper'
import { CheckCircle2 } from 'lucide-react'

const benefits = [
  'Build a retirement corpus through disciplined monthly investments',
  'Pension plans provide guaranteed monthly income after retirement',
  'Annuity plans ensure income for lifetime — even if you live to 100',
  'NPS (National Pension System) with tax benefits up to ₹2 lakh',
  'Inflation-beating returns to maintain your lifestyle',
  'Joint life options to protect your spouse too',
]

export default function RetirementPage() {
  return (
    <ServicePageWrapper
      icon="🌅"
      label="Retirement Planning"
      title="Retire with Dignity — On Your Own Terms"
      subtitle="Don't depend on your children in old age. Start planning today and enjoy financial freedom in your golden years."
      primaryCta={{ label: 'Plan My Retirement', href: '#consultation' }}
      secondaryCta={{ label: 'Calculate Corpus', href: '/calculators/retirement' }}
      image={{ src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', alt: 'Happy retirement' }}
      consultationIntent="Retirement Planning Consultation"
    >
      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Build Your Retirement Nest Egg</h2>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card-hover">
              <Image
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80"
                alt="Retirement planning"
                width={600}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Power of early planning */}
      <section className="section-padding bg-gold/5">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">The Power of Starting Early</h2>
            <p className="section-subtitle">See how the same ₹5,000/month can give dramatically different results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { age: 'Start at 25', corpus: '₹3.5 Crore', color: 'border-green-400 bg-green-50', badge: 'Best' },
              { age: 'Start at 35', corpus: '₹1.5 Crore', color: 'border-gold/40 bg-gold/5', badge: 'Good' },
              { age: 'Start at 45', corpus: '₹55 Lakh', color: 'border-red-300 bg-red-50', badge: 'Late' },
            ].map((row, i) => (
              <div key={i} className={`rounded-2xl border-2 ${row.color} p-6 text-center`}>
                <div className="font-display font-bold text-2xl text-slate-900 mb-2">{row.age}</div>
                <div className="text-slate-500 text-sm mb-4">₹5,000/month till age 60</div>
                <div className="font-display font-bold text-3xl text-slate-900">{row.corpus}</div>
                <div className="badge bg-slate-800 text-white mt-3">{row.badge}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">*Assuming 12% annual returns. For illustration purposes only.</p>
        </div>
      </section>
    </ServicePageWrapper>
  )
}
