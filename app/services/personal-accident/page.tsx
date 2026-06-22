'use client'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import ServicePageWrapper from '@/components/ServicePageWrapper'
import { CheckCircle2 } from 'lucide-react'

export default function PersonalAccidentPage() {
  const { t, lang } = useLang()
  const p = t.personalAccident

  return (
    <ServicePageWrapper
      icon="🚶‍♂️"
      label={lang === 'en' ? 'Personal Accident' : 'पर्सनल एक्सीडेंट'}
      title={p.heroTitle}
      subtitle={p.heroSubtitle}
      primaryCta={{ label: lang === 'en' ? 'Get Protected' : 'सुरक्षित हों', href: '#lead-form' }}
      secondaryCta={{ label: lang === 'en' ? 'Talk to Ajay Sir' : 'अजय सर से बात करें', href: `https://wa.me/91${ADVISOR_PHONE}` }}
      category="personal-accident"
      consultationIntent="Personal Accident Insurance Consultation"
    >
      {/* Why you need it */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{p.whyTitle}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {p.whatIsIt}
              </p>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">{p.whoNeedsTitle}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {p.whoNeeds}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-amber-900 text-xl mb-4">★ {lang === 'en' ? "Ajay's Advisory" : "अजय सर की सलाह"}</h3>
              <p className="text-amber-800 text-sm leading-relaxed mb-4">
                {lang === 'en'
                  ? "An accident can halt your income instantly. While health insurance covers hospital bills, a personal accident policy pays you a lump sum for disability and loss of earnings. It is the cheapest protection you can buy."
                  : "एक दुर्घटना आपकी आय को तुरंत रोक सकती है। जबकि हेल्थ इंश्योरेंस अस्पताल के बिलों को कवर करता है, पर्सनल एक्सीडेंट पॉलिसी आपको विकलांगता और कमाई के नुकसान के लिए एकमुश्त भुगतान करती है। यह सबसे सस्ती सुरक्षा है जिसे आप खरीद सकते हैं।"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is covered & Difference */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title mb-6">{p.coversTitle}</h2>
              <ul className="space-y-4">
                {p.covers.map((cover: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 leading-relaxed">{cover}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title mb-6">{p.diffTitle}</h2>
              <p className="text-slate-600 leading-relaxed">
                {p.diffText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans & Claims */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title mb-6">{p.plansTitle}</h2>
              <p className="text-slate-600 leading-relaxed">
                {p.plansText}
              </p>
            </div>
            <div>
              <h2 className="section-title mb-6">{p.claimsTitle}</h2>
              <p className="text-slate-600 leading-relaxed">
                {p.claimsText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ServicePageWrapper>
  )
}
