'use client'

import { use, useState } from 'react'
import { useLang } from '@/lib/LangContext'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { User, Phone, MessageSquare, Shield, HelpCircle, Sparkles, MessageCircle, ArrowRight, Award } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'

interface ParamsProp {
  params: Promise<{ age: string }>
}

interface PlanRecommendation {
  name: string
  nameHi: string
  why: string
  whyHi: string
  premium: string
  premiumHi: string
  link: string
}

interface AgeData {
  slug: string
  label: string
  range: string
  lifeStageEn: string
  lifeStageHi: string
  plans: PlanRecommendation[]
}

const AGE_RECOMMENDATIONS: Record<string, AgeData> = {
  '25': {
    slug: '25',
    label: '25',
    range: '22-28',
    lifeStageEn: "Starting a professional career, building initial savings, and having minimal financial liabilities.",
    lifeStageHi: "करियर की शुरुआत, शुरुआती बचत का निर्माण, और न्यूनतम वित्तीय देनदारियां/पारिवारिक जिम्मेदारियां।",
    plans: [
      {
        name: "LIC Tech Term (Plan 854) - Term Insurance",
        nameHi: "एलआईसी टेक टर्म (प्लान 854) - टर्म इंश्योरेंस",
        why: "Secure a massive life cover of ₹50 Lakhs to ₹1 Crore at absolute rock-bottom premiums early in your life.",
        whyHi: "अपने जीवन के शुरुआती वर्षों में सबसे कम प्रीमियम पर ₹50 लाख से ₹1 करोड़ का भारी जीवन कवर सुरक्षित करें।",
        premium: "Starting from ₹500/month",
        premiumHi: "₹500/माह से शुरू",
        link: "/services/life-insurance"
      },
      {
        name: "Star Health Assured - Individual Health Insurance",
        nameHi: "स्टार हेल्थ एश्योर्ड - व्यक्तिगत स्वास्थ्य बीमा",
        why: "Get comprehensive cashless hospitalisation cover before age-related premium loading triggers.",
        whyHi: "उम्र बढ़ने से पहले व्यापक कैशलेस अस्पताल में भर्ती होने का कवर प्राप्त करें, जिससे भविष्य के प्रीमियम महंगे न हों।",
        premium: "Starting from ₹400/month",
        premiumHi: "₹400/माह से शुरू",
        link: "/services/health-insurance"
      },
      {
        name: "LIC Jeevan Labh (Plan 936) - Savings Start",
        nameHi: "एलआईसी जीवन लाभ (प्लान 936) - बचत की शुरुआत",
        why: "A limited-premium paying, high-bonus endowment plan to start your systematic saving habits.",
        whyHi: "एक सीमित-प्रीमियम भुगतान, उच्च-बोनस बंदोबस्ती योजना ताकि आप व्यवस्थित बचत की आदतें शुरू कर सकें।",
        premium: "Starting from ₹1,500/month",
        premiumHi: "₹1,500/माह से शुरू",
        link: "/products"
      }
    ]
  },
  '30': {
    slug: '30',
    label: '30',
    range: '28-32',
    lifeStageEn: "Newly married, starting a young family, facing active household liabilities and child education targets.",
    lifeStageHi: "नवविवाहित जीवन, छोटे बच्चों का पालन-पोषण, घरेलू खर्च और बच्चों की उच्च शिक्षा की योजना।",
    plans: [
      {
        name: "LIC Tech Term (Plan 854) - High Term Cover",
        nameHi: "एलआईसी टेक टर्म (प्लान 854) - उच्च टर्म कवर",
        why: "Crucial for primary breadwinners to protect family lifestyle and active home loans in case of emergencies.",
        whyHi: "घर के मुख्य कमाने वाले के लिए आवश्यक है ताकि किसी भी आपातकालीन स्थिति में परिवार और गृह ऋण सुरक्षित रहें।",
        premium: "Starting from ₹800/month",
        premiumHi: "₹800/माह से शुरू",
        link: "/services/life-insurance"
      },
      {
        name: "LIC New Jeevan Anand (Plan 915) - Dual Protection",
        nameHi: "एलआईसी न्यू जीवन आनंद (प्लान 915) - दोहरा लाभ",
        why: "Provides savings plus double-risk life cover that continues even after maturity throughout your life.",
        whyHi: "बचत के साथ-साथ दोहरा जोखिम जीवन कवर प्रदान करता है जो मैच्योरिटी के बाद भी आपके पूरे जीवन भर जारी रहता है।",
        premium: "Starting from ₹2,000/month",
        premiumHi: "₹2,000/माह से शुरू",
        link: "/products"
      },
      {
        name: "LIC Jeevan Lakshya (Plan 933) - Child Education Plan",
        nameHi: "एलआईसी जीवन लक्ष्य (प्लान 933) - बाल शिक्षा योजना",
        why: "Guarantees educational funds with built-in premium waiver benefit in case of parent's unfortunate demise.",
        whyHi: "माता-पिता के साथ अनहोनी होने पर भी इन-बिल्ट प्रीमियम वेवर लाभ के साथ बच्चों की शिक्षा निधि की गारंटी देता है।",
        premium: "Starting from ₹1,800/month",
        premiumHi: "₹1,800/माह से शुरू",
        link: "/services/child-planning"
      }
    ]
  },
  '35': {
    slug: '35',
    label: '35',
    range: '32-38',
    lifeStageEn: "Peak income years, managing growing children, and seeking standard tax optimization under 80C.",
    lifeStageHi: "सक्रिय आय के मुख्य वर्ष, स्कूल जाते बच्चे, और धारा 80C के तहत उचित टैक्स बचत के लक्ष्य।",
    plans: [
      {
        name: "LIC New Jeevan Anand (Plan 915) - Wealth Protection",
        nameHi: "एलआईसी न्यू जीवन आनंद (प्लान 915) - सुरक्षा कवच",
        why: "Perfect balance of tax savings under 80C, capital safety, and lifetime wealth inheritance protection.",
        whyHi: "80C के तहत कर बचत, पूंजी सुरक्षा, और आजीवन विरासत सुरक्षा का एक आदर्श संतुलन।",
        premium: "Starting from ₹2,500/month",
        premiumHi: "₹2,500/माह से शुरू",
        link: "/products"
      },
      {
        name: "Star Health Family Health Optima - Floater Upgrade",
        nameHi: "स्टार हेल्थ फैमिली हेल्थ ऑप्टिमा - फ्लोटर अपग्रेड",
        why: "Covers husband, wife, and up to 3 children under a single comprehensive cashless medical protection.",
        whyHi: "एकल व्यापक कैशलेस चिकित्सा सुरक्षा के तहत पति, पत्नी और 3 बच्चों तक को कवर करता है।",
        premium: "Starting from ₹1,000/month",
        premiumHi: "₹1,000/माह से शुरू",
        link: "/services/health-insurance"
      },
      {
        name: "LIC Jeevan Labh (Plan 936) - Guaranteed Milestones",
        nameHi: "एलआईसी जीवन लाभ (प्लान 936) - गारंटीड मील का पत्थर",
        why: "High compounding bonus rates guarantee a major lumpsum for college admission funding down the line.",
        whyHi: "उच्च चक्रवृद्धि बोनस दरें भविष्य में कॉलेज प्रवेश के लिए एक बड़े एकमुश्त कोष की गारंटी देती हैं।",
        premium: "Starting from ₹2,500/month",
        premiumHi: "₹2,500/माह से शुरू",
        link: "/products"
      }
    ]
  },
  '40': {
    slug: '40',
    label: '40',
    range: '38-42',
    lifeStageEn: "Consolidating assets, planning early retirement targets, and managing vital health priorities.",
    lifeStageHi: "संपत्ति का विस्तार, समय से पहले सेवानिवृत्ति की योजना, और स्वास्थ्य संबंधी आवश्यक सुरक्षा लक्ष्य।",
    plans: [
      {
        name: "LIC Jeevan Umang (Plan 745) - Lifelong Guaranteed Income",
        nameHi: "एलआईसी जीवन उमंग (प्लान 745) - आजीवन गारंटीड आय",
        why: "Guarantees 8% of Sum Assured every year after premium paying term for whole life along with lifetime protection.",
        whyHi: "प्रीमियम भुगतान अवधि के बाद पूरे जीवन भर के लिए हर साल बीमा राशि का 8% गारंटीड भुगतान और आजीवन सुरक्षा प्रदान करता है।",
        premium: "Starting from ₹3,500/month",
        premiumHi: "₹3,500/माह से शुरू",
        link: "/products"
      },
      {
        name: "LIC New Jeevan Shanti (Plan 858) - Deferred Pension",
        nameHi: "एलआईसी न्यू जीवन शांति (प्लान 858) - आस्थगित पेंशन",
        why: "Secure fixed, guaranteed high pension rates to lock in early self-retirement funds.",
        whyHi: "समय से पहले सेवानिवृत्ति कोष को सुरक्षित करने के लिए निश्चित, गारंटीड उच्च पेंशन दरों को लॉक करें।",
        premium: "Starting from ₹4,000/month",
        premiumHi: "₹4,000/माह से शुरू",
        link: "/services/retirement"
      },
      {
        name: "LIC Critical Illness Rider Add-on - Health Shield",
        nameHi: "एलआईसी क्रिटिकल इलनेस राइडर - हेल्थ शील्ड",
        why: "Crucial medical protection covering cancer, heart attack, and major surgeries as you cross age 40.",
        whyHi: "40 की उम्र पार करते ही कैंसर, दिल का दौरा और प्रमुख सर्जरी को कवर करने वाला बेहद आवश्यक चिकित्सा सुरक्षा चक्र।",
        premium: "Starting from ₹800/month",
        premiumHi: "₹800/माह से शुरू",
        link: "/services/critical-illness"
      }
    ]
  },
  '45': {
    slug: '45',
    label: '45',
    range: '42-48',
    lifeStageEn: "Preparing for active retirement timelines, safeguarding outstanding debt, and managing rising health premiums.",
    lifeStageHi: "सेवानिवृत्ति के अंतिम वर्षों की तैयारी, सक्रिय ऋणों की सुरक्षा, और बढ़ती चिकित्सा लागतों से बचाव।",
    plans: [
      {
        name: "LIC New Jeevan Shanti (Plan 858) - Deferred Pension Basket",
        nameHi: "एलआईसी न्यू जीवन शांति (प्लान 858) - पेंशन बास्केट",
        why: "Lock in premium high annuity payouts to establish guaranteed pension incomes before actual retirement.",
        whyHi: "वास्तविक सेवानिवृत्ति से पहले गारंटीड पेंशन आय स्थापित करने के लिए प्रीमियम उच्च वार्षिकी भुगतान को लॉक करें।",
        premium: "Starting from ₹5,000/month",
        premiumHi: "₹5,000/माह से शुरू",
        link: "/services/retirement"
      },
      {
        name: "Star Health Assured Premium - Comprehensive Cover",
        nameHi: "स्टार हेल्थ एश्योर्ड प्रीमियम - संपूर्ण चिकित्सा सुरक्षा",
        why: "Secure high medical sum assured before age loadings or medical tests become compulsory.",
        whyHi: "आयु-लोडिंग या कठिन चिकित्सा परीक्षण अनिवार्य होने से पहले उच्च चिकित्सा बीमा राशि सुरक्षित करें।",
        premium: "Starting from ₹1,500/month",
        premiumHi: "₹1,500/माह से शुरू",
        link: "/services/health-insurance"
      },
      {
        name: "LIC Tech Term (Plan 854) - Debt Protection",
        nameHi: "एलआईसी टेक टर्म (प्लान 854) - कर्ज से सुरक्षा",
        why: "An affordable term plan to secure outstanding home loans and business liabilities safely.",
        whyHi: "एक किफायती टर्म प्लान जो आपके बकाया गृह ऋण और व्यावसायिक देनदारियों को सुरक्षित करता है।",
        premium: "Starting from ₹2,000/month",
        premiumHi: "₹2,000/माह से शुरू",
        link: "/services/life-insurance"
      }
    ]
  },
  '50': {
    slug: '50',
    label: '50',
    range: '48-55',
    lifeStageEn: "Securing lifetime pension flow, legacy creation, and choosing robust older-age diagnostic covers.",
    lifeStageHi: "आजीवन पेंशन सुरक्षा, बच्चों के लिए विरासत का निर्माण, और वरिष्ठ आयु स्वास्थ्य सुरक्षा का चयन।",
    plans: [
      {
        name: "LIC New Jeevan Shanti (Plan 858) - Immediate Annuity",
        nameHi: "एलआईसी न्यू जीवन शांति (प्लान 858) - तत्काल पेंशन",
        why: "Perfect to convert asset sales or retirement savings into guaranteed immediate lifelong cash flow.",
        whyHi: "सेवानिवृत्ति की बचत या संपत्ति की बिक्री को गारंटीड तत्काल आजीवन नकदी प्रवाह में बदलने के लिए सर्वोत्तम।",
        premium: "Starting from ₹8,000/month",
        premiumHi: "₹8,000/माह से शुरू",
        link: "/services/retirement"
      },
      {
        name: "Star Health Senior Citizen Red Carpet - Specialized Senior Cover",
        nameHi: "स्टार हेल्थ सीनियर सिटीजन रेड कारपेट - वरिष्ठ नागरिक कवर",
        why: "Designed specifically for older adults with pre-existing conditions under relaxed pre-screening.",
        whyHi: "बिना किसी कठिन मेडिकल चेकअप के पहले से मौजूद बीमारियों वाले वरिष्ठ नागरिकों के लिए विशेष रूप से डिज़ाइन किया गया।",
        premium: "Starting from ₹2,000/month",
        premiumHi: "₹2,000/माह से शुरू",
        link: "/services/health-insurance"
      },
      {
        name: "LIC Jeevan Utsav (Plan 871) - Lifetime Guaranteed Return",
        nameHi: "एलआईसी जीवन उत्सव (प्लान 871) - आजीवन निश्चित लाभ",
        why: "Guaranteed lifetime tax-free income of 10% of Sum Assured annually after premium term, perfect legacy plan.",
        whyHi: "प्रीमियम भुगतान के बाद सालाना बीमा राशि का 10% गारंटीड आजीवन कर-मुक्त आय, एक उत्कृष्ट विरासत योजना।",
        premium: "Starting from ₹5,000/month",
        premiumHi: "₹5,000/माह से शुरू",
        link: "/products"
      }
    ]
  }
}

