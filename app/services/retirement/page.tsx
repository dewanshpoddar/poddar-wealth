'use client'
import Image from 'next/image'
import Link from 'next/link'
import ConsultationSection from '@/components/ConsultationSection'
import ServicePageWrapper from '@/components/ServicePageWrapper'
import { CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import ServiceHeroImage from '@/components/ServiceHeroImage'
import { useLang } from '@/lib/LangContext'

const benefits = [
  'Build a retirement corpus through disciplined monthly investments',
  'Pension plans provide guaranteed monthly income after retirement',
  'Annuity plans ensure income for lifetime — even if you live to 100',
  'NPS (National Pension System) with tax benefits up to ₹2 lakh',
  'Inflation-beating returns to maintain your lifestyle',
  'Joint life options to protect your spouse too',
]

export default function RetirementPage() {
  const { t, lang } = useLang()
  return (
    <ServicePageWrapper
      icon="🌅"
      label={lang === 'en' ? 'Retirement Planning' : 'रिटायरमेंट प्लानिंग'}
      title={lang === 'en' ? 'Retire with Dignity — On Your Own Terms' : 'सम्मान के साथ रिटायर हों — अपनी शर्तों पर'}
      subtitle={lang === 'en' ? "Don't depend on your children in old age. Start planning today and enjoy financial freedom in your golden years." : 'बुढ़ापे में बच्चों पर निर्भर न रहें। आज ही प्लानिंग शुरू करें और अपने सुनहरे वर्षों में वित्तीय स्वतंत्रता का आनंद लें।'}
      primaryCta={{ label: lang === 'en' ? 'Plan My Retirement' : 'रिटायरमेंट प्लान करें', href: '#lead-form' }}
      secondaryCta={{ label: lang === 'en' ? 'Calculate Corpus' : 'कॉर्पस कैलकुलेट करें', href: '/calculators/retirement' }}
      category="retirement"
      consultationIntent="Retirement Planning Consultation"
    >
      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{t.retirementService.nestEggTitle}</h2>
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
              <ServiceHeroImage category="retirement" className="w-[600px] h-[450px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Power of early planning */}
      <section className="section-padding bg-gold/5">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">{t.retirementService.powerEarlyTitle}</h2>
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

      {/* Helpful Tools */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {lang === 'hi' ? 'मददगार टूल्स और कैलकुलेटर' : 'Helpful Tools & Calculators'}
            </h2>
            <p className="text-slate-500 mt-2">
              {lang === 'hi' 
                ? 'अपनी योजना को आसान बनाने के लिए इन टूल्स का उपयोग करें' 
                : 'Use these free tools to plan and make informed decisions'}
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Link 
              href="/calculators/retirement"
              className="bg-white border border-gray-100 hover:border-amber-500/30 rounded-2xl p-6 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-base mb-1">
                  {lang === 'hi' ? 'रिटायरमेंट कैलकुलेटर' : 'Retirement Calculator'}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {lang === 'hi' 
                    ? 'रिटायरमेंट के बाद एक सुरक्षित जीवन के लिए आवश्यक पेंशन फंड का अनुमान लगाएं।' 
                    : 'Estimate the pension corpus you need for a secure retired life.'}
                </p>
              </div>
              <div className="text-[11px] font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform mt-4 flex items-center gap-1">
                {lang === 'hi' ? 'कैलकुलेट करें' : 'Calculate Now'} →
              </div>
            </Link>
          </div>
        </div>
      </section>
    </ServicePageWrapper>
  )
}
