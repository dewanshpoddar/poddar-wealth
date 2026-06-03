'use client'

import Image from 'next/image'
import { useLang } from '@/lib/LangContext'
import { User, Phone, MapPin, Briefcase, MessageSquare, Coins, Clock, GraduationCap, Trophy, Lock, Heart, Handshake, TrendingUp, Zap } from 'lucide-react'
import ServiceHeroImage from '@/components/ServiceHeroImage'

function BenefitIcon({ icon }: { icon: string }) {
  const map: Record<string, React.ReactNode> = {
    '💰': <Coins size={28} className="text-amber-500" />,
    '⏰': <Clock size={28} className="text-amber-500" />,
    '🎓': <GraduationCap size={28} className="text-amber-500" />,
    '🏆': <Trophy size={28} className="text-amber-500" />,
    '🔒': <Lock size={28} className="text-amber-500" />,
    '❤️': <Heart size={28} className="text-amber-500" />,
  }
  return <>{map[icon] ?? <Briefcase size={28} className="text-amber-500" />}</>
}
import BaseLeadForm from '@/components/base/BaseLeadForm'

export default function BecomeAdvisorPage() {
  const { t, lang } = useLang()
  const isHi = lang === 'hi'

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
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6"><Handshake size={14} className="inline mr-1" />Join Our Team</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">{t.becomeAdvisor.heroTitle}</h1>
              <p className="text-white/80 text-xl leading-relaxed">{t.becomeAdvisor.heroSubtitle}</p>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ServiceHeroImage category="become-advisor" className="w-[600px] h-[450px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned recruitment panel under the hero */}
      <section className="bg-amber-50 border-y border-amber-100 py-16 px-6">
        <div className="max-w-[1240px] mx-auto text-center">
          <span className="text-amber-600 text-xs uppercase tracking-[0.2em] font-bold block mb-3">
            {isHi ? 'पोद्दार एडवाइजरी नेटवर्क' : 'PODDAR ADVISORY NETWORK'}
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {isHi ? 'भारत की सबसे भरोसेमंद बीमा सलाहकार टीम का हिस्सा बनें' : "Join India's Most Trusted Insurance Advisory Team"}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-10 font-medium">
            {isHi 
              ? 'गोरखपुर और पूर्वी उत्तर प्रदेश में एक सफल करियर बनाएं। हम आपको प्रशिक्षण, तकनीक और ग्राहक संपर्क प्रदान करते हैं।' 
              : 'Build a highly rewarding, independent career in Gorakhpur and Eastern UP. We support you with elite mentoring, lead flow, and cutting-edge digital platforms.'}
          </p>

          {/* Benefit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-10">
            {/* Card 1: Training */}
            <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4"><GraduationCap size={28} className="text-amber-500" /></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {isHi ? 'अकाट्य प्रशिक्षण और मेंटरशिप' : 'Elite Training & Mentoring'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {isHi 
                  ? 'अजय कुमार पोद्दार (31+ वर्ष अनुभव) द्वारा व्यक्तिगत रूप से मार्गदर्शन। IRDAI परीक्षा उत्तीर्ण करने और बेहतरीन सेल्स तकनीक सीखने के लिए।'
                  : 'World-class mentoring by Ajay Kumar Poddar (31+ Years experience) to help you clear the IRDAI exam and build solid sales strategies.'}
              </p>
            </div>

            {/* Card 2: Lead Support */}
            <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4"><TrendingUp size={28} className="text-amber-500" /></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {isHi ? 'सत्यापित ग्राहक लीड्स' : 'Active Lead Support'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {isHi 
                  ? 'गोरखपुर और आसपास के पूर्वी उत्तर प्रदेश के जिलों में सत्यापित और संभावित ग्राहक लीड्स तक सीधी पहुंच।'
                  : 'Access verified, localized prospective client leads in Gorakhpur and surrounding Eastern UP districts.'}
              </p>
            </div>

            {/* Card 3: Technology */}
            <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4"><Zap size={28} className="text-amber-500" /></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {isHi ? 'अत्याधुनिक डिजिटल तकनीक' : 'State-of-the-Art Tech'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {isHi 
                  ? 'डील्स को तेजी से क्लोज करने के लिए प्रीमियम कैलकुलेटर, बीमा सुगम इंटीग्रेशन और एआई एडवाइजर टूल्स का उपयोग।'
                  : 'Utilize our state-of-the-art digital tools like Bima Sugam integrations, premium calculators, and AI advisor support to close deals faster.'}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#apply"
            className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
          >
            {isHi ? 'अभी हमारे नेटवर्क से जुड़ें →' : 'Apply to Join Our Network →'}
          </a>
        </div>
      </section>

      {/* Why become advisor */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight">{t.becomeAdvisor.whyTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.becomeAdvisor.benefits.map((b: any, i: number) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card group hover:-translate-y-1 hover:border-gold/30 hover:shadow-xl transition-all duration-300 border-2 border-transparent">
                <div className="mb-4"><BenefitIcon icon={b.icon} /></div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income table */}
      <section className="section-padding bg-navy text-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">{t.becomeAdvisor.incomeTitle}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden">
              <div className="hidden md:grid grid-cols-3 bg-white/20 px-6 py-3 text-white/70 text-sm font-semibold">
                <div>Level</div>
                <div>Monthly Policies</div>
                <div>Monthly Income</div>
              </div>
              {t.becomeAdvisor.incomeData.map((row: any, i: number) => (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
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
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">{t.becomeAdvisor.formTitle}</h2>
                <p className="text-slate-500">{lang === 'en' ? t.becomeAdvisor.formSubtitle : 'अजय सर व्यक्तिगत रूप से आपका आवेदन देखेंगे और 24 घंटों के भीतर कॉल करेंगे।'}</p>
              </div>

              <BaseLeadForm 
                fields={fields}
                intent="Advisor Recruitment"
                submitText={lang === 'en' ? "Apply Now — It's Free →" : "अभी आवेदन करें — यह मुफ़्त है →"}
                successTitle={lang === 'en' ? 'Application Received!' : 'आवेदन प्राप्त हुआ!'}
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