export default function BestPlanAgeClient({ params }: ParamsProp) {
  const { age } = use(params)
  const { lang } = useLang()

  const data = AGE_RECOMMENDATIONS[age] || AGE_RECOMMENDATIONS['30']
  const isHi = lang === 'hi'

  const fields = [
    { name: 'name' as const, label: isHi ? 'आपका नाम' : 'Your Name', icon: <User size={12} />, placeholder: isHi ? 'रमेश शर्मा' : 'Ramesh Sharma', required: true },
    { name: 'mobile' as const, label: isHi ? 'व्हाट्सएप नंबर' : 'WhatsApp Number', icon: <Phone size={12} />, placeholder: '10-digit number', required: true, type: 'tel' },
    { name: 'message' as const, label: isHi ? 'आपकी वर्तमान आवश्यकताएं' : 'Your Current Requirements', icon: <MessageSquare size={12} />, type: 'textarea', placeholder: isHi ? 'बताएं कि हम आपकी आयु वर्ग में कैसे मदद कर सकते हैं...' : 'Tell us how we can help you for your age bracket...' }
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      
      {/* Hero Header */}
      <section className="bg-navy text-white py-14 px-6 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] mb-12">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            {isHi ? `आयु वर्ग ${data.range} के लिए सर्वोत्तम प्लान` : `Best Plans for Age ${data.range}`}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {isHi 
              ? `${data.label} वर्ष की उम्र के लिए सबसे बेहतरीन बीमा योजनाएं (2026 गाइड)` 
              : `Best Insurance Plan for Age ${data.label} in 2026`}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? `अपनी आयु (${data.label} वर्ष) के अनुसार सबसे उपयुक्त एलआईसी और स्वास्थ्य बीमा योजनाओं की पहचान करें।`
              : `Identify the absolute best LIC and health insurance recommendations tailored specifically for age ${data.label}.`}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SEO First Paragraph */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-10 border-l-4 border-gold pl-4 italic">
          {isHi ? (
            <>जब बात जीवन और स्वास्थ्य सुरक्षा की आती है, तो एक आकार सभी के लिए उपयुक्त नहीं होता। यदि आप भी <strong>best LIC plan for ${data.label} year old</strong> की तलाश में हैं या <strong>insurance for age ${data.label}</strong> से जुड़े नियमों को समझना चाहते हैं, तो यह कस्टमाइज्ड विश्लेषण आपके लिए है। गोरखपुर के विख्यात वरिष्ठ एमडीआरटी (USA) सलाहकार अजय कुमार पोद्दार की 31 वर्षों की वित्तीय विशेषज्ञता के आधार पर आपकी आयु वर्ग के लिए चुनिंदा सिफारिशें नीचे दी गई हैं।</>
          ) : (
            <>When it comes to securing your family&apos;s financial future, age is the most critical parameter in planning. If you are specifically searching for the <strong>best LIC plan for ${data.label} year old</strong> or evaluating optimal <strong>insurance for age ${data.label}</strong> brackets, this guide clarifies your top options. Prepared based on 31+ years of advisory experience by MDRT member Ajay Kumar Poddar in Gorakhpur.</>
          )}
        </p>

        {/* Section 1: Life Stage */}
        <section className="mb-10 bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-3 flex items-center gap-2">
            <Award className="text-gold" size={22} />
            {isHi ? `आपकी जीवन यात्रा: ${data.range} वर्ष` : `Your Life Stage: ${data.range} Years`}
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {isHi ? data.lifeStageHi : data.lifeStageEn}
          </p>
        </section>

        {/* Section 2: Plan Recommendations */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-6 flex items-center gap-2">
            <span className="text-gold">01.</span> {isHi ? 'आपके लिए सर्वश्रेष्ठ सिफारिशें' : 'Recommended Plans for You'}
          </h2>
          
          <div className="space-y-6">
            {data.plans.map((plan, i) => (
              <div key={i} className="border border-slate-100/80 hover:border-gold/30 hover:shadow-md transition-all rounded-3xl p-6 md:p-8 bg-white flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-gold/10 text-gold text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
                    {isHi ? `सिफारिश ${i+1}` : `Recommendation ${i+1}`}
                  </span>
                  <h3 className="font-display font-bold text-lg md:text-xl text-navy leading-snug mb-2">
                    {isHi ? plan.nameHi : plan.name}
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                    {isHi ? plan.whyHi : plan.why}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-0.5">{isHi ? 'अनुमानित लागत' : 'Approximate Premium'}</span>
                    <span className="font-display font-extrabold text-xs md:text-sm text-navy">{isHi ? plan.premiumHi : plan.premium}</span>
                  </div>
                  <Link
                    href={plan.link}
                    className="inline-flex items-center gap-1 bg-navy text-white hover:bg-gold transition-colors text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    {isHi ? 'योजना जानें' : 'Learn Plan'} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Take the Quiz */}
        <section className="mb-12 bg-navy text-white rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 w-40 h-40 bg-gold/10 rounded-full blur-2xl" />
          <h2 className="font-display font-bold text-xl md:text-2xl mb-2">{isHi ? 'दुविधा में हैं? 2 मिनट का इंश्योरेंस क्विज़ लें' : 'Still Confused? Take Our 2-Min Insurance Quiz'}</h2>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            {isHi
              ? 'अपनी आवश्यकताओं, आय और प्राथमिकताओं के आधार पर सटीक और व्यक्तिगत उत्पाद अनुशंसा प्राप्त करने के लिए 4 सरल सवालों के जवाब दें।'
              : 'Answer 4 simple life-stage questions to find the absolute best insurance matched to your specific budget and protection gap.'}
          </p>
          <Link
            href="/insurance-quiz"
            className="inline-flex items-center gap-2 bg-gold hover:bg-amber-600 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-md transition-colors"
          >
            {isHi ? 'फ्री इंश्योरेंस क्विज़ शुरू करें' : 'Start Free Insurance Quiz'}
            <ArrowRight size={14} />
          </Link>
        </section>

        {/* Section 4: Get Personalized Advice Lead Form */}
        <section className="bg-gradient-to-br from-amber-50/50 to-white border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-gold" size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-navy mb-1.5">
              {isHi ? `${data.label} वर्ष के लिए निजी सलाह प्राप्त करें` : `Get Personalized Advice for Age ${data.label}`}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              {isHi
                ? 'अजय सर आपको एक कस्टमाइज्ड वित्तीय सुरक्षा ब्लूप्रिंट प्रदान करेंगे जो आपके लक्ष्यों को पूरी तरह से सुरक्षित रखे।'
                : 'Ajay sir will personally draft a custom wealth-protection plan based on your exact profile and income targets.'}
            </p>
          </div>

          <BaseLeadForm
            fields={fields}
            intent={`Best Plan for Age ${data.slug}`}
            submitText={isHi ? 'अजय सर से बात करें →' : 'Request Advice from Ajay Sir →'}
            successTitle={isHi ? 'अनुरोध प्राप्त हुआ!' : 'Consultation Scheduled!'}
            successMessage={isHi
              ? 'अजय सर 24 घंटे के भीतर आपको फोन या व्हाट्सएप पर संपर्क करके विवरण प्रस्तुत करेंगे।'
              : 'Ajay sir will personally contact you within 24 hours with premium calculations and plan outlines.'}
            grid={true}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-100">
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20ji,%20I%20want%20to%20know%20the%20best%20LIC%20plan%20for%20a%20${data.label}%20year%20old.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircle size={15} className="fill-current" />
              {isHi ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
            </a>
            <a
              href={`tel:${ADVISOR_PHONE}`}
              className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {isHi ? 'कॉल करें' : 'Call Ajay Sir'}
            </a>
          </div>

          {/* Share Block */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {isHi ? 'इसे दोस्तों के साथ साझा करें' : 'Share this age guide with friends'}
            </p>
            <WhatsAppShare
              text={isHi ? `${data.label} वर्ष के लिए सर्वश्रेष्ठ जीवन बीमा योजनाएं:` : `Best insurance and LIC plans for age ${data.label}:`}
              url={`https://www.poddarwealth.com/best-plan/${data.slug}`}
              className="w-full justify-center"
            />
          </div>
        </section>

      </div>
    </div>
  )
}
