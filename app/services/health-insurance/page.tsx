'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, CheckCircle2, Activity } from 'lucide-react'
import ServiceHeroImage from '@/components/ServiceHeroImage'

const features = [
  'Cashless treatment at 10,000+ hospitals across India',
  'Pre & post hospitalization expenses covered',
  'Day care procedures (no 24-hr admission needed)',
  'No-claim bonus for every claim-free year',
  'Critical illness coverage available as add-on',
  'Annual health check-up included in most plans',
]

const types = [
  { title: 'Individual Health Plan', desc: 'Complete coverage for one person, ideal for young professionals.', tag: 'Individual' },
  { title: 'Family Floater Plan', desc: 'One plan covers entire family, cost-effective and convenient.', tag: 'Most Popular' },
  { title: 'Senior Citizen Plan', desc: 'Specialized plans for parents aged 60+, covering pre-existing conditions.', tag: 'For Parents' },
  { title: 'Critical Illness Plan', desc: 'Lump-sum payout on diagnosis of major illness like cancer, heart attack.', tag: 'Add-on' },
]

export default function HealthInsurancePage() {
  const { t, lang } = useLang()
  const hi = lang === 'hi'

  const tools = [
    {
      name: hi ? 'पॉलिसी हेल्थ स्कोर' : 'Policy Health Score',
      desc: hi ? 'अपने बीमा पोर्टफोलियो का मुफ्त सुरक्षा ऑडिट और स्कोर प्राप्त करें।' : 'Get a free insurance portfolio audit and security health score.',
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      link: '/calculators/policy-health'
    }
  ]

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">Health Insurance</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Medical Bills Shouldn&apos;t Wipe Out Your Savings
              </h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">
                One hospitalization can cost ₹2–10 lakhs. Health insurance ensures your family gets the best care without financial stress.
              </p>
              <Link href="#lead-form" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors">
                Get Health Coverage <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <ServiceHeroImage category="health-insurance" className="w-full h-[450px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-card-hover">
              <ServiceHeroImage category="health-insurance" className="w-full h-48 md:h-[450px]" />
            </div>
            <div>
              <h2 className="section-title mb-6">{t.healthInsurance.coversTitle}</h2>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.healthInsurance.typesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {types.map((type, i) => (
              <div key={i} className="card relative">
                <div className="absolute top-4 right-4 badge bg-emerald-100 text-emerald-700">{type.tag}</div>
                
                <h3 className="font-display font-bold text-lg text-slate-900 mt-2 mb-2">{type.title}</h3>
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
          <div className="max-w-md mx-auto">
            {tools.map((tool, i) => (
              <Link 
                key={i} 
                href={tool.link}
                className="bg-white border border-gray-100 hover:border-emerald-500/30 rounded-2xl p-6 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-base mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {tool.desc}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform mt-4 flex items-center gap-1">
                  {hi ? 'कैलकुलेट करें' : 'Calculate Now'} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConsultationSection intent="Health Insurance Consultation" />
    </div>
  )
}
