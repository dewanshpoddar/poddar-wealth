'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, User, Phone, MapPin } from 'lucide-react'
import ServiceHeroImage from '@/components/ServiceHeroImage'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function CriticalIllnessPage() {
  const { t, lang } = useLang()

  const fields = [
    { name: 'name' as const, label: t.commonForm.name, icon: <User size={12} />, placeholder: t.leadForm.name, required: true },
    { name: 'mobile' as const, label: t.commonForm.phone, icon: <Phone size={12} />, placeholder: t.leadForm.phone, required: true, type: 'tel' },
    { name: 'city' as const, label: t.commonForm.city, icon: <MapPin size={12} />, placeholder: t.commonForm.city, required: true },
  ]

  const WA_LINK = `https://wa.me/91${ADVISOR_PHONE}`

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">🛡️ {lang === 'en' ? 'Critical Protection' : 'क्रिटिकल सुरक्षा'}</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">{t.criticalIllness.heroTitle}</h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">{t.criticalIllness.heroSubtitle}</p>
              <div className="flex gap-4 flex-wrap">
                <Link href="#lead-form" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-6 py-3.5 rounded-xl hover:bg-brand-50 transition-colors">
                  {t.criticalIllness.ctaConsult} <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#20c45a] transition-all shadow-md"
                >
                  {t.criticalIllness.ctaWhatsApp}
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <ServiceHeroImage category="cancer-cover" className="w-full h-[450px]" />
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
              <h2 className="section-title mb-6">{t.criticalIllness.benefitsTitle}</h2>
              <ul className="space-y-3">
                {t.criticalIllness.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-brand-50 border border-brand-100 rounded-2xl p-5">
                <div className="font-display font-bold text-brand-900 text-lg mb-1">{t.criticalIllness.advisorTitle}</div>
                <p className="text-brand-800 text-sm leading-relaxed">&quot;{t.criticalIllness.advisorText}&quot;</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card-hover">
              <ServiceHeroImage category="cancer-cover" className="w-full h-48 md:h-[450px]" />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display font-bold text-22 text-slate-900 mb-2">{t.criticalIllness.contactTitle}</h3>
          <p className="text-slate-500 text-sm mb-6">{t.criticalIllness.contactSub}</p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] text-white font-bold h-12 px-8 rounded-full shadow-lg hover:bg-[#20c45a] active:scale-[0.98] transition-all"
          >
            {lang === 'en' ? `Send WhatsApp Query (${ADVISOR_PHONE})` : `व्हाट्सएप पर सवाल भेजें (${ADVISOR_PHONE})`}
          </a>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="section-padding bg-slate-50" id="lead-form">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">{lang === 'en' ? 'Get a Free Critical Illness Quote' : 'फ्री क्रिटिकल इलनेस कोटेशन लें'}</h2>
                <p className="text-slate-500">{lang === 'en' ? 'Fill out the form below and Ajay sir will get in touch with you.' : 'नीचे दिया गया फॉर्म भरें और अजय सर आपसे संपर्क करेंगे।'}</p>
              </div>

              <BaseLeadForm
                fields={fields}
                intent="critical-illness"
                submitText={lang === 'en' ? 'Get Free Advice →' : 'फ्री सलाह लें →'}
                successTitle={t.leadForm.successTitle}
                successMessage={t.leadForm.successMsg}
                grid={true}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
