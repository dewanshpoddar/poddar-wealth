'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, Activity, ShieldAlert, Users } from 'lucide-react'

export default function HealthTaxonomyPage() {
  const { t, lang } = useLang()
  const hi = lang === 'hi'
  const isBn = lang === 'bn'

  const rawTaxonomy = (t as any).servicesTaxonomy || {}
  const title = rawTaxonomy.healthTitle || 'Health Insurance Protection'
  const desc = rawTaxonomy.healthDesc || 'Protect your family from medical inflation with comprehensive health covers, cancer protection plans, and group health insurance policies.'

  const childServices = [
    {
      name: hi ? 'स्वास्थ्य बीमा (Health Insurance Solutions)' : isBn ? 'স্বাস্থ্য বীমা প্ল্যানসমূহ' : 'Comprehensive Health Insurance',
      desc: hi ? 'Star Health के व्यक्तिगत और फैमिली फ्लोटर प्लान जो बीमारी के समय कैशलेस इलाज और सुरक्षा देते हैं।' : isBn ? 'Star Health এর ব্যক্তিগত এবং ফ্যামিলি ফ্লোটার প্ল্যান যা নগদহীন চিকিৎসা এবং প্রিমিয়াম কভারেজ দেয়।' : 'Individual and family floater health covers offering cashless hospitalization across top network hospitals.',
      link: '/services/health-insurance',
      tag: hi ? 'पारिवारिक स्वास्थ्य' : isBn ? 'পারিবারিক স্বাস্থ্য' : 'Family Floater'
    },
    {
      name: hi ? 'कैंसर कवर सुरक्षा (Cancer Cover)' : isBn ? 'ক্যান্সার কভার পলিসি' : 'Cancer Cover Protection',
      desc: hi ? 'कैंसर जैसी गंभीर बीमारी के निदान पर इलाज के खर्च और वित्तीय मदद के लिए विशेष सुरक्षा कवर।' : isBn ? 'ক্যান্সারের মতো মারাত্মক রোগ নির্ণয়ের ক্ষেত্রে চিকিৎসার খরচ ও সুরক্ষার জন্য বিশেষ প্ল্যান।' : 'A highly specialized lump-sum benefit plan protecting against the extreme costs of cancer treatments.',
      link: '/services/cancer-cover',
      tag: hi ? 'विशेष सुरक्षा' : isBn ? 'বিশেষ কভার' : 'Critical Protection'
    },
    {
      name: hi ? 'ग्रुप हेल्थ इंश्योरेंस (Group Health)' : isBn ? 'গ্রুপ হেলথ ইন্স্যুরেন্স' : 'Group Health Insurance',
      desc: hi ? 'कॉर्पोरेट्स और व्यवसायों के लिए उनके कर्मचारियों को किफायती प्रीमियम पर बेहतरीन स्वास्थ्य सुरक्षा।' : isBn ? 'কর্পোরেট এবং ব্যবসার জন্য তাদের কর্মীদের সাশ্রয়ী মূল্যে সেরা গ্রুপ স্বাস্থ্য কভারেজ।' : 'Affordable and tailored corporate health coverages designed for employee welfare and safety.',
      link: '/services/group-health',
      tag: hi ? 'व्यावसायिक' : isBn ? 'ব্যবসায়িক' : 'Corporate Cover'
    }
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': hi ? 'होम' : isBn ? 'হোম' : 'Home',
        'item': 'https://www.poddarwealth.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': hi ? 'सेवाएं' : isBn ? 'পরিষেবা' : 'Services',
        'item': 'https://www.poddarwealth.com/services'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': title,
        'item': `https://www.poddarwealth.com/services/health`
      }
    ]
  }

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
              {hi ? 'स्वास्थ्य सुरक्षा' : isBn ? 'স্বাস্থ্য সুরক্ষা' : 'Health Guard'}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
              {title}
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
              {desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#lead-form" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {hi ? 'परामर्श लें' : isBn ? 'পরামর্শ বুক করুন' : 'Consult Advisor'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Child Services Grid */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {hi ? 'स्वास्थ्य बीमा के विकल्प' : isBn ? 'স্বাস্থ্য বীমা বিকল্পসমূহ' : 'Available Health Plans'}
            </h2>
            <p className="text-slate-600 mt-2 font-medium">
              {hi ? 'चिकित्सा आपात स्थिति के दौरान अपनी बचत को बचाने के लिए सही स्वास्थ्य योजना चुनें' : isBn ? 'যেকোনো চিকিৎসা জরুরী পরিস্থিতিতে আপনার সঞ্চয় বাঁচাতে সঠিক হেলথ প্ল্যান বেছে নিন' : 'Choose the right health plan to protect your savings during a medical emergency'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childServices.map((service, i) => (
              <div key={i} className="bg-white border border-gray-100/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-500/10 text-amber-600 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-amber-500 transition-colors mb-3">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                    {service.desc}
                  </p>
                </div>
                <Link
                  href={service.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-600 group-hover:translate-x-0.5 transition-transform"
                >
                  {hi ? 'विस्तार से जानें' : isBn ? 'বিস্তারিত জানুন' : 'Learn More'} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ajay's advice box */}
      <section className="py-12 bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto bg-amber-50/50 border border-amber-100 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              PJ
            </div>
            <div>
              <h3 className="font-display font-bold text-amber-900 text-lg mb-2">
                {hi ? 'अजय पोद्दार की सलाह:' : isBn ? 'অজয় পোদ্দারের পরামর্শ:' : "Ajay Kumar Poddar's Advice:"}
              </h3>
              <p className="text-amber-800 text-sm md:text-base leading-relaxed font-medium">
                {hi
                  ? 'चिकित्सा मुद्रास्फीति हर साल लगभग 15% की दर से बढ़ रही है। एक गंभीर अस्पताल में भर्ती होने से जीवन भर की बचत मिनटों में समाप्त हो सकती है। हमेशा सुनिश्चित करें कि आपके परिवार के पास एक पर्याप्त और मजबूत हेल्थ कवर हो, जो कि आपके गृह नगर में इलाज के खर्च को आसानी से वहन कर सके।'
                  : isBn
                  ? 'মেডিকেল ইনফ্লেশন প্রতি বছর প্রায় ১৫% হারে বাড়ছে। একটি গুরুতর অসুস্থতা কয়েক মিনিটে সারা জীবনের সঞ্চয় গ্রাস করতে পারে। সর্বদা নিশ্চিত করুন যে আপনার পরিবারের একটি পর্যাপ্ত এবং শক্তিশালী হেলথ কভার রয়েছে।'
                  : 'Medical inflation is rising at approximately 15% per year. A single major hospitalization can wipe out a lifetime of savings in minutes. Make sure your family holds a solid health insurance policy with cashless facility.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ConsultationSection intent="Health Category consultation" />
    </div>
  )
}
