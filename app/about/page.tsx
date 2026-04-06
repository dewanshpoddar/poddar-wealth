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
  Briefcase
} from 'lucide-react'

export default function AboutPage() {
  const { t, lang } = useLang()

  const stats = [
    { num: '31+', label: lang === 'en' ? 'Years of Excellence' : 'उत्कृष्टता के वर्ष', icon: <Calendar className="text-gold" size={24} /> },
    { num: '5000+', label: lang === 'en' ? 'Protected Families' : 'सुरक्षित परिवार', icon: <Users className="text-blue-400" size={24} /> },
    { num: 'MDRT', label: lang === 'en' ? 'USA Member' : 'यूएसए सदस्य', icon: <Award className="text-gold" size={24} /> },
    { num: '₹500Cr+', label: lang === 'en' ? 'Claims Assisted' : 'दावे सहायता', icon: <Briefcase className="text-green-500" size={24} /> }
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
        {/* Background Accents */}
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
              {t.about.heroTitle.split(' ').map((word: string, i: number) => (
                <span key={i} className={word === '31' ? 'text-gold' : ''}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-16 md:text-20 text-white/60 leading-relaxed lg:border-l border-white/10 lg:pl-12"
            >
              For over three decades, we have been Gorakhpur&apos;s silent guardian — not just selling insurance, but building a legacy of trust, one family at a time.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══ LEGACY GRID: THE STORY ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Story Text */}
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
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                    <h3 className="text-18 font-bold text-slate-900 mb-2 flex items-center gap-2">
                       <ShieldCheck className="text-green-600" size={20} />
                       {t.about.missionTitle}
                    </h3>
                    <p className="text-14 text-slate-500 leading-relaxed">
                      {t.about.mission}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 text-center group transition-all hover:border-gold/30 hover:-translate-y-2"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/10 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-28 font-display font-bold text-slate-900">{stat.num}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ THE FOUNDER SPOTLIGHT ═══ */}
      <section className="py-24 bg-navy relative overflow-hidden">
        {/* Material textures */}
        <div className="absolute top-0 right-0 w-full h-full bg-white/[0.02] skew-x-12 translate-x-1/2 -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Portrait Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] max-w-md mx-auto group"
            >
               <div className="absolute inset-0 bg-gold translate-x-3 translate-y-3 rounded-[40px] -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500 opacity-20" />
               <div className="relative w-full h-full rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl">
                 <Image
                    src="/assets/ajay-poddar.svg"
                    alt="Ajay Kumar Poddar"
                    fill
                    className="object-cover object-top scale-[1.2] origin-top transition-transform duration-1000 group-hover:scale-[1.25]"
                 />
                 {/* Credentials overlay */}
                 <div className="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-xl bg-navy/60 border border-white/10 rounded-3xl">
                    <div className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-1">Founding Advisor</div>
                    <div className="text-24 font-display font-bold text-white mb-3">Ajay Kumar Poddar</div>
                    <div className="flex flex-wrap gap-2">
                       <span className="px-3 py-1 bg-gold text-navy text-[10px] font-bold rounded-full uppercase">🏆 MDRT USA</span>
                       <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase border border-white/10">Chairman&apos;s Club</span>
                    </div>
                 </div>
               </div>
            </motion.div>

            {/* Founder Context */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-px bg-gold/50" />
                  <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em]">{t.aboutSection.eyebrow}</span>
                </div>
                <h2 className="text-36 md:text-48 font-display font-bold text-white mb-8 tracking-tight leading-tight">
                   The Heart of Poddar Wealth
                </h2>
                <div className="space-y-6 text-16 text-white/70 leading-loose italic">
                  <p>&ldquo;My mission is not to sell policies, but to build financial fortresses for families who trust us with their life&apos;s work.&rdquo;</p>
                  <p className="not-italic text-white/60">
                    {t.aboutSection.bio}
                  </p>
                </div>
                
                <div className="mt-12 flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold">
                      <MapPin size={18} />
                    </div>
                    <span className="text-14 font-medium opacity-80">Serving Gorakhpur, Deoria & Kushinagar since 1994</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ VALUES IN FOCUS ═══ */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-36 md:text-52 font-display font-bold text-slate-900 mb-4 tracking-tighter">
               {t.about.valuesTitle}
            </h2>
            <div className="w-16 h-1 bg-gold/30 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.values.map((v: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-gold/20 hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {valuesIcons[i]}
                </div>
                <h3 className="text-20 font-bold text-slate-900 mb-4 tracking-tight">{v.title}</h3>
                <p className="text-14 text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSTITUTIONAL BADGES ═══ */}
      <section className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <div className="flex flex-col items-center gap-2">
                <div className="text-32 font-display font-bold text-navy">MDRT USA</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Exclusive Member</div>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="text-32 font-display font-bold text-navy">LIC Chairman&apos;s</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Club Member</div>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="text-32 font-display font-bold text-navy">IRDAI</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Registered Agency</div>
             </div>
          </div>
        </div>
      </section>

      <LeadForm />
      
      {/* FINAL CTA STRIP */}
      <section className="bg-gold py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-center md:text-left">
              <h3 className="text-24 font-display font-bold text-navy mb-2">Ready to plan your family&apos;s future?</h3>
              <p className="text-navy/70 text-14">Get a free consultation from Ajay sir personally.</p>
           </div>
           <Link href="/contact" className="h-14 px-10 bg-navy text-white rounded-full flex items-center justify-center font-bold gap-2 hover:bg-navy-light transition-all shadow-xl">
              Get Free Advice Now
              <ArrowRight size={18} />
           </Link>
        </div>
      </section>
    </div>
  )
}
