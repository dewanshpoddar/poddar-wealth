'use client'
import { useLang } from '@/lib/LangContext'
import ServicePageWrapper from '@/components/ServicePageWrapper'
import { CheckCircle2 } from 'lucide-react'

export default function CancerCoverPage() {
  const { t, lang } = useLang()
  const c = t.cancerCover

  return (
    <ServicePageWrapper
      icon="🎗️"
      label={lang === 'en' ? 'Cancer Cover' : 'कैंसर कवर'}
      title={c.heroTitle}
      subtitle={c.heroSubtitle}
      primaryCta={{ label: lang === 'en' ? 'Get Cover Quote' : 'कोटेशन प्राप्त करें', href: '#lead-form' }}
      secondaryCta={{ label: lang === 'en' ? 'Talk to Ajay Sir' : 'अजय सर से बात करें', href: `https://wa.me/919415313434` }}
      category="cancer-cover"
      consultationIntent="Cancer Cover Insurance Consultation"
    >
      {/* Why you need it */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{c.whyTitle}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {c.whyText}
              </p>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">{c.howItWorksTitle}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {c.howItWorksText}
              </p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-rose-950 text-xl mb-4">🏆 {lang === 'en' ? "Ajay's Advisory" : "अजय सर की सलाह"}</h3>
              <p className="text-rose-900 text-sm leading-relaxed mb-4">
                {lang === 'en'
                  ? "Standard health policies pay hospital bills, but cancer treatments often run for years. Non-medical costs, travel, and loss of income can strain your family. A standalone cancer policy gives you cash when you need it most."
                  : "सामान्य स्वास्थ्य नीतियां अस्पताल के बिलों का भुगतान करती हैं, लेकिन कैंसर का इलाज अक्सर सालों तक चलता है। गैर-चिकित्सीय खर्च, यात्रा और आय का नुकसान आपके परिवार पर बोझ डाल सकते हैं। एक अलग कैंसर पॉलिसी आपको नकद सहायता देती है जब आपको सबसे अधिक आवश्यकता होती है।"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Stage payouts */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title mb-6">{c.featuresTitle}</h2>
              <ul className="space-y-4">
                {c.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title mb-6">{c.stageTitle}</h2>
              <p className="text-slate-600 leading-relaxed">
                {c.stageText}
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
              <h2 className="section-title mb-6">{c.plansTitle}</h2>
              <p className="text-slate-600 leading-relaxed">
                {c.plansText}
              </p>
            </div>
            <div>
              <h3 className="section-title mb-6">{lang === 'en' ? 'Survival & Waiting Periods' : 'सरवाइवल और वेटिंग पीरियड'}</h3>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'en'
                  ? "Cancer policies come with a waiting period, usually 180 days from purchase. There is also a survival period of 7 to 28 days depending on the plan. Buying cover when healthy ensures these periods pass long before any need arises."
                  : "कैंसर पॉलिसियों में वेटिंग पीरियड होता है, जो आमतौर पर खरीद से 180 दिन का होता है। प्लान के आधार पर 7 से 28 दिनों का सरवाइवल पीरियड भी होता है। स्वस्थ रहते हुए कवर खरीदना यह सुनिश्चित करता है कि ये पीरियड किसी भी आवश्यकता से बहुत पहले समाप्त हो जाएं।"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </ServicePageWrapper>
  )
}
