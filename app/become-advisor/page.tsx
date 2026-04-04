'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import Image from 'next/image'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function BecomeAdvisorPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', city: '', experience: '', motivation: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">🤝 Join Our Team</div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">{t.becomeAdvisor.heroTitle}</h1>
              <p className="text-white/80 text-xl leading-relaxed">{t.becomeAdvisor.heroSubtitle}</p>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <Image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80" alt="Advisor team" width={600} height={450} className="w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why become advisor */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.becomeAdvisor.whyTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.becomeAdvisor.benefits.map((b, i) => (
              <div key={i} className="card group hover:-translate-y-1 hover:border-brand-100 border-2 border-transparent">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income table */}
      <section className="section-padding bg-brand-900 text-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">{t.becomeAdvisor.incomeTitle}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 bg-white/20 px-6 py-3 text-white/70 text-sm font-semibold">
                <div>Level</div>
                <div>Monthly Policies</div>
                <div>Monthly Income</div>
              </div>
              {t.becomeAdvisor.incomeData.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <div className="font-semibold text-white">{row.level}</div>
                  <div className="text-white/70">{row.policies}</div>
                  <div className="font-bold text-green-400">{row.income}</div>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs mt-3 text-center">*Income estimates based on average advisor performance. Individual results may vary.</p>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section-padding bg-slate-50" id="apply">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-card-hover p-8 md:p-12">
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-3">Application Received! 🎉</h3>
                  <p className="text-slate-600">Ajay will personally review your application and call you within 24 hours. Welcome to the journey!</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">{t.becomeAdvisor.formTitle}</h2>
                    <p className="text-slate-500">{t.becomeAdvisor.formSubtitle}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                        <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Your Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp Number *</label>
                        <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                        <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-field" placeholder="Jaipur" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prior Experience</label>
                        <select value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="input-field">
                          <option value="">Select...</option>
                          <option>No experience (fresher)</option>
                          <option>1–3 years in insurance</option>
                          <option>3–5 years in insurance</option>
                          <option>5+ years in insurance</option>
                          <option>Other sales experience</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Why do you want to become an advisor?</label>
                      <textarea rows={3} value={form.motivation} onChange={e => setForm({...form, motivation: e.target.value})} className="input-field resize-none" placeholder="Share your motivation..." />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-70">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Now — It\'s Free →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
