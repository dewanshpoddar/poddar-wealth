'use client'
import { useLang } from '@/lib/LangContext'
import ServicePageWrapper from '@/components/ServicePageWrapper'
import { CheckCircle2 } from 'lucide-react'

export default function TermLifePage() {
  const { t, lang } = useLang()
  const tm = t.termLife

  return (
    <ServicePageWrapper
      icon="🧔"
      label={lang === 'en' ? 'Term Life' : 'टर्म लाइफ'}
      title={tm.heroTitle}
      subtitle={tm.heroSubtitle}
      primaryCta={{ label: lang === 'en' ? 'Calculate Coverage' : 'कवरेज कैलकुलेट करें', href: '/calculators/life-insurance' }}
      secondaryCta={{ label: lang === 'en' ? 'Talk to Ajay Sir' : 'अजय सर से बात करें', href: `https://wa.me/919415313434` }}
      category="term-life"
      consultationIntent="Term Life Insurance Consultation"
    >
      {/* Why you need it & 10x rule */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{tm.whyTitle}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {tm.whyText}
              </p>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">{tm.ruleTitle}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {tm.ruleText}
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-indigo-950 text-xl mb-4">🏆 {lang === 'en' ? "Ajay's Advisory" : "अजय सर की सलाह"}</h3>
              <p className="text-indigo-900 text-sm leading-relaxed mb-4">
                {lang === 'en'
                  ? "Many buy endowment plans thinking of returns, but they end up heavily underinsured. Term insurance is pure protection. It lets you secure a ₹1 Crore cover for your family for the cost of a dinner out. It is a must-have."
                  : "कई लोग रिटर्न की सोचकर एंडोमेंट प्लान खरीदते हैं, लेकिन वे बहुत कम बीमा राशि के साथ रह जाते हैं। टर्म इंश्योरेंस शुद्ध सुरक्षा है। यह आपको बाहर डिनर करने के खर्च में आपके परिवार के लिए ₹1 करोड़ का कवर सुरक्षित करने देता है। यह बेहद ज़रूरी है।"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Riders & Comparisons */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title mb-6">{tm.ridersTitle}</h2>
              <ul className="space-y-4">
                {tm.riders.map((rider: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 leading-relaxed">{rider}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title mb-6">{tm.plansTitle}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {tm.plansText}
              </p>
              <p className="text-slate-500 text-sm italic">
                {lang === 'en'
                  ? "We help you compare the claim settlement ratios and terms of Tech Term vs e-Term to choose the right fit."
                  : "हम आपको सही चुनाव करने के लिए टेक टर्म बनाम ई-टर्म के क्लेम सेटलमेंट रेशियो और शर्तों की तुलना करने में मदद करते हैं।"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium examples by age */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">{lang === 'en' ? 'Indicative Annual Premiums (₹1 Crore Cover)' : 'सांकेतिक वार्षिक प्रीमियम (₹1 करोड़ कवर)'}</h2>
            <p className="section-subtitle">{lang === 'en' ? 'For a healthy, non-smoker male up to age 60' : 'स्वस्थ, धूम्रपान न करने वाले पुरुष के लिए 60 वर्ष की आयु तक'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { age: lang === 'en' ? 'Age 25' : 'उम्र 25', premium: '₹8,000 - 10,000', label: lang === 'en' ? 'Yearly' : 'सालाना' },
              { age: lang === 'en' ? 'Age 35' : 'उम्र 35', premium: '₹12,000 - 15,000', label: lang === 'en' ? 'Yearly' : 'सालाना' },
              { age: lang === 'en' ? 'Age 45' : 'उम्र 45', premium: '₹22,000 - 28,000', label: lang === 'en' ? 'Yearly' : 'सालाना' },
            ].map((row, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-6 text-center bg-slate-50">
                <div className="font-display font-bold text-lg text-slate-800 mb-2">{row.age}</div>
                <div className="text-2xl font-bold text-indigo-900 mb-1">{row.premium}</div>
                <div className="text-slate-400 text-xs">{row.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">
            {lang === 'en' ? '*Indicative rates only. Actual premiums depend on medical checks and policy term.' : '*केवल सांकेतिक दरें। वास्तविक प्रीमियम मेडिकल चेकअप और पॉलिसी अवधि पर निर्भर करते हैं।'}
          </p>
        </div>
      </section>
    </ServicePageWrapper>
  )
}
