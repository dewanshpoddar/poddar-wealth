'use client'

import dynamic from 'next/dynamic'

const TestimonialsSection = dynamic(
  () => import('@/components/TestimonialsSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import {
  ShieldCheck,
  Eye,
  Heart,
  PhoneCall,
  MapPin,
  Trophy,
  Star,
  Camera,
  Sparkles,
} from 'lucide-react'

export default function AboutPage() {
  const { t, lang } = useLang()
  const isHi = lang === 'hi'

  const stats = [
    { num: '31+', label: lang === 'en' ? 'Years Professional' : 'पेशेवर साल' },
    { num: '5000+', label: lang === 'en' ? 'Families Protected' : 'सुरक्षित परिवार' },
    { num: 'MDRT', label: lang === 'en' ? 'USA Member' : 'यूएसए सदस्य' },
    { num: '₹500Cr+', label: lang === 'en' ? 'Claims Assisted' : 'दावे सहायता' }
  ]



  const filmStrip1 = [
    { src: '/assets/legacy-award-1994.webp', label: '1994 MDRT Success' },
    { src: '/assets/team-mentorship.webp', label: 'Mentoring 2024' },
    { src: '/assets/gorakhpur-office-render.webp', label: 'Institutional Trust' },
    { src: '/assets/hero-family.webp', label: 'Family Protection' },
    { src: '/assets/hero-education.webp', label: 'Child Future' },
    { src: '/assets/hero-marriage.webp', label: 'Goal Planning' },
  ]

  const filmStrip2 = [
    { src: '/assets/gorakhpur-office-render.webp', label: 'Vijay Chowk HQ' },
    { src: '/assets/hero-retirement.webp', label: 'Legacy Wealth' },
    { src: '/assets/hero-health.webp', label: 'Health Security' },
    { src: '/assets/legacy-award-1994.webp', label: '31-Year Dedication' },
    { src: '/assets/hero-family.webp', label: 'Core Values' },
  ]

  const valuesIcons = [
    <ShieldCheck key="1" className="text-blue-600" size={32} />,
    <Eye key="2" className="text-amber-500" size={32} />,
    <Trophy key="3" className="text-red-500" size={32} />,
    <Sparkles key="4" className="text-violet-500" size={32} />
  ]


  return (
    <div className="bg-white">
      
      {/* ═══ MINIMALIST LUXURY HERO (CLIPPED FIX) ═══ */}
      <section className="relative overflow-hidden bg-warm/30 pt-16 pb-16 lg:pt-24 lg:pb-24 border-b border-gold/5">
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="flex flex-col justify-center animate-fade-up">
              
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-gold font-bold uppercase mb-4">
                <span className="w-7 h-px bg-gold inline-block" />
                {isHi ? 'प्रमाणित संस्थागत विरासत' : 'Proven Institutional Legacy'}
              </div>
              
              <h1 className="font-display text-[30px] md:text-[36px] lg:text-[44px] font-normal italic leading-[1.2] text-slate-900 mb-1">
                {isHi ? (
                  <>
                    गोरखपुर के परिवारों को <br />
                    <span className="font-bold text-gold not-italic">31 वर्षों से सुरक्षित</span> कर रहे हैं
                  </>
                ) : (
                  <>
                    Protecting Gorakhpur <br />
                    <span className="font-bold text-gold not-italic">Families for 31 Years</span>
                  </>
                )}
              </h1>
              
              <p className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed max-w-[420px] mt-6 font-medium">
                {isHi 
                  ? 'गोरखपुर और पूर्वी यूपी के परिवारों को सुरक्षित करने के 31 वर्ष — उस पुरस्कार विजेता, व्यक्तिगत मार्गदर्शन के साथ जिस पर आप हमेशा भरोसा कर सकते हैं।'
                  : "31 years of protecting families across Gorakhpur and Eastern UP — with award-winning, personal advisory you can always count on."}
              </p>
            </div>

            {/* Right: Institutional Visual Frame */}
            <div className="relative lg:block hidden animate-fade-scale-in">
               <div className="relative w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white bg-gray-100 group">
                  <Image
                    src="/assets/gorakhpur-office-render.webp"
                    alt="Gorakhpur Office Render"
                    fill
                    className="object-cover"
                  />
                  
                  <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex flex-col items-center justify-center text-center p-2 z-10">
                     <Star size={12} className="text-gold fill-gold mb-1" />
                     <div className="text-[8px] font-bold text-white uppercase tracking-[0.2em] leading-tight">
                       {isHi ? <>1994 <br/> से</> : <>Since <br/> 1994</>}
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ NEW: FULL-WIDTH INSTITUTIONAL TRUST BAR ═══ */}
      <section className="bg-white border-b border-gold/10 py-6 relative z-20">
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-row flex-wrap justify-between items-center gap-y-6">
               {stats.map((stat, i) => (
                  <div key={i} className="flex items-center group">
                    <div className="flex flex-col">
                       <div className="font-display text-[18px] md:text-22 font-bold text-slate-900 leading-none group-hover:text-gold transition-colors">{stat.num}</div>
                       <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">{stat.label}</div>
                    </div>
                    {i < stats.length - 1 && (
                      <div className="h-8 w-px bg-gold/10 mx-8 lg:mx-16 hidden md:block" />
                    )}
                  </div>
               ))}
            </div>
            <div className="mt-4 text-left">
              <p className="text-[10px] text-slate-400 italic">
                {isHi 
                  ? '*दावा सहायता आंकड़े 1994 से सेवा की गई सभी पॉलिसियों के कुल संचयी हैं।'
                  : '*Claims Assisted statistic is cumulative across all policies serviced since 1994.'}
              </p>
            </div>
         </div>
      </section>

      {/* ═══ LUXURY FOUNDER SPOTLIGHT (MINIMALIST) ═══ */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="bg-slate-50 border border-slate-100 rounded-[48px] p-8 lg:p-14 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              <div className="lg:col-span-12 xl:col-span-5">
                <div className="relative aspect-[3/4] w-full max-w-[380px] mx-auto xl:mx-0 rounded-[40px] bg-gray-100 border border-slate-200 shadow-md overflow-hidden group animate-fade-up">
                  <Image
                    src="/assets/ajay-poddar.svg"
                    alt="Ajay Kumar Poddar"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/5 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
                
                <div className="mt-8 flex flex-wrap justify-center xl:justify-start gap-3">
                   <div className="px-4 py-2 border border-gold/20 rounded-full flex items-center gap-2">
                     <Image src="/assets/mdrt-seeklogo.svg" alt="MDRT" width={20} height={20} className="object-contain flex-shrink-0" />
                     <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                       {isHi ? 'MDRT यूएसए सदस्य' : 'MDRT USA Member'}
                     </span>
                   </div>
                   <div className="px-4 py-2 border border-gold/20 rounded-full flex items-center gap-2">
                     <Image src="/assets/chairmanclub.webp" alt="Chairman's Club" width={20} height={20} className="object-contain flex-shrink-0" />
                     <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                       {isHi ? 'चेयरमैन क्लब' : "Chairman's Club"}
                     </span>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-12 xl:col-span-7">
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-px bg-gold" />
                    <span className="text-[11px] font-bold text-gold uppercase tracking-[0.3em]">
                      {isHi ? 'सलाहकार से मिलें' : 'Meet Your Advisor'}
                    </span>
                  </div>
                  
                  <h2 className="text-[28px] md:text-[32px] font-display font-bold text-navy mb-8 leading-tight">
                    {t.founderStory?.signature || (isHi ? 'श्री अजय कुमार पोद्दार' : 'Mr. Ajay Kumar Poddar')}
                  </h2>
                  
                  <div className="space-y-6 text-[15px] md:text-[16px] text-slate-600 leading-relaxed">
                    {(t.founderStory?.story || '').split('\n\n').filter(Boolean).map((para: string, idx: number) => (
                      <p 
                        key={idx} 
                        className={
                          idx === 1 
                            ? "border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-xl italic font-serif text-slate-700" 
                            : idx === 0 
                              ? "font-medium text-slate-800" 
                              : "text-[14px] text-slate-500"
                        }
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
                          {isHi ? 'सेवा क्षेत्र' : 'Service Area'}
                        </div>
                        <div className="text-[14px] font-bold text-navy">
                          {isHi ? 'गोरखपुर, पूर्वी यूपी' : 'Gorakhpur, Eastern UP'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold">
                        <Trophy size={20} />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Experience</div>
                        <div className="text-[14px] font-bold text-navy">31+ Years Excellence</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ VERTICAL TIMELINE ═══ */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {(() => {
            const timelineData = t.aboutTimeline || {
              title: 'The Legacy Timeline',
              subtitle: '31-Year Chronology',
              items: []
            }
            return (
              <>
                <div className="text-center mb-16">
                  <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">
                    {timelineData.subtitle}
                  </span>
                  <h2 className="text-[26px] md:text-[32px] font-display font-bold text-navy leading-tight">
                    {timelineData.title}
                  </h2>
                </div>

                <div className="relative mt-12">
                  {/* Vertical Line */}
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gold/20 -translate-x-[1px]" />

                  <div className="space-y-12">
                    {(timelineData.items || []).map((item: any, i: number) => {
                      const isEven = i % 2 === 0
                      return (
                        <div
                          key={i}
                          className={`flex flex-col md:flex-row relative items-start md:items-center ${
                            isEven ? 'md:flex-row-reverse' : ''
                          }`}
                        >
                          {/* Circle Dot with pulse */}
                          <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-white border-2 border-gold flex items-center justify-center -translate-x-3 z-20">
                            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                          </div>

                          {/* Card */}
                          <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-[28px] shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 group">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-gold font-bold text-xs tracking-wider uppercase">
                                  {item.year}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gold/30 hidden sm:inline" />
                                <h4 className="text-[14px] font-bold text-navy leading-snug group-hover:text-gold transition-colors">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          {/* Empty spacer for desktop alignment */}
                          <div className="hidden md:block w-1/2" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </section>

      {/* ═══ VALUES IN FOCUS (REDUCED PADDING) ═══ */}
      {(() => {
        const coreValues = t.aboutCoreValues || {
          title: lang === 'en' ? 'Our Core Values' : 'हमारे मूल मूल्य',
          subtitle: lang === 'en' ? 'Guiding Principles' : 'मार्गदर्शक सिद्धांत',
          items: [
            { title: lang === 'en' ? 'Trust' : 'भरोसा (Trust)', desc: lang === 'en' ? 'Your policy is our promise' : 'आपकी पॉलिसी हमारा वादा है' },
            { title: lang === 'en' ? 'Transparency' : 'पारदर्शिता (Transparency)', desc: lang === 'en' ? 'No hidden charges, ever' : 'कोई छिपा हुआ शुल्क नहीं, कभी भी' },
            { title: lang === 'en' ? 'Tradition' : 'परंपरा (Tradition)', desc: lang === 'en' ? 'Three decades of on-ground service' : 'तीन दशकों की ऑन-ग्राउंड सेवा' },
            { title: lang === 'en' ? 'Technology' : 'तकनीक (Technology)', desc: lang === 'en' ? 'Modern tools, traditional values' : 'आधुनिक उपकरण, पारंपरिक मूल्य' }
          ]
        }
        return (
          <section className="py-16 md:py-20 bg-slate-50 relative border-t border-gold/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">
                  {coreValues.subtitle}
                </span>
                <h2 className="text-[28px] md:text-[32px] font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                  {coreValues.title}
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-[14px] md:text-[15px]">
                  {lang === 'en' ? 'The principles that have guided us for three decades.' : 'वे सिद्धांत जिन्होंने तीन दशकों से हमारा मार्गदर्शन किया है।'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(coreValues.items || []).map((v: any, i: number) => (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="p-8 rounded-[36px] bg-white border border-slate-200 hover:border-gold/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group animate-fade-up"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-gold/5 transition-all">
                      {valuesIcons[i]}
                    </div>
                    <h3 className="text-[18px] font-bold text-slate-900 mb-3 tracking-tight leading-snug">{v.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ═══ INSTITUTIONAL CREDENTIALS GRID ═══ */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">
              {lang === 'en' ? 'HONORS & CREDENTIALS' : 'सम्मान और साख'}
            </span>
            <h2 className="text-[28px] md:text-[32px] font-display font-bold text-navy leading-tight">
              {lang === 'en' ? 'Professional Recognitions' : 'व्यावसायिक मान्यताएं'}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* MDRT */}
            <div 
              className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center justify-between group hover:shadow-lg hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <Image src="/assets/mdrt-seeklogo.svg" alt="MDRT USA" width={110} height={56} className="object-contain" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-navy mb-1">
                  {lang === 'en' ? 'MDRT USA Member' : 'MDRT यूएसए सदस्य'}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {lang === 'en' ? 'Qualified Since 2010' : '2010 से अर्हता प्राप्त'}
                </p>
              </div>
            </div>

            {/* Chairman's Club */}
            <div 
              className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center justify-between group hover:shadow-lg hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <Image src="/assets/chairmanclub.webp" alt="LIC Chairman's Club" width={130} height={56} className="object-contain" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-navy mb-1">
                  {lang === 'en' ? "Chairman's Club" : 'चेयरमैन क्लब'}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {lang === 'en' ? 'Member Since 2015' : '2015 से सदस्य'}
                </p>
              </div>
            </div>

            {/* 31 Years */}
            <div 
              className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center justify-between group hover:shadow-lg hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-display font-bold text-gold text-2xl group-hover:bg-gold group-hover:text-white transition-all duration-300 shadow-sm">
                  31
                </div>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-navy mb-1">
                  {lang === 'en' ? 'Advisory Excellence' : 'सलाहकार उत्कृष्टता'}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {lang === 'en' ? 'Established 1994' : '1994 से स्थापित'}
                </p>
              </div>
            </div>

            {/* 5000+ Families */}
            <div 
              className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center justify-between group hover:shadow-lg hover:border-gold/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-display font-bold text-gold text-lg group-hover:bg-gold group-hover:text-white transition-all duration-300 shadow-sm">
                  5K+
                </div>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-navy mb-1">
                  {lang === 'en' ? 'Families Protected' : 'सुरक्षित परिवार'}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {lang === 'en' ? 'Active Protection' : 'सक्रिय सुरक्षा'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODO: Replace with real photos from Ajay sir */}
      {/* ═══ MEMORY LANE (35MM STRIPS) ═══ */}
      <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-[200%]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/film-grain.png")' }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 text-gold/60">
            <Camera size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              {isHi ? 'स्मृतियों के गलियारे से' : 'Memory Lane'}
            </span>
          </div>
          <h2 className="text-[28px] font-display font-bold text-navy tracking-tight leading-tight">
            {isHi ? (
              <>
                जीवन पर्यन्त सेवा के <span className="text-gold">31 वर्ष</span>
              </>
            ) : (
              <>
                31 Years of <span className="text-gold">Life&apos;s Work</span>
              </>
            )}
          </h2>
        </div>

        <div className="relative group/reel mb-1">
          <div className="absolute top-0 left-0 right-0 h-8 bg-black border-b border-white/10 z-20 flex items-center gap-1.5 px-1 overflow-hidden opacity-80">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="w-4 h-5 bg-white/10 rounded-sm flex-shrink-0" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black border-t border-white/10 z-20 flex items-center gap-1.5 px-1 overflow-hidden opacity-80">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="w-4 h-5 bg-white/10 rounded-sm flex-shrink-0" />
            ))}
          </div>
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-4 py-8 group-hover/reel:[animation-play-state:paused]" style={{ animationDirection: 'reverse', animationDuration: '40s' }}>
              {filmStrip1.concat(filmStrip1).map((item, i) => (
                <div key={i} className="relative w-[200px] sm:w-[280px] aspect-[4/3] bg-navy-deep overflow-hidden group/frame border-x-[8px] border-black shadow-xl">
                   <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-1000 group-hover/frame:scale-110 grayscale hover:grayscale-0" />
                   <div className="absolute top-4 left-4 right-4 text-[9px] text-white/50 font-bold uppercase tracking-widest pointer-events-none">{item.label}</div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group/reel2">
          <div className="absolute top-0 left-0 right-0 h-8 bg-black border-b border-white/10 z-20 flex items-center gap-1.5 px-1 overflow-hidden opacity-80">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="w-4 h-5 bg-white/10 rounded-sm flex-shrink-0" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black border-t border-white/10 z-20 flex items-center gap-1.5 px-1 overflow-hidden opacity-80">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="w-4 h-5 bg-white/10 rounded-sm flex-shrink-0" />
            ))}
          </div>
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-4 py-8 group-hover/reel2:[animation-play-state:paused]" style={{ animationDuration: '45s' }}>
              {filmStrip2.concat(filmStrip2).map((item, i) => (
                <div key={i} className="relative w-[200px] sm:w-[280px] aspect-[4/3] bg-navy-deep overflow-hidden group/frame border-x-[8px] border-black shadow-xl">
                   <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-1000 group-hover/frame:scale-110 grayscale hover:grayscale-0" />
                   <div className="absolute top-4 left-4 right-4 text-[9px] text-white/50 font-bold uppercase tracking-widest pointer-events-none">{item.label}</div>
                   <div className="absolute inset-0 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Reviews Widget */}
      <TestimonialsSection />
      
      {/* FINAL CTA STRIP */}
      <section className="bg-gold py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full -z-0" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="text-center md:text-left">
              <h3 className="text-[24px] md:text-[28px] font-display font-bold text-navy mb-2 tracking-tight leading-tight">
                {isHi ? 'अपने परिवार का भविष्य प्लान करने के लिए तैयार हैं?' : "Ready to plan your family's future?"}
              </h3>
              <p className="text-navy/60 text-[14px] font-medium">
                {isHi ? 'श्री अजय कुमार पोद्दार के साथ सीधे परामर्श बुक करें।' : 'Book a direct consultation with Mr. Ajay Poddar.'}
              </p>
           </div>
           <Link href="/contact" className="h-12 md:h-14 px-8 md:px-10 bg-navy text-white rounded-full flex items-center justify-center font-bold text-[14px] md:text-[15px] gap-3 hover:bg-navy-light transition-all shadow-xl hover:-translate-y-1 text-center">
              {isHi ? 'अभी अपनी यात्रा शुरू करें →' : 'Start Your Journey Now →'}
           </Link>
        </div>
      </section>
    </div>
  )
}
