'use client'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import ServicePageWrapper from '@/components/ServicePageWrapper'
import { CheckCircle2 } from 'lucide-react'

export default function GroupHealthPage() {
  const { t, lang } = useLang()
  const g = t.groupHealth

  return (
    <ServicePageWrapper
      icon="👥"
      label={lang === 'en' ? 'Group Health' : 'ग्रुप हेल्थ'}
      title={g.heroTitle}
      subtitle={g.heroSubtitle}
      primaryCta={{ label: lang === 'en' ? 'Get Health Quote' : 'हेल्थ कोटेशन प्राप्त करें', href: '#lead-form' }}
      secondaryCta={{ label: lang === 'en' ? 'Talk to Ajay Sir' : 'अजय सर से बात करें', href: `https://wa.me/91${ADVISOR_PHONE}` }}
      category="group-health"
      consultationIntent="Group Health Insurance Consultation"
    >
      {/* Why employer cover isn't enough & Family floaters */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{g.whyTitle}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {g.whyText}
              </p>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">{g.familyTitle}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {g.familyText}
              </p>
            </div>
            <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-cyan-950 text-xl mb-4">★ {lang === 'en' ? "Ajay's Advisory" : "अजय सर की सलाह"}</h3>
              <p className="text-cyan-900 text-sm leading-relaxed mb-4">
                {lang === 'en'
                  ? "An employer-provided health policy is good, but it is temporary. If you lose your job or retire, you have zero cover. Getting a personal backup policy when you are young and healthy is vital to secure your family."
                  : "कंपनी द्वारा दी जाने वाली हेल्थ पॉलिसी अच्छी है, लेकिन यह अस्थायी है। यदि आपकी नौकरी छूट जाती है या आप रिटायर होते हैं, तो आपके पास कोई कवर नहीं बचता। जब आप युवा और स्वस्थ हों, तो अपने परिवार को सुरक्षित करने के लिए एक व्यक्तिगत बैकअप पॉलिसी लेना बहुत ज़रूरी है।"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features to compare & leading plans */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title mb-6">{g.featuresTitle}</h2>
              <ul className="space-y-4">
                {g.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="section-title mb-6">{g.plansTitle}</h2>
              <p className="text-slate-600 leading-relaxed">
                {g.plansText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate benefits section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">{lang === 'en' ? 'Employee Health Benefits' : 'कर्मचारी स्वास्थ्य लाभ'}</h2>
            <p className="section-subtitle">{lang === 'en' ? 'Why companies choose group health cover' : 'कंपनियां ग्रुप हेल्थ कवर क्यों चुनती हैं'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: lang === 'en' ? 'Customizable Covers' : 'अनुकूलन योग्य कवर', text: lang === 'en' ? 'Add maternity cover, dental covers, and OPD services based on your company size.' : 'अपनी कंपनी के आकार के आधार पर मैटरनिटी कवर, डेंटल कवर और ओपीडी सेवाएं जोड़ें।' },
              { title: lang === 'en' ? 'No Waiting Period' : 'कोई वेटिंग पीरियड नहीं', text: lang === 'en' ? 'Pre-existing diseases are covered from Day 1 for group members.' : 'ग्रुप सदस्यों के लिए पहले से मौजूद बीमारियां पहले दिन से ही कवर होती हैं।' },
              { title: lang === 'en' ? 'Tax Deductions' : 'टैक्स छूट', text: lang === 'en' ? 'Premiums paid by employers are fully tax-deductible as business expenses.' : 'नियोक्ताओं द्वारा भुगतान किए गए प्रीमियम को व्यावसायिक खर्चों के रूप में टैक्स में पूरी छूट मिलती है।' },
            ].map((col, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-6 bg-slate-50">
                <h3 className="font-display font-bold text-lg text-slate-800 mb-3">{col.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{col.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ServicePageWrapper>
  )
}
