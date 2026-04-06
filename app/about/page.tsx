'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { 
  ShieldCheck, 
  Eye, 
  Heart, 
  PhoneCall, 
  MapPin, 
  Calendar,
  Users,
  Briefcase,
  Trophy,
  Star,
  Camera,
  ArrowDown,
  ArrowUp
} from 'lucide-react'

export default function AboutPage() {
  const { t, lang } = useLang()

  const stats = [
    { num: '31+', label: lang === 'en' ? 'Years Professional' : 'पेशेवर साल' },
    { num: '5000+', label: lang === 'en' ? 'Families Protected' : 'सुरक्षित परिवार' },
    { num: 'MDRT', label: lang === 'en' ? 'USA Member' : 'यूएसए सदस्य' },
    { num: '₹500Cr+', label: lang === 'en' ? 'Claims Assisted' : 'दावे सहायता' }
  ]

  const timeline = [
    { year: '1994', title: 'The Vision Begins', desc: 'Ajay Kumar Poddar started his journey to redefine family protection in Gorakhpur.' },
    { year: '2005', title: 'MDRT Recognition', desc: 'First induction into the Million Dollar Round Table, USA — the gold standard.' },
    { year: '2015', title: 'Chairman\'s Club', desc: 'Inducted into the premier LIC Chairman\'s Club for top-tier Indian performance.' },
    { year: '2024', title: '31yr Legacy', desc: 'Protecting 5,000+ families with ₹500Cr+ in wealth and security managed.' }
  ]

  const filmStrip1 = [
    { src: '/assets/legacy-award-1994.png', label: '1994 MDRT Success' },
    { src: '/assets/team-mentorship.png', label: 'Mentoring 2024' },
    { src: '/assets/gorakhpur-office-render.png', label: 'Institutional Trust' },
    { src: '/assets/hero-family.png', label: 'Family Protection' },
    { src: '/assets/hero-education.png', label: 'Child Future' },
    { src: '/assets/hero-marriage.png', label: 'Goal Planning' },
    { src: '/assets/legacy-award-1994.png', label: 'Founding Mission' },
    { src: '/assets/team-mentorship.png', label: 'Team Excellence' },
  ]

  const filmStrip2 = [
    { src: '/assets/gorakhpur-office-render.png', label: 'Vijay Chowk HQ' },
    { src: '/assets/hero-retirement.png', label: 'Legacy Wealth' },
    { src: '/assets/hero-health.png', label: 'Health Security' },
    { src: '/assets/legacy-award-1994.png', label: '31yr Dedication' },
    { src: '/assets/team-mentorship.png', label: 'Global MDRT' },
    { src: '/assets/gorakhpur-office-render.png', label: 'Financial Fortress' },
    { src: '/assets/hero-family.png', label: 'Core Values' },
    { src: '/assets/team-mentorship.png', label: 'Chairman\'s Club' },
  ]

  const valuesIcons = [
    <ShieldCheck key="1" className="text-blue-500" size={32} />,
    <Eye key="2" className="text-gold" size={32} />,
    <Heart key="3" className="text-red-500" size={32} />,
    <PhoneCall key="4" className="text-green-500" size={32} />
  ]

  return (
    <div className="bg-white">
      
      {/* ═══ MINIMALIST LUXURY HERO (CLIPPED FIX) ═══ */}
      <section className="relative overflow-hidden bg-warm/30 pt-12 pb-12 lg:pt-24 lg:pb-24 border-b border-gold/5">
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="flex flex-col justify-center animate-fade-up">
              
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-gold font-bold uppercase mb-4">
                <span className="w-7 h-px bg-gold inline-block" />
                Proven Institutional Legacy
              </div>
              
              <h1 className="font-display text-[30px] md:text-[36px] lg:text-[44px] font-normal italic leading-[1.2] text-slate-900 mb-1">
                31 Years of <br />
                <span className="font-bold text-gold not-italic">Institutional Trust</span>
              </h1>
              
              <p className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed max-w-[420px] mt-6 font-medium">
                Building financial fortresses for Gorakhpur families since 1994. We secure your life&apos;s most precious work with three decades of on-ground excellence and Million Dollar Round Table (USA) credentials.
              </p>
            </div>

            {/* Right: Institutional Visual Frame */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative lg:block hidden"
            >
               <div className="relative w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white group">
                  <Image 
                    src="/assets/gorakhpur-office-render.png" 
                    alt="Poddar Wealth Gorakhpur Headquarters" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex flex-col items-center justify-center text-center p-2">
                     <Star size={12} className="text-gold fill-gold mb-1" />
                     <div className="text-[8px] font-bold text-white uppercase tracking-[0.2em] leading-tight">Since <br/> 1994</div>
                  </div>
               </div>
            </motion.div>

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
         </div>
      </section>

      {/* ═══ LUXURY FOUNDER SPOTLIGHT (MINIMALIST) ═══ */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="bg-slate-50 border border-slate-100 rounded-[48px] p-8 lg:p-14 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              <div className="lg:col-span-12 xl:col-span-5">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-[3/4] w-full max-w-[380px] mx-auto xl:mx-0 rounded-[40px] bg-slate-900 border border-gold/10 shadow-xl overflow-hidden group"
                >
                  <Image
                    src="/assets/ajay-poddar.svg"
                    alt="Ajay Kumar Poddar"
                    fill
                    className="object-top scale-[1.25] origin-top transition-transform duration-700 group-hover:scale-[1.3] object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-60" />
                </motion.div>
                
                <div className="mt-8 flex flex-wrap justify-center xl:justify-start gap-3">
                   <div className="px-5 py-2 border border-gold/20 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest">
                     MDRT USA Member
                   </div>
                   <div className="px-5 py-2 border border-gold/20 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest">
                     Chairman&apos;s Club
                   </div>
                </div>
              </div>

              <div className="lg:col-span-12 xl:col-span-7">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-px bg-gold" />
                    <span className="text-[11px] font-bold text-gold uppercase tracking-[0.3em]">Institutional Presence</span>
                  </div>
                  
                  <h2 className="text-[28px] md:text-[32px] font-display font-bold text-navy mb-8 leading-tight">Mr. Ajay Kumar Poddar</h2>
                  
                  <div className="space-y-6 text-[15px] md:text-[16px] text-slate-600 leading-relaxed italic">
                    <p className="not-italic font-medium text-slate-800">
                      Based at AD Mall Compound, Vijay Chowk, Gorakhpur — the heart of Eastern UP — Ajay Kumar Poddar has been helping families secure their future since 1994.
                    </p>
                    <p className="border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-xl">
                      &ldquo;My mission is not to sell policies, but to build financial fortresses for families who trust us with their life&apos;s work.&rdquo;
                    </p>
                    <p className="not-italic text-[14px] text-slate-500">
                      With over three decades of on-ground experience, he is recognized globally by the Million Dollar Round Table (MDRT, USA) for his commitment to quality and ethical advisory.
                    </p>
                  </div>

                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Service Area</div>
                        <div className="text-[14px] font-bold text-navy">Gorakhpur, Eastern UP</div>
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
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ STRAIGHT-LINE HORIZONTAL TIMELINE ═══ */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mb-20">
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">31-Year Chronology</span>
          <h2 className="text-[28px] md:text-[32px] font-display font-bold text-navy mt-2 leading-tight">The Legacy Timeline</h2>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative overflow-x-auto pb-12 scrollbar-hide">
          <div className="min-w-[1000px] relative h-[420px] flex items-center">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gold/20 -translate-y-1/2 z-0" />
            <div className="w-full flex justify-between relative z-10 px-10">
              {timeline.map((item, i) => {
                const isTop = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative w-[220px] flex flex-col items-center ${isTop ? 'justify-end pb-[210px]' : 'justify-start pt-[210px]'}`}
                  >
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                       <h4 className="text-[16px] font-bold text-navy mb-2 group-hover:text-gold transition-colors leading-snug">{item.title}</h4>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 w-px h-[160px] bg-gold/10 ${isTop ? 'bottom-[45px]' : 'top-[45px]'}`}>
                       <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 text-gold/30 ${isTop ? 'bottom-0 translate-y-1/2 scale-x-125' : 'top-0 -translate-y-1/2 scale-x-125'}`}>
                          {isTop ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                       </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                       <div className="w-10 h-10 rounded-full bg-white border-2 border-gold flex items-center justify-center text-[13px] font-bold text-navy shadow-sm z-20">
                          {item.year.slice(-2)}
                       </div>
                       <div className="absolute -bottom-8 whitespace-nowrap text-[13px] font-bold text-gold tracking-widest">{item.year}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALUES IN FOCUS (REDUCED PADDING) ═══ */}
      <section className="py-16 md:py-20 bg-slate-50 relative border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[32px] font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">
               {t.about.valuesTitle}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-[14px] md:text-[15px]">The principles that have guided us for three decades.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.values.map((v: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[36px] bg-white border border-slate-200 hover:border-gold/20 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-gold/5 transition-all">
                   {valuesIcons[i]}
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-3 tracking-tight leading-snug">{v.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOLD INSTITUTIONAL BADGES ═══ */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24">
             <motion.div whileHover={{ y: -3 }} className="flex flex-col items-center gap-2">
                <div className="text-[28px] md:text-[34px] font-display font-bold text-navy leading-none">MDRT USA</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Highest Global Quality</div>
             </motion.div>
             <motion.div whileHover={{ y: -3 }} className="flex flex-col items-center gap-2">
                <div className="text-[28px] md:text-[34px] font-display font-bold text-navy leading-none">LIC CHAIRMAN&apos;S club</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Premier Club Member</div>
             </motion.div>
             <motion.div whileHover={{ y: -3 }} className="flex flex-col items-center gap-2">
                <div className="text-[28px] md:text-[34px] font-display font-bold text-navy leading-none">IRDAI registered</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Registered Authority</div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MEMORY LANE (35MM STRIPS) ═══ */}
      <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-[200%]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/film-grain.png")' }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 text-gold/60">
            <Camera size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Memory Lane</span>
          </div>
          <h2 className="text-[28px] font-display font-bold text-navy tracking-tight leading-tight">31 Years of <span className="text-gold">Life&apos;s Work</span></h2>
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
                <div key={i} className="relative w-[280px] aspect-[4/3] bg-navy-deep overflow-hidden group/frame border-x-[8px] border-black shadow-xl">
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
                <div key={i} className="relative w-[280px] aspect-[4/3] bg-navy-deep overflow-hidden group/frame border-x-[8px] border-black shadow-xl">
                   <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-1000 group-hover/frame:scale-110 grayscale hover:grayscale-0" />
                   <div className="absolute top-4 left-4 right-4 text-[9px] text-white/50 font-bold uppercase tracking-widest pointer-events-none">{item.label}</div>
                   <div className="absolute inset-0 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* FINAL CTA STRIP */}
      <section className="bg-gold py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full -z-0" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
           <div className="text-center md:text-left">
              <h3 className="text-[24px] md:text-[28px] font-display font-bold text-navy mb-2 tracking-tight leading-tight">Ready to plan your family&apos;s future?</h3>
              <p className="text-navy/60 text-[14px] font-medium">Book a direct consultation with Mr. Ajay Poddar.</p>
           </div>
           <Link href="/contact" className="h-12 md:h-14 px-8 md:px-10 bg-navy text-white rounded-full flex items-center justify-center font-bold text-[14px] md:text-[15px] gap-3 hover:bg-navy-light transition-all shadow-xl hover:-translate-y-1 text-center">
              Start Your Journey Now
           </Link>
        </div>
      </section>
    </div>
  )
}
