'use client'
import Link from 'next/link'
import Image from 'next/image'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, CheckCircle2, Calculator, TrendingUp } from 'lucide-react'
import ServiceHeroImage from '@/components/ServiceHeroImage'
import { useLang } from '@/lib/LangContext'

const features = [
  'Funds auto-continue even if parent passes away',
  'Premium waiver benefit - no more payments, policy continues',
  'Corpus available exactly when your child needs it',
  'Covers education, higher studies, and marriage goals',
  'Market-linked options for higher growth potential',
  'Partial withdrawals allowed for urgent needs',
]

export default function ChildPlanningPage() {
  const { t, lang } = useLang()
  const hi = lang === 'hi'

  const tools = [
    {
      name: hi ? 'प्रीमियम कैलकुलेटर' : 'Premium Calculator',
      desc: hi ? 'अपने वास्तविक LIC प्रीमियम और मिलने वाले लाभों की तुरंत गणना करें।' : 'Calculate your exact LIC premiums and returns instantly.',
      icon: <Calculator className="w-5 h-5 text-violet-600" />,
      link: '/calculators/premium'
    },
    {
      name: hi ? 'मैच्योरिटी कैलकुलेटर' : 'Maturity Calculator',
      desc: hi ? 'अपनी LIC पॉलिसी के मैच्योरिटी रिटर्न और बोनस का अनुमान लगाएं।' : 'Estimate the maturity returns and bonus of your LIC policy.',
      icon: <TrendingUp className="w-5 h-5 text-violet-600" />,
      link: '/calculators/maturity'
    }
  ]

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-violet-900 via-violet-800 to-violet-900 hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">🎓 Child Planning</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Secure Your Child&apos;s Dreams - No Matter What
              </h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">
                Education costs are doubling every 7 years. Start a child plan today so your child&apos;s future is fully funded - even if you&apos;re not there.
              </p>
              <Link href="#lead-form" className="inline-flex items-center gap-2 bg-white text-violet-800 font-bold px-6 py-3.5 rounded-xl hover:bg-violet-50 transition-colors">
                Plan My Child&apos;s Future <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <ServiceHeroImage category="child-planning" className="w-[600px] h-[450px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-card-hover">
              <ServiceHeroImage category="child-planning" className="w-[600px] h-[450px]" />
            </div>
            <div>
              <h2 className="section-title mb-6">{t.childPlanningService.whyTitle}</h2>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-violet-50">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">{t.childPlanningService.realityCheckTitle}</h2>
            <p className="section-subtitle">Plan today for tomorrow&apos;s costs</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { goal: 'Engineering (IIT)', now: '₹15 - 20 Lakh', in15yrs: '₹45 - 60 Lakh', icon: '⚙️' },
              { goal: 'Medical (MBBS)', now: '₹20 - 50 Lakh', in15yrs: '₹60 - 150 Lakh', icon: '🏥' },
              { goal: 'MBA (IIM)', now: '₹20 - 25 Lakh', in15yrs: '₹60 - 75 Lakh', icon: '💼' },
              { goal: 'Study Abroad', now: '₹50 - 80 Lakh', in15yrs: '₹1.5 - 2.5 Cr', icon: '✈️' },
            ].map((edu, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-5">
                
                <h3 className="font-bold text-slate-900 mb-3">{edu.goal}</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-slate-400">Today&apos;s Cost</div>
                    <div className="font-semibold text-slate-700">{edu.now}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">In 15 Years (@8% inflation)</div>
                    <div className="font-bold text-violet-700">{edu.in15yrs}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">*For illustration purposes only</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {tools.map((tool, i) => (
              <Link 
                key={i} 
                href={tool.link}
                className="bg-white border border-gray-100 hover:border-violet-500/30 rounded-2xl p-5 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors text-base mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {tool.desc}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-violet-600 group-hover:translate-x-0.5 transition-transform mt-4 flex items-center gap-1">
                  {hi ? 'कैलकुलेट करें' : 'Calculate Now'} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConsultationSection intent="Child Planning Consultation" />
    </div>
  )
}
