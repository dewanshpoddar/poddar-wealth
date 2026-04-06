'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'

export default function LeadForm() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', city: '', profession: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="bg-navy py-24 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#C8960C 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-[1240px] mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — info */}
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
              <span className="w-8 h-px bg-gold" />
              {t.agent.eyebrow}
            </div>
            <h2 className="font-display text-[32px] lg:text-[40px] font-normal italic text-white leading-[1.1] mb-6">
              {t.agent.title}
            </h2>
            <div className="text-[14px] text-white/60 leading-relaxed mb-8 max-w-sm">
              {t.agent.subtitle}
            </div>
            <div className="flex flex-col gap-4">
              {t.agent.perks.map((perk: string, i: number) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-gold text-10 border border-gold/20 group-hover:bg-gold group-hover:text-white transition-all duration-300">
                    ✓
                  </div>
                  <span className="text-[13px] text-white/80 font-medium">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-48 mb-6 animate-bounce">🎉</div>
                <div className="text-18 font-bold text-white mb-2">Thank you for your interest!</div>
                <div className="text-14 text-gold">Ajay sir will call you within 24 hours.</div>
              </div>
            ) : (
              <>
                <div className="text-15 font-bold text-white mb-6 tracking-tight border-b border-white/10 pb-4">
                  {t.agent.formTitle}
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gold uppercase tracking-widest">{t.agent.fields.name}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.agent.placeholders.name}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-13 focus:border-gold focus:outline-none transition-colors placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gold uppercase tracking-widest">{t.agent.fields.phone}</label>
                    <input
                      type="tel"
                      required
                      placeholder={t.agent.placeholders.phone}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-13 focus:border-gold focus:outline-none transition-colors placeholder:text-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gold uppercase tracking-widest">{t.agent.fields.city}</label>
                      <input
                        type="text"
                        placeholder={t.agent.placeholders.city}
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-13 focus:border-gold focus:outline-none transition-colors placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gold uppercase tracking-widest">{t.agent.fields.profession}</label>
                      <input
                        type="text"
                        placeholder={t.agent.placeholders.profession}
                        value={form.profession}
                        onChange={e => setForm({ ...form, profession: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-13 focus:border-gold focus:outline-none transition-colors placeholder:text-white/20"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 rounded-xl bg-gold text-white font-bold text-14 hover:bg-gold-hover hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-gold/20 mt-4">
                    {t.agent.submit}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>

  )
}
