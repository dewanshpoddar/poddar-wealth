'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Heart, 
  PhoneCall, 
  Award, 
  MapPin, 
  Calendar,
  Users,
  Briefcase,
  Trophy,
  Star,
  Camera,
  Medal,
  Globe,
  Gem
} from 'lucide-react'

export default function AboutPage() {
  const { t, lang } = useLang()

  const stats = [
    { num: '31+', label: lang === 'en' ? 'Years of Excellence' : 'उत्कृष्टता के वर्ष', icon: <Calendar className="text-gold" size={24} /> },
    { num: '5000+', label: lang === 'en' ? 'Protected Families' : 'सुरक्षित परिवार', icon: <Users className="text-blue-400" size={24} /> },
    { num: 'MDRT', label: lang === 'en' ? 'USA Member' : 'यूएसए सदस्य', icon: <Award className="text-gold" size={24} /> },
    { num: '₹500Cr+', label: lang === 'en' ? 'Claims Assisted' : 'दावे सहायता', icon: <Briefcase className="text-green-500" size={24} /> }
  ]

  const timeline = [
    { year: '1994', title: 'The Vision Begins', desc: 'Ajay Kumar Poddar started his journey to redefine family protection in Gorakhpur.' },
    { year: '2005', title: 'MDRT Recognition', desc: 'First induction into the Million Dollar Round Table, USA — the gold standard in insurance.' },
    { year: '2015', title: 'Chairman\'s Club', desc: 'Inducted into the premier LIC Chairman\'s Club, recognizing top-tier performance in India.' },
    { year: '2024', title: '30+ Year Legacy', desc: 'Protecting 5,000+ families with ₹500Cr+ in wealth and security managed.' }
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
      {/* ═══ IMPROVISED MATERIAL HERO ═══ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy -z-0 skew-x-[-12deg] translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-6">
                <Star className="text-gold fill-gold" size={14} />
                <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em]">Established 1994</span>
              </div>
              
              <h1 className="text-[42px] lg:text-[64px] font-display font-bold text-slate-900 leading-[1.05] tracking-tight mb-8">
                31 Years of <span className="italic font-normal text-gold">Proven</span> <br /> 
                Institutional Legacy
              </h1>
              
              <p className="text-16 lg:text-18 text-slate-500 leading-relaxed max-w-xl mb-10">
                Building financial fortresses for Gorakhpur families since 1994. We don&apos;t just sell insurance; we secure your life&apos;s most precious work with 31 years of on-ground trust.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact" className="px-8 py-4 bg-navy text-white rounded-full font-bold shadow-xl hover:bg-navy-light transition-all hover:-translate-y-1">
                  Connect with Ajay Sir
                </Link>
                <div className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-14 font-semibold text-slate-600">Available Today</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Abstract Material Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:block"
            >
               <div className="relative w-full aspect-square max-w-[500px] ml-auto">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-2xl rotate-3" />
                  <div className="absolute inset-4 bg-white/10 backdrop-blur-2xl rounded-[60px] border border-white/10 shadow-2xl -rotate-3" />
                  
                  <div className="absolute inset-0 flex flex-col justify-center p-12">
                     <div className="grid grid-cols-2 gap-8">
                        {stats.map((stat, i) => (
                           <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/20 hover:bg-white/10 transition-colors">
                              {stat.icon}
                              <div className="text-32 font-display font-bold text-white mt-4">{stat.num}</div>
                              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">{stat.label}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══ FOUNDER SPOTLIGHT (MATERIAL CARD STYLE) ═══ */}
      <section className="py-24 bg-warm relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="bg-white/60 backdrop-blur-xl border border-gold/10 rounded-[48px] p-8 lg:p-16 shadow-4xl">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              <div className="lg:col-span-5">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-[3/4] w-full max-w-[400px] mx-auto rounded-[40px] bg-slate-900 border border-gold/10 shadow-2xl overflow-hidden group"
                >
                  <Image
                    src="/assets/ajay-poddar.svg"
                    alt="Ajay Kumar Poddar"
                    fill
                    className="object-cover object-top scale-[1.25] origin-top transition-transform duration-700 group-hover:scale-[1.3]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60" />
                </motion.div>
                
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                   <div className="px-5 py-2 bg-gold/5 border border-gold/20 rounded-full text-[11px] font-bold text-gold uppercase tracking-widest">
                     MDRT USA Member
                   </div>
                   <div className="px-5 py-2 bg-gold/5 border border-gold/20 rounded-full text-[11px] font-bold text-gold uppercase tracking-widest">
                     Chairman&apos;s Club
                   </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-12 h-px bg-gold" />
                    <span className="text-[12px] font-bold text-gold uppercase tracking-[0.3em]">The Heart of Poddar Wealth</span>
                  </div>
                  
                  <h2 className="text-42 font-display font-bold text-navy mb-8">Ajay Kumar Poddar</h2>
                  
                  <div className="space-y-6 text-18 text-slate-600 leading-relaxed italic">
                    <p className="not-italic font-medium text-slate-800">
                      Based at AD Mall Compound, Vijay Chowk, Gorakhpur — the heart of Eastern UP — Ajay Kumar Poddar has been helping families secure their future since 1994.
                    </p>
                    <p className="border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-2xl">
                      &ldquo;My mission is not to sell policies, but to build financial fortresses for families who trust us with their life&apos;s work.&rdquo;
                    </p>
                    <p className="not-italic text-16 text-slate-500">
                      With over three decades of experience, he is one of the most decorated LIC agents in Uttar Pradesh, recognized by the Million Dollar Round Table (MDRT, USA).
                    </p>
                  </div>

                  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Service Area</div>
                        <div className="text-14 font-bold text-navy">Gorakhpur, Eastern UP</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                        <Trophy size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Experience</div>
                        <div className="text-14 font-bold text-navy">31+ Years Excellence</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ RESTORED LEGACY TIMELINE ═══ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">Chronological Excellence</span>
            <h2 className="text-36 font-display font-bold text-navy mt-2">31 Years of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-gold/30 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className="text-32 font-display font-bold text-gold/30 mb-4">{item.year}</div>
                <h3 className="text-20 font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-14 text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
                {i < timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-[25%] -right-4 w-8 h-px bg-gold/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUES IN FOCUS ═══ */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-42 md:text-56 font-display font-bold text-slate-900 mb-6 tracking-tighter">
               {t.about.valuesTitle}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-18">The principles that have guided us for three decades.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.about.values.map((v: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[48px] bg-white border border-slate-100 hover:border-gold/30 hover:shadow-4xl transition-all group"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 shadow-md group-hover:scale-110 group-hover:bg-gold/5 transition-all">
                  {valuesIcons[i]}
                </div>
                <h3 className="text-22 font-bold text-slate-900 mb-6 tracking-tight">{v.title}</h3>
                <p className="text-15 text-slate-500 leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOLD INSTITUTIONAL BADGES ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-32">
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                <div className="text-36 md:text-48 font-display font-bold text-navy">MDRT USA</div>
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-900">Highest Global Quality</div>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                <div className="text-36 md:text-48 font-display font-bold text-navy">LIC CHAIRMAN&apos;S</div>
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-900">Premier Club Member</div>
             </motion.div>
             <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                <div className="text-36 md:text-48 font-display font-bold text-navy leading-none">IRDAI</div>
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-900">Registered Authority</div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MEMORY LANE (35MM STRIPS) ═══ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-[200%]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/film-grain.png")' }} />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4 text-gold/60">
            <Camera size={20} />
            <span className="text-[12px] font-bold uppercase tracking-[0.4em]">Memory Lane</span>
          </div>
          <h2 className="text-36 font-display font-bold text-navy tracking-tight">31 Years of <span className="text-gold">Life&apos;s Work</span></h2>
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
                <div key={i} className="relative w-[300px] aspect-[4/3] bg-navy-deep overflow-hidden group/frame border-x-[8px] border-black shadow-2xl">
                   <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-1000 group-hover/frame:scale-110 grayscale hover:grayscale-0" />
                   <div className="absolute top-4 left-4 right-4 text-[10px] text-white/50 font-bold uppercase tracking-widest pointer-events-none">{item.label}</div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none group-hover/frame:opacity-0 transition-opacity" />
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
                <div key={i} className="relative w-[300px] aspect-[4/3] bg-navy-deep overflow-hidden group/frame border-x-[8px] border-black shadow-2xl">
                   <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-1000 group-hover/frame:scale-110 grayscale hover:grayscale-0" />
                   <div className="absolute top-4 left-4 right-4 text-[10px] text-white/50 font-bold uppercase tracking-widest pointer-events-none">{item.label}</div>
                   <div className="absolute inset-0 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none group-hover/frame:opacity-0 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* FINAL CTA STRIP */}
      <section className="bg-gold py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full -z-0" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
           <div className="text-center md:text-left">
              <h3 className="text-32 font-display font-bold text-navy mb-4 tracking-tight">Ready to plan your family&apos;s future?</h3>
              <p className="text-navy/60 text-16 font-medium">Book a direct, obligation-free consultation with Mr. Ajay Poddar.</p>
           </div>
           <Link href="/contact" className="h-16 px-12 bg-navy text-white rounded-full flex items-center justify-center font-bold text-18 gap-3 hover:bg-navy-light transition-all shadow-2xl hover:-translate-y-1">
              Start Your Journey Now
              <ArrowRight size={24} />
           </Link>
        </div>
      </section>
    </div>
  )
}
