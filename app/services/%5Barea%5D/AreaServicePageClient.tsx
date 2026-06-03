'use client'
import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, User, Phone, MapPin, Shield, Star, Heart, TrendingUp, Award } from 'lucide-react'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { ADVISOR_PHONE } from '@/lib/constants'
import ServiceHeroImage from '@/components/ServiceHeroImage'

const AREAS = [
  { slug: 'golghar', name: 'Golghar', nameHi: 'गोलघर' },
  { slug: 'shahpur', name: 'Shahpur', nameHi: 'शाहपुर' },
  { slug: 'padrauna', name: 'Padrauna', nameHi: 'पडरौना' },
  { slug: 'deoria', name: 'Deoria', nameHi: 'देवरिया' },
  { slug: 'kushinagar', name: 'Kushinagar', nameHi: 'कुशीनगर' },
]

export default function AreaServicePageClient({ params }: { params: Promise<{ area: string }> }) {
  const { area } = use(params)
  const { t, lang } = useLang()
  const areaData = AREAS.find(a => a.slug === area) || AREAS[0]

  const fields = [
    { name: 'name' as const, label: t.commonForm.name, icon: <User size={12} />, placeholder: t.leadForm.name, required: true },
    { name: 'mobile' as const, label: t.commonForm.phone, icon: <Phone size={12} />, placeholder: t.leadForm.phone, required: true, type: 'tel' },
    { name: 'city' as const, label: t.commonForm.city, icon: <MapPin size={12} />, placeholder: areaData.name, required: true },
  ]

  const WA_LINK = `https://wa.me/91${ADVISOR_PHONE}?text=Hello%20Ajay%20sir,%20I%20am%20from%20${areaData.name}%20and%20interested%20in%20insurance%20services.`

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-hero-gradient hero-pattern section-padding relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,76,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4.5 py-1.5 text-xs font-semibold tracking-wider uppercase mb-6 text-gold">
                🏆 {lang === 'en' ? 'MDRT Advisor Near You' : 'आपके नज़दीक MDRT एडवाइज़र'}
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                {lang === 'hi' 
                  ? `भरोसेमंद LIC एजेंट ${areaData.nameHi} में — पोद्दार वेल्थ`
                  : `Trusted LIC Agent in ${areaData.name} — Poddar Wealth`}
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 font-medium">
                {lang === 'hi'
                  ? `31 वर्षों के अनुभव के साथ ${areaData.nameHi} के परिवारों के लिए व्यक्तिगत जीवन बीमा, हेल्थ इंश्योरेंस और टैक्स सेविंग समाधान।`
                  : `Three decades of serving families in ${areaData.name} with custom term plans, medical floater coverage, and goal-based wealth creations.`}
              </p>
              
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                <Link href="#lead-form" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-600 text-navy font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-gold/20 active:scale-[0.98] text-sm">
                  {lang === 'hi' ? 'फ्री सलाह लें' : 'Get Free Consultation'} <ArrowRight size={16} />
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c45a] text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg active:scale-[0.98] text-sm"
                >
                  {lang === 'hi' ? 'अजय सर से बात करें' : `Contact Ajay sir for ${areaData.name}`}
                </a>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group relative max-w-[500px] mx-auto aspect-[4/3] bg-slate-800">
                <ServiceHeroImage 
                  category="area-service" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-navy border-y border-white/5 py-8 text-white relative">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/10">
            <div>
              <div className="text-28 md:text-36 font-display font-bold text-gold">31+</div>
              <div className="text-10 md:text-11 tracking-wider text-slate-400 font-bold uppercase mt-1">
                {lang === 'hi' ? 'सेवा के वर्ष' : 'Years of Trust'}
              </div>
            </div>
            <div>
              <div className="text-28 md:text-36 font-display font-bold text-gold">5000+</div>
              <div className="text-10 md:text-11 tracking-wider text-slate-400 font-bold uppercase mt-1">
                {lang === 'hi' ? 'संतुष्ट परिवार' : 'Families Protected'}
              </div>
            </div>
            <div>
              <div className="text-28 md:text-36 font-display font-bold text-gold">MDRT</div>
              <div className="text-10 md:text-11 tracking-wider text-slate-400 font-bold uppercase mt-1">
                {lang === 'hi' ? 'यूएसए सदस्य' : 'USA Member'}
              </div>
            </div>
            <div>
              <div className="text-28 md:text-36 font-display font-bold text-gold">4.9★</div>
              <div className="text-10 md:text-11 tracking-wider text-slate-400 font-bold uppercase mt-1">
                {lang === 'hi' ? 'गूगल रेटिंग' : 'Google Rating'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
              {lang === 'hi' 
                ? `व्यापक सुरक्षा एवं वेल्थ समाधान ${areaData.nameHi} में`
                : `Comprehensive Wealth Solutions in ${areaData.name}`}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-[15px] leading-relaxed">
              {lang === 'hi'
                ? 'हम आपके परिवार के संपूर्ण वित्तीय भविष्य को सुरक्षित करने के लिए भारत के सर्वोत्तम बीमा विकल्पों का संयोजन करते हैं।'
                : 'Custom-tailored policy solutions blending security and high-yielding guaranteed growth curves.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: <Shield className="text-blue-500" size={24} />, title: lang === 'hi' ? 'टर्म सुरक्षा (Tech-Term)' : 'Pure Term Cover', desc: lang === 'hi' ? 'न्यूनतम दर पर सबसे बड़ा सुरक्षा कवच, आपके न रहने पर परिवार का सहारा।' : 'High economic replacement cover securing your family\'s entire runway.' },
              { icon: <Heart className="text-red-500" size={24} />, title: lang === 'hi' ? 'हेल्थ इंश्योरेंस (Star Health)' : 'Medical Floater', desc: lang === 'hi' ? '12,000+ अस्पतालों में कैशलेस इलाज, मेडिकल बिलों से 100% सुरक्षा।' : 'Cashless hospital claims and massive shields against rising healthcare costs.' },
              { icon: <Star className="text-gold" size={24} />, title: lang === 'hi' ? 'चाइल्ड फ्यूचर प्लान' : 'Child Future Fund', desc: lang === 'hi' ? 'बच्चों की उच्च शिक्षा और विवाह के लिए गारंटीड मैच्योरिटी राशि।' : 'Strategic funding for engineering, medical, or marriage milestones.' },
              { icon: <TrendingUp className="text-green-500" size={24} />, title: lang === 'hi' ? 'सिक्योर रिटायरमेंट' : 'Lifetime Pension', desc: lang === 'hi' ? 'सुरक्षित बुढ़ापे के लिए आजीवन नियमित गारंटीड मासिक पेंशन।' : 'Secure lifetime paycheck guarantees starting on the first day of retirement.' },
              { icon: <Award className="text-purple-500" size={24} />, title: lang === 'hi' ? 'प्रीमियम वेल्थ (ULIP)' : 'Premium Savings', desc: lang === 'hi' ? 'शानदार मार्केट-लिंक्ड निवेश + लाइफ कवर का बेहतरीन संतुलन।' : 'Double-benefit structures securing high returns paired with lifetime life cover.' },
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-gold/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 text-13 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maps & Office Info Section */}
      <section className="section-padding bg-white border-y border-slate-100">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-4.5 py-1.5 text-xs font-bold tracking-wider uppercase mb-5 text-navy/70">
                📍 {lang === 'hi' ? 'हमारा मुख्य कार्यालय' : 'Our Office'}
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-900 leading-tight mb-5">
                {lang === 'hi' ? 'विजय चौक कार्यालय में आपका स्वागत है' : 'Visit Our Main Office at Vijay Chowk'}
              </h2>
              <p className="text-slate-500 text-sm md:text-[15px] leading-relaxed mb-6 font-medium">
                {lang === 'hi'
                  ? `${areaData.nameHi} के निवासियों के लिए, हमारा विजय चौक कार्यालय केवल थोड़ी ही दूरी पर है। एडी मॉल कंपाउंड में व्यक्तिगत मिलकर सलाह लें या अपनी पॉलिसी संबंधी समस्याओं का समाधान पाएं।`
                  : `For residents of ${areaData.name}, our central office located at AD Mall Compound, Vijay Chowk is highly accessible. Stop by for direct consultation or instant policy premium processing.`}
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-navy shrink-0 font-bold">📍</div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy">{lang === 'hi' ? 'पता' : 'Address'}</h4>
                    <p className="text-slate-500 text-13 mt-0.5">AD Mall Compound, Vijay Chowk, Gorakhpur, U.P. 273001</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-navy shrink-0"><Phone size={18} /></div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy">{lang === 'hi' ? 'फोन नंबर' : 'Phone'}</h4>
                    <p className="text-slate-500 text-13 mt-0.5">Ajay Kumar Poddar: +91 {ADVISOR_PHONE}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href="https://www.google.com/maps/search/AD+Mall+Compound+Vijay+Chowk+Gorakhpur+273001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors duration-200"
                >
                  {lang === 'hi' ? 'गूगल मैप्स पर देखें' : 'View on Google Maps'} →
                </a>
              </div>
            </div>
            
            <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-md aspect-video relative h-[320px] bg-slate-100">
              <iframe
                title="Poddar Wealth AD Mall Compound Vijay Chowk Gorakhpur Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.9056637380963!2d83.371286!3d26.747376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39914443194a28d5%3A0xf6a84f3e6955fc18!2sVijay%20Chowk%2C%20Gorakhpur%2C%20Uttar%20Pradesh%20273001!5e0!3m2!1sen!2sin!4v1717200000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-100 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display font-bold text-22 text-slate-900 mb-2">
            {lang === 'hi' ? `व्हाट्सएप पर अजय सर से सीधे सलाह लें (${areaData.nameHi})` : `Connect on WhatsApp for ${areaData.name} Area`}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {lang === 'hi' ? 'बिना किसी परेशानी के त्वरित प्रतिक्रिया के लिए अजय सर को व्हाट्सएप पर सवाल भेजें।' : 'Send a secure text directly to Ajay sir on WhatsApp for an instant response.'}
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c45a] text-white font-bold h-12 px-8 rounded-full shadow-lg transition-all active:scale-[0.98]"
          >
            {lang === 'hi' ? `व्हाट्सएप पर अजय सर (${ADVISOR_PHONE})` : `Chat with Ajay sir (${ADVISOR_PHONE})`}
          </a>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="section-padding bg-slate-50" id="lead-form">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
                  {lang === 'hi' ? 'मुफ्त जीवन बीमा एवं वेल्थ रिव्यू' : 'Free Insurance & Wealth Review'}
                </h2>
                <p className="text-slate-500">
                  {lang === 'hi' 
                    ? `नीचे दिया गया फॉर्म भरें और अजय सर आपसे ${areaData.nameHi} के लिए संपर्क करेंगे।`
                    : `Fill this form and Ajay sir will get in touch with you for ${areaData.name} area.`}
                </p>
              </div>

              <BaseLeadForm
                fields={fields}
                intent={`location-${areaData.slug}`}
                submitText={lang === 'hi' ? 'मुफ्त परामर्श अनुरोध भेजें' : 'Get My Free Review →'}
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
