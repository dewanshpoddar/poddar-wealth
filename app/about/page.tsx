'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import LeadForm from '@/components/LeadForm'
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
  CheckCircle2
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
    { year: '2005', title: 'Global Recognition', desc: 'Qualified for the Million Dollar Round Table (MDRT, USA) for the first time.' },
    { year: '2015', title: 'Institutional Leader', desc: 'Awarded the prestigious Chairman\'s Club membership for consistent excellence.' },
    { year: 'Today', title: '31 Years of Trust', desc: 'Now serving over 5000 families with a team of professional advisors.' }
  ]

  const gallery = [
    { src: '/artifacts/gorakhpur_office_trust_1775497102678.png', title: 'Our Gorakhpur Headquarters', size: 'lg' },
    { src: '/artifacts/advisors_awards_wall_1775497127068.png', title: 'Institutional Excellence', size: 'sm' },
    { src: '/assets/hero-family.png', title: 'Protecting Every Milestone', size: 'sm' }
  ]

  const valuesIcons = [
    <ShieldCheck key="1" className="text-blue-500" size={32} />,
    <Eye key="2" className="text-gold" size={32} />,
    <Heart key="3" className="text-red-500" size={32} />,
    <PhoneCall key="4" className="text-green-500" size={32} />
  ]

  return (
    <div className="bg-white">
      {/* ═══ PREMIUM HERO ═══ */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.02] -z-0 skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 blur-[120px] rounded-full -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 border border-gold/20 rounded-full bg-gold/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em]">
              {t.about.heroSubtitle}
            </span>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-42 md:text-64 font-display font-bold text-white leading-[1.1] tracking-tight"
            >
              {lang === 'en' ? (
                <>
                  31 Years of <span className="text-gold">Proven</span> Legacy
                </>
              ) : (
                <>
                  31 वर्षों की <span className="text-gold">सिद्ध</span> विरासत
                </>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-16 md:text-20 text-white/60 leading-relaxed lg:border-l border-white/10 lg:pl-12"
            >
              Building financial fortresses for families since 1994. We are not just selling insurance; we are securing your life&apos;s most precious work.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══ LEGACY GRID: THE STORY ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-32 md:text-42 font-display font-bold text-slate-900 mb-6 tracking-tight">
                  {t.about.storyTitle}
                </h2>
                <p className="text-16 md:text-18 text-slate-500 leading-loose mb-8">
                  {t.about.story}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex-1">
                    <h3 className="text-20 font-bold text-slate-900 mb-4 flex items-center gap-3">
                       <ShieldCheck className="text-gold" size={24} />
                       {t.about.missionTitle}
                    </h3>
                    <p className="text-15 text-slate-600 leading-relaxed">
                      {t.about.mission}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-center group transition-all hover:border-gold/30 hover:-translate-y-2"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/10 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-32 font-display font-bold text-slate-900">{stat.num}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LEGACY TIMELINE ═══ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-32 md:text-48 font-display font-bold text-slate-900 mb-4">Our Milestones</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12 text-right">
                    <div className={`max-w-sm ${i % 2 !== 0 ? 'text-left md:ml-12 md:pl-0' : 'text-right'}`}>
                      <div className="text-gold font-display font-bold text-24 mb-2">{item.year}</div>
                      <h4 className="text-18 font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-14 text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white border-4 border-gold shadow-lg flex items-center justify-center text-gold font-bold">
                    {i + 1}
                  </div>
                  <div className="md:w-1/2 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE FOUNDER SPOTLIGHT ═══ */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-white/[0.02] skew-x-12 translate-x-1/2 -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Portrait Card - REFINED FOR VISIBILITY */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[1/1] max-w-lg mx-auto group"
            >
               <div className="absolute inset-0 bg-gold translate-x-4 translate-y-4 rounded-[60px] -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500 opacity-20" />
               <div className="relative w-full h-full rounded-[60px] overflow-hidden border-4 border-white/10 shadow-3xl bg-slate-800">
                 <Image
                    src="/assets/ajay-poddar.svg"
                    alt="Ajay Kumar Poddar"
                    fill
                    className="object-contain object-center scale-[1.05] transition-transform duration-1000 group-hover:scale-[1.1]"
                    priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
                 
                 <div className="absolute bottom-8 left-8 right-8 p-8 backdrop-blur-2xl bg-navy/60 border border-white/10 rounded-[40px]">
                    <div className="text-[12px] font-bold text-gold uppercase tracking-[0.2em] mb-2">Founding Advisor</div>
                    <div className="text-32 font-display font-bold text-white mb-4">Ajay Kumar Poddar</div>
                    <div className="flex flex-wrap gap-3">
                       <span className="px-4 py-1.5 bg-gold text-navy text-[11px] font-bold rounded-full uppercase shadow-lg">🏆 MDRT USA</span>
                       <span className="px-4 py-1.5 bg-white/10 text-white text-[11px] font-bold rounded-full uppercase border border-white/10">Chairman&apos;s Club</span>
                    </div>
                 </div>
               </div>
            </motion.div>

            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-px bg-gold" />
                  <span className="text-[12px] font-bold text-gold uppercase tracking-[0.3em]">{t.aboutSection.eyebrow}</span>
                </div>
                <h2 className="text-42 md:text-56 font-display font-bold text-white mb-8 tracking-tight leading-tight">
                   The Heart of <span className="text-gold">Poddar Wealth</span>
                </h2>
                <div className="space-y-8 text-18 text-white/70 leading-loose italic">
                  <p className="text-24 font-display text-white border-l-4 border-gold pl-6">
                    &ldquo;My mission is not to sell policies, but to build financial fortresses for families who trust us with their life&apos;s work.&rdquo;
                  </p>
                  <p className="not-italic text-white/60 text-16">
                    {t.aboutSection.bio}
                  </p>
                </div>
                
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold border border-white/10 shadow-xl">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Service Area</div>
                      <span className="text-14 font-bold opacity-90">Gorakhpur, Deoria & Kushinagar</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold border border-white/10 shadow-xl">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Global Status</div>
                      <span className="text-14 font-bold opacity-90">MDRT Top 1% Worldwide</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ VALUES IN FOCUS ═══ */}
      <section className="py-32 bg-white relative">
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
                className="p-10 rounded-[48px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-gold/30 hover:shadow-4xl transition-all group"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-md group-hover:scale-110 group-hover:bg-gold/5 transition-all">
                  {valuesIcons[i]}
                </div>
                <h3 className="text-22 font-bold text-slate-900 mb-6 tracking-tight">{v.title}</h3>
                <p className="text-15 text-slate-500 leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY OF TRUST ═══ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-4">
                  <Star className="text-gold fill-gold" size={16} />
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">Our Presence</span>
               </div>
               <h2 className="text-36 md:text-48 font-display font-bold text-slate-900 tracking-tight">Moments of Excellence</h2>
            </div>
            <Link href="/contact" className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-bold hover:border-gold transition-colors shadow-sm">
               Visit Our Office
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative rounded-[32px] overflow-hidden group shadow-xl ${img.size === 'lg' ? 'md:col-span-2' : ''} aspect-video md:aspect-auto h-[350px] md:h-[500px]`}
              >
                <Image src={img.src} alt={img.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <h4 className="text-white font-bold text-20 mb-1">{img.title}</h4>
                  <div className="flex items-center gap-2 text-gold">
                    <CheckCircle2 size={16} />
                    <span className="text-[12px] font-bold uppercase tracking-widest">Verified Presence</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOLD INSTITUTIONAL BADGES ═══ */}
      <section className="py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-32">
             <motion.div 
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-3 group"
             >
                <div className="text-36 md:text-48 font-display font-bold text-navy group-hover:text-gold transition-colors">MDRT USA</div>
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-900">Highest Global Quality</div>
             </motion.div>
             <motion.div 
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-3 group"
             >
                <div className="text-36 md:text-48 font-display font-bold text-navy group-hover:text-gold transition-colors">LIC CHAIRMAN&apos;S</div>
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-900">Premier Club Member</div>
             </motion.div>
             <motion.div 
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-3 group"
             >
                <div className="text-36 md:text-48 font-display font-bold text-navy group-hover:text-brand-blue transition-colors">IRDAI</div>
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-900">Registered Authority</div>
             </motion.div>
          </div>
        </div>
      </section>

      <LeadForm />
      
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
