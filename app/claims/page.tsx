'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import {
  PhoneCall,
  FileText,
  Send,
  Clock,
  Shield,
  User,
  CreditCard,
  ClipboardCheck,
  CheckCircle2,
} from 'lucide-react'

export default function ClaimsPage() {
  const { t, lang } = useLang()

  // Safely cast t as any if there are strict compilation delays, but it's typed
  const claims = (t as any).claims || {
    heroEyebrow: 'CLAIM SUPPORT CENTRE',
    heroTitle: 'We stand with you',
    heroTitleGold: 'during claims.',
    heroSubtitle: 'For over three decades, Ajay Kumar Poddar has personally hand-delivered claims to families when they needed it most. No call centres, no automation — just complete support when it matters.',
    processTitle: 'Simple 4-Step Claim Process',
    processSubtitle: 'We guide you and handle the paperwork at every single stage.',
    steps: [],
    checklistTitle: 'Required Documents Checklist',
    checklistSubtitle: 'Keep these documents ready for a smooth and fast claim settlement.',
    checklistItems: [],
    statsTitle: 'Our Settlement Trust',
    statsSubtitle: 'Numbers that represent families protected and promises kept.',
    stats: [],
    ctaTitle: 'Need immediate claim support?',
    ctaSubtitle: 'Talk to Ajay sir directly for end-to-end guidance. No third-party agents.',
    ctaCall: `Call Ajay sir directly: ${ADVISOR_PHONE}`,
    ctaWhatsapp: 'Chat on WhatsApp'
  }

  const stepIcons = [
    <PhoneCall key="1" className="text-blue-500" size={24} />,
    <FileText key="2" className="text-gold" size={24} />,
    <Send key="3" className="text-green-500" size={24} />,
    <Clock key="4" className="text-purple-500" size={24} />
  ]

  const checklistIcons = [
    <Shield key="1" className="text-gold" size={24} />,
    <FileText key="2" className="text-red-500" size={24} />,
    <ClipboardCheck key="3" className="text-blue-500" size={24} />,
    <User key="4" className="text-emerald-500" size={24} />,
    <CreditCard key="5" className="text-violet-500" size={24} />
  ]

  return (
    <div className="bg-white">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden bg-warm/30 pt-16 pb-16 lg:pt-28 lg:pb-28 border-b border-gold/5">
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="flex flex-col justify-center animate-fade-up">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-gold font-bold uppercase mb-4">
                <span className="w-7 h-px bg-gold inline-block" />
                {claims.heroEyebrow}
              </div>
              
              <h1 className="font-display text-[32px] md:text-[40px] lg:text-[50px] font-normal italic leading-[1.15] text-slate-900 mb-6">
                {claims.heroTitle} <br />
                <span className="font-bold text-gold not-italic">{claims.heroTitleGold}</span>
              </h1>
              
              <p className="text-[14px] md:text-[15px] text-slate-500 leading-relaxed max-w-[480px] font-medium">
                {claims.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`tel:${ADVISOR_PHONE}`}
                  className="h-12 px-6 bg-navy text-white rounded-full flex items-center justify-center font-bold text-[14px] gap-2 hover:bg-navy-light transition-all shadow-md hover:-translate-y-0.5"
                >
                  <PhoneCall size={16} />
                  Call {ADVISOR_PHONE}
                </a>
                <a
                  href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                    lang === 'en'
                      ? 'Hello Ajay sir, I need assistance with an insurance claim.'
                      : 'नमस्ते अजय सर, मुझे इंश्योरेंस क्लेम में सहायता चाहिए।'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-[14px] gap-2 hover:bg-green-600 transition-all shadow-md hover:-translate-y-0.5"
                >
                  <span>💬</span>
                  {claims.ctaWhatsapp}
                </a>
              </div>
            </div>

            {/* Right: Premium Trust Visual Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative lg:block hidden"
            >
              <div className="relative w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border border-white bg-slate-50 flex items-center justify-center p-8">
                <div className="text-center space-y-6 max-w-sm">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                    <Shield size={40} />
                  </div>
                  <h2 className="font-display text-[22px] font-bold text-navy">
                    {lang === 'en' ? 'Poddar Claims Guarantee' : 'पोद्दार क्लेम गारंटी'}
                  </h2>
                  <p className="text-slate-500 text-[13px] leading-relaxed">
                    {lang === 'en'
                      ? 'Every policy issued by our desk comes with life-long personal claim assistance. We visit your home and coordinate with departments directly.'
                      : 'हमारे डेस्क द्वारा जारी हर पॉलिसी लाइफ-लॉन्ग व्यक्तिगत क्लेम सहायता के साथ आती है। हम घर पर विजिट करते हैं और सीधे विभागों से तालमेल बैठाते हैं।'}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══ TRUST STATS BAR ═══ */}
      <section className="bg-white border-b border-gold/10 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <span className="text-gold font-bold uppercase tracking-[0.2em] text-[10px]">{claims.statsTitle}</span>
            <p className="text-slate-400 text-[12px] mt-1">{claims.statsSubtitle}</p>
          </div>
          <div className="flex flex-row flex-wrap justify-center lg:justify-between items-center gap-y-8 gap-x-12">
            {(claims.stats || []).map((stat: any, i: number) => (
              <div key={i} className="flex items-center group min-w-[200px] justify-center lg:justify-start">
                <div className="flex flex-col text-center lg:text-left">
                  <div className="font-display text-[26px] md:text-[32px] font-bold text-slate-900 leading-none group-hover:text-gold transition-colors">
                    {stat.num}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                    {stat.label}
                  </div>
                </div>
                {i < claims.stats.length - 1 && (
                  <div className="h-8 w-px bg-gold/10 ml-16 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STEP-BY-STEP CLAIM PROCESS ═══ */}
      <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mb-16">
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">
            {lang === 'en' ? 'END-TO-END GUIDANCE' : 'शुरू से अंत तक मार्गदर्शन'}
          </span>
          <h2 className="text-[28px] md:text-[34px] font-display font-bold text-navy mt-2 leading-tight">
            {claims.processTitle}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-[14px] md:text-[15px] mt-3">
            {claims.processSubtitle}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(claims.steps || []).map((step: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[36px] bg-white border border-slate-200 hover:border-gold/20 hover:shadow-xl transition-all group relative"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-gold/5 transition-all">
                  {stepIcons[i] || <CheckCircle2 className="text-gold" />}
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-3 tracking-tight leading-snug">
                  {step.title}
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REQUIRED DOCUMENTS CHECKLIST ═══ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">
              {lang === 'en' ? 'BE PREPARED' : 'तैयारी'}
            </span>
            <h2 className="text-[28px] md:text-[34px] font-display font-bold text-navy mt-2 leading-tight">
              {claims.checklistTitle}
            </h2>
            <p className="text-slate-500 text-[14px] md:text-[15px] mt-3">
              {claims.checklistSubtitle}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-[48px] p-8 lg:p-12 shadow-sm space-y-6">
            {(claims.checklistItems || []).map((item: any, i: number) => (
              <div key={i} className="flex gap-6 p-4 rounded-3xl bg-white border border-slate-100 shadow-xs hover:border-gold/15 transition-all">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  {checklistIcons[i] || <CheckCircle2 className="text-gold" />}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-navy mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-[12px] leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA SECTION ═══ */}
      <section className="bg-gold py-16 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-center lg:text-left max-w-xl">
            <h3 className="text-[26px] md:text-[32px] font-display font-bold text-navy mb-4 tracking-tight leading-tight">
              {claims.ctaTitle}
            </h3>
            <p className="text-navy/70 text-[14px] md:text-[15px] font-medium leading-relaxed">
              {claims.ctaSubtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={`tel:${ADVISOR_PHONE}`}
              className="h-14 px-8 bg-navy text-white rounded-full flex items-center justify-center font-bold text-[14px] md:text-[15px] gap-2 hover:bg-navy-light transition-all shadow-xl hover:-translate-y-1 text-center"
            >
              <PhoneCall size={18} />
              {claims.ctaCall}
            </a>
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-8 bg-white text-navy rounded-full flex items-center justify-center font-bold text-[14px] md:text-[15px] gap-2 hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1 text-center border border-navy/5"
            >
              <span>💬</span>
              {claims.ctaWhatsapp}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
