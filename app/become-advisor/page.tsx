'use client'

import Image from 'next/image'
import { useLang } from '@/lib/LangContext'
import { User, Phone, MapPin, Briefcase, MessageSquare } from 'lucide-react'
import BaseLeadForm from '@/components/base/BaseLeadForm'

export default function BecomeAdvisorPage() {
  const { t, lang } = useLang()

  const fields = [
    { name: 'name' as const, label: t.commonForm.name, icon: <User size={12} />, placeholder: t.agent.placeholders.name, required: true },
    { name: 'mobile' as const, label: t.commonForm.phone, icon: <Phone size={12} />, placeholder: t.agent.placeholders.phone, required: true, type: 'tel' },
    { name: 'city' as const, label: t.commonForm.city, icon: <MapPin size={12} />, placeholder: t.agent.placeholders.city, required: true },
    { 
      name: 'experience' as const, 
      label: lang === 'en' ? 'Prior Experience' : 'पिछला अनुभव', 
      icon: <Briefcase size={12} />, 
      type: 'select', 
      options: t.becomeAdvisor.experienceOptions,
      required: true 
    },
    { 
      name: 'motivation' as const, 
      label: lang === 'en' ? 'Why do you want to become an advisor?' : 'आप एडवाइज़र क्यों बनना चाहते हैं?', 
      icon: <MessageSquare size={12} />, 
      type: 'textarea', 
      placeholder: lang === 'en' ? 'Share your motivation...' : 'अपनी प्रेरणा साझा करें...',
      required: true 
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">🤝 Join Our Team</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">{t.becomeAdvisor.heroTitle}</h1>
              <p className="text-white/80 text-xl leading-relaxed">{t.becomeAdvisor.heroSubtitle}</p>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <Image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80" alt="Advisor team" width={600} height={450} className="w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why become advisor */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.becomeAdvisor.whyTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.becomeAdvisor.benefits.map((b: any, i: number) => (
              <div key={i} className="card group hover:-translate-y-1 hover:border-brand-100 border-2 border-transparent">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income table */}
      <section className="section-padding bg-brand-900 text-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">{t.becomeAdvisor.incomeTitle}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 bg-white/20 px-6 py-3 text-white/70 text-sm font-semibold">
                <div>Level</div>
                <div>Monthly Policies</div>
                <div>Monthly Income</div>
              </div>
              {t.becomeAdvisor.incomeData.map((row: any, i: number) => (
                <div key={i} className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <div className="font-semibold text-white">{row.level}</div>
                  <div className="text-white/70">{row.policies}</div>
                  <div className="font-bold text-green-400">{row.income}</div>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs mt-3 text-center">*Income estimates based on average advisor performance. Individual results may vary.</p>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section-padding bg-slate-50" id="apply">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-card-hover p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">{t.becomeAdvisor.formTitle}</h2>
                <p className="text-slate-500">{lang === 'en' ? t.becomeAdvisor.formSubtitle : 'अजय सर व्यक्तिगत रूप से आपका आवेदन देखेंगे और 24 घंटों के भीतर कॉल करेंगे।'}</p>
              </div>

              <BaseLeadForm 
                fields={fields}
                intent="Advisor Recruitment"
                submitText={lang === 'en' ? "Apply Now — It's Free →" : "अभी आवेदन करें — यह मुफ़्त है →"}
                successTitle={lang === 'en' ? 'Application Received! 🎉' : 'आवेदन प्राप्त हुआ! 🎉'}
                successMessage={lang === 'en' 
                  ? 'Ajay will personally review your application and call you within 24 hours. Welcome to the journey!' 
                  : 'अजय सर व्यक्तिगत रूप से आपके आवेदन की समीक्षा करेंगे और 24 घंटों के भीतर आपको कॉल करेंगे।'}
                grid={true}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
