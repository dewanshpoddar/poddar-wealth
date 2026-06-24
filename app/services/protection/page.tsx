'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, CheckCircle2, Shield, HeartPulse, AlertOctagon, HelpCircle } from 'lucide-react'

export default function ProtectionTaxonomyPage() {
  const { t, lang } = useLang()
  const hi = lang === 'hi'
  const isBn = lang === 'bn'

  const rawTaxonomy = (t as any).servicesTaxonomy || {}
  const title = rawTaxonomy.protectionTitle || 'Protection Solutions'
  const desc = rawTaxonomy.protectionDesc || 'Secure your family\'s future with pure protection policies including term life insurance, personal accident cover, critical illness protection, and keyman business insurance.'

  const childServices = [
    {
      name: hi ? 'टर्म लाइफ इंश्योरेंस' : isBn ? 'টার্ম লাইফ ইন্স্যুরেন্স' : 'Pure Term Life Insurance',
      desc: hi ? 'सबसे कम प्रीमियम पर अधिकतम लाइफ कवर प्राप्त करें। आपके परिवार की आय सुरक्षा के लिए सबसे जरूरी।' : isBn ? 'সর্বনিম্ন প্রিমিয়ামে সর্বোচ্চ লাইফ কভার পান। আপনার পরিবারের আয় সুরক্ষার জন্য সবচেয়ে প্রয়োজনীয়।' : 'Secure the highest coverage at the lowest premiums. The absolute baseline of safety for your family.',
      link: '/services/term-life',
      tag: hi ? 'ज़रूरी' : isBn ? 'জরুরী' : 'Essential'
    },
    {
      name: hi ? 'लाइफ वेल्थ समाधान' : isBn ? 'জীবন বীমা' : 'Life Insurance solutions',
      desc: hi ? 'LIC के एंडोमेंट, मनी-बैक और होल-लाइफ प्लान जो सुरक्षा के साथ बचत भी देते हैं।' : isBn ? 'LIC এর এন্ডোমেন্ট, মানি-ব্যাক এবং হোল লাইফ প্ল্যান যা সুরক্ষার সাথে সঞ্চয় দেয়।' : 'Traditional endowment, money-back, and whole-life insurance plans combining savings and security.',
      link: '/services/life-insurance',
      tag: hi ? 'बचत + सुरक्षा' : isBn ? 'সঞ্চয় + সুরক্ষা' : 'Savings + Safety'
    },
    {
      name: hi ? 'गंभीर बीमारी सुरक्षा' : isBn ? 'গুরুতর অসুস্থতা সুরক্ষা' : 'Critical Illness Protection',
      desc: hi ? 'कैंसर या दिल के दौरे जैसी गंभीर बीमारियों के निदान पर एकमुश्त भुगतान प्राप्त करें।' : isBn ? 'ক্যান্সার বা হার্ট অ্যাটাকের মতো গুরুতর রোগ নির্ণয় হলে এককালীন অর্থ প্রদান পান।' : 'Get a lump-sum payout upon diagnosis of major illnesses to cover advanced medical treatments.',
      link: '/services/critical-illness',
      tag: hi ? 'मेडिकल' : isBn ? 'চিকিৎসা' : 'Health Guard'
    },
    {
      name: hi ? 'व्यक्तिगत दुर्घटना कवर' : isBn ? 'ব্যক্তিগত দুর্ঘটনা কভার' : 'Personal Accident Cover',
      desc: hi ? 'दुर्घटना से होने वाली विकलांगता या आय के नुकसान के खिलाफ चौबीसों घंटे सुरक्षा।' : isBn ? 'দুর্ঘটনাজনিত অক্ষমতা বা আয়ের ক্ষতির বিরুদ্ধে সার্বক্ষণিক আর্থিক সুরক্ষা কভার।' : '24/7 financial safeguard against accidental disability, death, or loss of income.',
      link: '/services/personal-accident',
      tag: hi ? 'सुरक्षा' : isBn ? 'সুরক্ষা' : 'Safeguard'
    },
    {
      name: hi ? 'कीमैन इंश्योरेंस समाधान' : isBn ? 'কিম্যান ইন্স্যুরেন্স' : 'Keyman Business Insurance',
      desc: hi ? 'आपके व्यवसाय के प्रमुख कर्मचारियों और पार्टनर्स की अनुपस्थिति में कंपनी को वित्तीय स्थिरता।' : isBn ? 'আপনার ব্যবসার মূল কর্মচারী এবং অংশীদারদের অনুপস্থিতিতে কোম্পানিকে আর্থিক স্থিতিশীলতা।' : 'Protect your business continuity against the loss of key decision makers and vital employees.',
      link: '/services/keyman-insurance',
      tag: hi ? 'कॉर्पोरेट' : isBn ? 'কর্পোরেট' : 'Corporate'
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
        'item': `https://www.poddarwealth.com/services/protection`
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
              {hi ? 'परिवार की सुरक्षा' : isBn ? 'পারিবারিক সুরক্ষা' : 'Family Protection'}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
              {title}
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
              {desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#lead-form" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {hi ? 'फ्री कोट लें' : isBn ? 'বিনামূল্যে পরামর্শ নিন' : 'Get a Free Quote'}
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
              {hi ? 'सुरक्षा और बीमा के प्रकार' : isBn ? 'বীমা ও সুরক্ষা বিকল্পসমূহ' : 'Available Protection & Insurance Plans'}
            </h2>
            <p className="text-slate-600 mt-2 font-medium">
              {hi ? 'अपने परिवार को वित्तीय जोखिमों से सुरक्षित करने के लिए सही समाधान चुनें' : isBn ? 'আপনার পরিবারকে যেকোনো আর্থিক ঝুঁকি থেকে রক্ষা করতে সঠিক প্ল্যান নির্বাচন করুন' : 'Select the ideal protection plan to safeguard your family from unforeseen financial risks'}
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
                  ? 'शुद्ध सुरक्षा (टर्म बीमा) आपकी वित्तीय योजना की नींव है। किसी भी निवेश या बचत योजना से पहले हमेशा सुनिश्चित करें कि आपके पास आपकी वार्षिक आय का कम से कम 10 से 15 गुना जीवन कवर हो।'
                  : isBn
                  ? 'বিশুদ্ধ সুরক্ষা বা টার্ম ইন্স্যুরেন্স আপনার আর্থিক পরিকল্পনার মূল ভিত্তি। অন্য কোনো বিনিয়োগ শুরু করার আগে আপনার বার্ষিক আয়ের কমপক্ষে ১০ থেকে ১৫ গুণ লাইফ কভার রয়েছে তা নিশ্চিত করুন।'
                  : 'Pure protection (term insurance) is the foundation of any sound financial plan. Before starting any investments or savings plans, always ensure you have a life cover worth at least 10 to 15 times your annual income.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ConsultationSection intent="Protection Category consultation" />
    </div>
  )
}
