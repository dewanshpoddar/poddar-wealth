'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import BaseLeadForm from './base/BaseLeadForm'
import { User, Phone, MapPin, GraduationCap, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

export default function LeadForm() {
  const { t, lang } = useLang()

  const fields = [
    { name: 'name' as const, label: t.agent.fields.name, icon: <User size={12} />, placeholder: t.agent.placeholders.name, required: true },
    { name: 'mobile' as const, label: t.agent.fields.phone, icon: <Phone size={12} />, placeholder: t.agent.placeholders.phone, required: true, type: 'tel' },
    { name: 'city' as const, label: t.agent.fields.city, icon: <MapPin size={12} />, placeholder: t.agent.placeholders.city, required: true },
    { name: 'profession' as const, label: t.agent.fields.profession, icon: <GraduationCap size={12} />, placeholder: t.agent.placeholders.profession, required: true },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-green-50/50 via-white to-white relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-600/20 to-transparent" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-green-100/30 blur-3xl rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Information */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-10 h-px bg-green-600/40" />
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-[0.2em]">
                {t.agent.eyebrow}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-36 md:text-52 font-display font-bold text-slate-900 mb-8 leading-tight tracking-tight max-w-2xl"
            >
              {t.agent.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-16 md:text-18 text-slate-500 mb-12 max-w-xl leading-relaxed"
            >
              {t.agent.subtitle}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
              {t.agent.perks.map((perk: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-1 shrink-0 bg-green-100 text-green-700 p-1 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </div>
                  <span className="text-14 font-medium text-slate-600 leading-tight">
                    {perk}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-5 h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-green-900/5 relative overflow-hidden"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-20 font-bold text-slate-900 tracking-tight">
                  {t.agent.formTitle}
                </h3>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                   {lang === 'en' ? 'Open Now' : 'भर्ती चालू है'}
                </div>
              </div>

              <BaseLeadForm 
                fields={fields}
                intent="Agent Recruitment"
                submitText={t.agent.submit}
                successTitle={lang === 'en' ? 'Thank you!' : 'धन्यवाद!'}
                successMessage={lang === 'en' 
                  ? 'We received your interest. Ajay sir will personally call you within 24 hours to explain the next steps.' 
                  : 'हमें आपकी रुचि प्राप्त हुई। अजय सर अगले कदमों को समझाने के लिए 24 घंटों के भीतर व्यक्तिगत रूप से कॉल करेंगे।'}
                grid={true}
              />

              <p className="text-[10px] text-center text-slate-400 leading-tight pt-4">
                {lang === 'en' 
                  ? 'Submit interest to get a personal consultation call from Ajay Poddar sir.' 
                  : 'अजय पोद्दार सर से व्यक्तिगत परामर्श कॉल के लिए रुचि सबमिट करें।'}
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
