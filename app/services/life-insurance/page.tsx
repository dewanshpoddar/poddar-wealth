'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, CheckCircle2, Calculator, Coins, TrendingUp, Landmark } from 'lucide-react'
import ServiceHeroImage from '@/components/ServiceHeroImage'

const whyPoints = [
  'Your family loses your income if something happens to you',
  'EMIs, school fees, household expenses don\'t stop',
  'A ₹1 crore term plan costs less than ₹1,000/month',
  'Tax benefits under Section 80C and 10(10D)',
  'Peace of mind for you and your entire family',
]

export default function LifeInsurancePage() {
  const { t, lang } = useLang()
  const hi = lang === 'hi'

  const tools = [
    {
      name: hi ? 'प्रीमियम कैलकुलेटर' : 'Premium Calculator',
      desc: hi ? 'अपने वास्तविक LIC प्रीमियम और मिलने वाले लाभों की तुरंत गणना करें।' : 'Calculate your exact LIC premiums and returns instantly.',
      icon: <Calculator className="w-5 h-5 text-amber-500" />,
      link: '/calculators/premium'
    },
    {
      name: hi ? 'सरेंडर वैल्यू' : 'Surrender Value',
      desc: hi ? 'पॉलिसी सरेंडर करने से पहले उसकी वर्तमान सरेंडर वैल्यू का आकलन करें।' : 'Estimate the current surrender value and payouts before surrendering.',
      icon: <Coins className="w-5 h-5 text-amber-500" />,
      link: '/calculators/surrender-value'
    },
    {
      name: hi ? 'मैच्योरिटी कैलकुलेटर' : 'Maturity Calculator',
      desc: hi ? 'अपनी LIC पॉलिसी के मैच्योरिटी रिटर्न और बोनस का अनुमान लगाएं।' : 'Estimate the maturity returns and bonus of your LIC policy.',
      icon: <TrendingUp className="w-5 h-5 text-amber-500" />,
      link: '/calculators/maturity'
    },
    {
      name: hi ? 'पॉलिसी पर लोन' : 'Loan Against Policy',
      desc: hi ? 'जानें कि आप अपनी LIC पॉलिसी पर कितना लोन ले सकते हैं।' : 'Find out how much loan you can get against your LIC policy.',
      icon: <Landmark className="w-5 h-5 text-amber-500" />,
      link: '/calculators/loan'
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">Life Insurance</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">{t.lifeInsurance.heroTitle}</h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">{t.lifeInsurance.heroSubtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="#lead-form" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Get a Free Quote
                </Link>
                <Link href="#lead-form" className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors">
                  Protect My Family <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <ServiceHeroImage category="life-insurance" className="w-[600px] h-[450px]" />
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
              <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <div className="font-display font-bold text-amber-900 text-lg mb-1">{"Ajay's"} Advice</div>
                <p className="text-amber-800 text-sm leading-relaxed">&quot;The best time to buy life insurance is when you&apos;re young and healthy. Your premiums will be lowest and your family will be protected the longest.&quot;</p>
              </div>
            </div>
            <div className="rounded-3xl bg-blue-950 p-8 md:p-10 flex flex-col gap-6 shadow-card-hover">
              {[
                { label: 'Families Protected', value: '2,000+', sub: 'in Gorakhpur & Purvanchal' },
                { label: 'Claim Settlement', value: '98.6%', sub: 'LIC of India (2023-24)' },
                { label: 'Years of Service', value: '31+', sub: 'serving since 1994' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                  <div className="text-3xl font-display font-bold text-amber-400 mb-0.5">{value}</div>
                  <div className="text-white text-sm font-semibold">{label}</div>
                  <div className="text-white/40 text-xs">{sub}</div>
                </div>
              ))}
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
                <div className="absolute top-4 right-4 badge bg-amber-100 text-amber-700">{type.tag}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-4 mb-2">{type.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpful Tools */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {hi ? 'मददगार टूल्स और कैलकुलेटर' : 'Helpful Tools & Calculators'}
            </h2>
            <p className="text-slate-500 mt-2">
              {hi 
                ? 'अपनी योजना को आसान बनाने के लिए इन टूल्स का उपयोग करें' 
                : 'Use these free tools to plan and make informed decisions'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <Link 
                key={i} 
                href={tool.link}
                className="bg-white border border-gray-100 hover:border-amber-500/30 rounded-2xl p-5 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {tool.desc}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform mt-4 flex items-center gap-1">
                  {hi ? 'कैलकुलेट करें' : 'Calculate Now'} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConsultationSection intent="Life Insurance Consultation" />
    </div>
  )
}
