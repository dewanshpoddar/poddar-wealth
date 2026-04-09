'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { CheckCircle2, User, Phone, MapPin, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'
import { submitLead } from '@/lib/api'

export default function LeadForm() {
  const { t, lang } = useLang()
  const [form, setForm] = useState({ name: '', mobile: '', city: '', profession: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await submitLead({ ...form, intent: 'Agent Recruitment' })
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <div className="lg:col-span-12 xl:col-span-5 h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-green-900/5 relative overflow-hidden"
            >
              {/* Form Header */}
              {!isSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-20 font-bold text-slate-900 tracking-tight">
                      {t.agent.formTitle}
                    </h3>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                       {lang === 'en' ? 'Open Now' : 'भर्ती चालू है'}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5 group">
                      <label className="text-[11px] font-bold text-slate-400 group-focus-within:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                        <User size={12} />
                        {t.agent.fields.name}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.agent.placeholders.name}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full h-12 bg-slate-50/50 border border-slate-100 focus:border-green-600 focus:bg-white rounded-2xl px-5 text-14 text-slate-900 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 group">
                      <label className="text-[11px] font-bold text-slate-400 group-focus-within:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                        <Phone size={12} />
                        {t.agent.fields.phone}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={t.agent.placeholders.phone}
                        value={form.mobile}
                        onChange={e => setForm({ ...form, mobile: e.target.value })}
                        className="w-full h-12 bg-slate-50/50 border border-slate-100 focus:border-green-600 focus:bg-white rounded-2xl px-5 text-14 text-slate-900 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-slate-400 group-focus-within:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={12} />
                          {t.agent.fields.city}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={t.agent.placeholders.city}
                          value={form.city}
                          onChange={e => setForm({ ...form, city: e.target.value })}
                          className="w-full h-12 bg-slate-50/50 border border-slate-100 focus:border-green-600 focus:bg-white rounded-2xl px-5 text-14 text-slate-900 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5 group">
                        <label className="text-[11px] font-bold text-slate-400 group-focus-within:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                          <GraduationCap size={12} />
                          {t.agent.fields.profession}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={t.agent.placeholders.profession}
                          value={form.profession}
                          onChange={e => setForm({ ...form, profession: e.target.value })}
                          className="w-full h-12 bg-slate-50/50 border border-slate-100 focus:border-green-600 focus:bg-white rounded-2xl px-5 text-14 text-slate-900 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-14 bg-green-700 hover:bg-green-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            {t.agent.submit}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-slate-400 leading-tight pt-4">
                      {lang === 'en' 
                        ? 'Submit interest to get a personal consultation call from Ajay Poddar sir.' 
                        : 'अजय पोद्दार सर से व्यक्तिगत परामर्श कॉल के लिए रुचि सबमिट करें।'}
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6"
                  >
                     <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-24 font-bold text-slate-900 mb-3 tracking-tight">
                    {lang === 'en' ? 'Thank you!' : 'धन्यवाद!'}
                  </h3>
                  <p className="text-15 text-slate-500 leading-relaxed mb-8">
                    {lang === 'en' 
                      ? 'We received your interest. Ajay sir will personally call you within 24 hours to explain the next steps.' 
                      : 'हमें आपकी रुचि प्राप्त हुई। अजय सर अगले कदमों को समझाने के लिए 24 घंटों के भीतर व्यक्तिगत रूप से कॉल करेंगे।'}
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="text-13 font-bold text-green-700 hover:underline"
                  >
                    {lang === 'en' ? '← Submit another response' : '← दूसरी प्रतिक्रिया भेजें'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
