'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import ConsultationSection from '@/components/ConsultationSection'
import { ArrowRight, Calculator, Calendar, Heart, ShieldCheck } from 'lucide-react'

export default function SavingsTaxonomyPage() {
  const { t, lang } = useLang()
  const hi = lang === 'hi'
  const isBn = lang === 'bn'

  const rawTaxonomy = (t as any).servicesTaxonomy || {}
  const title = rawTaxonomy.savingsTitle || 'Savings & Wealth Creation'
  const desc = rawTaxonomy.savingsDesc || 'Build wealth and guarantee cash flows for key life milestones. Plan for your child\'s education, secure your retirement, save on taxes, and grow capital through endowment solutions.'

  const childServices = [
    {
      name: hi ? 'बच्चों के भविष्य की योजना (Child Future Planning)' : isBn ? 'শিশু শিক্ষা ও বিবাহ পরিকল্পনা' : 'Child Future Planning',
      desc: hi ? 'बच्चों की उच्च शिक्षा और विवाह के लिए समय पर फंड का निर्माण करें, जो पॉलिसी धारक की अनुपस्थिति में भी जारी रहता है।' : isBn ? 'আপনার সন্তানের উচ্চ শিক্ষা ও বিবাহের জন্য তহবিল তৈরি করুন। পলিসি হোল্ডারের অনুপস্থিতিতেও সঞ্চয় চলমান থাকে।' : 'Build a dedicated education or marriage fund for your children that guarantees the goal payout even in your absence.',
      link: '/services/child-planning',
      tag: hi ? 'चाइल्ड वेल्थ' : isBn ? 'শিশু কল্যাণ' : 'Child Wealth'
    },
    {
      name: hi ? 'रिटायरमेंट प्लानिंग (Retirement Wealth Planning)' : isBn ? 'অবসর জীবন পরিকল্পনা' : 'Retirement Wealth Planning',
      desc: hi ? 'अपनी सेवानिवृत्ति के बाद नियमित पेंशन और गारंटीकृत जीवन भर की आय सुनिश्चित करें।' : isBn ? 'আপনার অবসরের পর নিয়মিত পেনশন এবং আজীবন গ্যারান্টিযুক্ত আয়ের ব্যবস্থা নিশ্চিত করুন।' : 'Secure lifelong guaranteed income streams and post-retirement wealth flow for complete independence.',
      link: '/services/retirement',
      tag: hi ? 'रिटायरमेंट' : isBn ? 'অবসর' : 'Retirement'
    },
    {
      name: hi ? 'टैक्स सेविंग और वेल्थ' : isBn ? 'ট্যাক্স সেভিং ও সম্পদ বৃদ্ধি' : 'Tax Saving & Wealth Solutions',
      desc: hi ? 'आयकर अधिनियम की धारा 80C और 10(10D) के तहत अधिकतम टैक्स बचाते हुए सुरक्षित रिटर्न पाएं।' : isBn ? 'আয়কর আইনের ধারা 80C এবং 10(10D) এর অধীনে সর্বোচ্চ কর বাঁচিয়ে সুরক্ষিত রিটার্ন পান।' : 'Grow your wealth with completely tax-free maturity benefits under Section 80C and Section 10(10D).',
      link: '/services/tax-planning',
      tag: hi ? 'टैक्स सेविंग' : isBn ? 'কর সাশ্রয়' : 'Tax Saving'
    },
    {
      name: hi ? 'एंडोमेंट और पूंजी वृद्धि (Endowment Solutions)' : isBn ? 'এন্ডোমেন্ট সঞ্চয় পলিসি' : 'Endowment Solutions',
      desc: hi ? 'सुरक्षित, अनुशासित बचत के साथ निश्चित बोनस और परिपक्वता लाभ जो पूंजी को बढ़ाने में मदद करते हैं।' : isBn ? 'অনুমোদিত এবং সুরক্ষিত অনুশাসিত সঞ্চয়ের সাথে নিশ্চিত বোনাস ও ম্যাচিউরিটি সুবিধা।' : 'Disciplined savings with guaranteed additions, bonuses, and sum assured payouts for capital growth.',
      link: '/services/life-insurance',
      tag: hi ? 'सुरक्षित रिटर्न' : isBn ? 'সুরক্ষিত রিটার্ন' : 'Guaranteed Returns'
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
        'item': `https://www.poddarwealth.com/services/savings`
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
              {hi ? 'बचत और वेल्थ क्रिएशन' : isBn ? 'সঞ্চয় ও সম্পদ সৃষ্টি' : 'Savings & Wealth'}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
              {title}
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8">
              {desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#lead-form" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {hi ? 'फ्री कंसल्टेशन लें' : isBn ? 'বিনামূল্যে পরামর্শ শুরু করুন' : 'Book a Consultation'}
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
              {hi ? 'बचत और निवेश योजनाएं' : isBn ? 'সঞ্চয় ও বিনিয়োগ বিকল্পসমূহ' : 'Available Savings & Wealth Plans'}
            </h2>
            <p className="text-slate-600 mt-2 font-medium">
              {hi ? 'अपने दीर्घकालिक लक्ष्यों को पूरा करने के लिए अनुशासित बचत योजनाएं चुनें' : isBn ? 'আপনার দীর্ঘমেয়াদী লক্ষ্য পূরণের জন্য নিরাপদ সঞ্চয় স্কিম নির্বাচন করুন' : 'Choose disciplined savings plans to meet your long-term life milestones with guarantee'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
                  ? 'पूंजी जमा करने की कुंजी अनुशासन और समय है। बाजार के उतार-चढ़ाव से दूर रहकर, एलआईसी जैसे गारंटीकृत बचत साधनों में हर महीने एक निश्चित राशि जमा करना आपके बच्चों की शिक्षा और सेवानिवृत्ति के लिए सबसे सुरक्षित तरीका है।'
                  : isBn
                  ? 'সঞ্চয়ের চাবিকাঠি হল শৃঙ্খলা এবং সময়। বাজারের ওঠানামা এড়িয়ে, এলআইসি-র মতো গ্যারান্টিযুক্ত স্কিমে প্রতি মাসে একটি নির্দিষ্ট পরিমাণ সঞ্চয় করা আপনার সন্তানের শিক্ষা এবং অবসরের জন্য সবচেয়ে নিরাপদ।'
                  : 'The secret to wealth creation is discipline and time. By staying away from market volatility, investing a fixed sum regularly in guaranteed platforms like LIC ensures absolute certainty for child milestones and retirement.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ConsultationSection intent="Savings Category consultation" />
    </div>
  )
}
