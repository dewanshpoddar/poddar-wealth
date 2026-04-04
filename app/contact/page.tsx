'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
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
      <section className="bg-hero-gradient hero-pattern py-16 md:py-20">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-5">📞 Contact Us</div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{t.contact.heroTitle}</h1>
          <p className="text-white/75 text-lg max-w-xl mx-auto">{t.contact.heroSubtitle}</p>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-card p-8">
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">{t.contact.formTitle}</h2>
              {success ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Message Sent! 🎉</h3>
                  <p className="text-slate-500">Ajay will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Ramesh Sharma" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp / Phone *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+91 98290 XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Message</label>
                    <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field resize-none" placeholder="Tell us how we can help..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-70">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="font-display font-bold text-xl text-slate-900 mb-6">{t.contact.infoTitle}</h2>
                <div className="space-y-4">
                  <a href={`tel:${t.footer.phone}`} className="flex items-center gap-4 p-4 bg-brand-50 rounded-2xl hover:bg-brand-100 transition-colors group">
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Call / WhatsApp</div>
                      <div className="font-semibold text-slate-900 group-hover:text-brand-700">{t.footer.phone}</div>
                    </div>
                  </a>
                  <a href={`mailto:${t.footer.email}`} className="flex items-center gap-4 p-4 bg-brand-50 rounded-2xl hover:bg-brand-100 transition-colors group">
                    <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div className="font-semibold text-slate-900 group-hover:text-brand-700">{t.footer.email}</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Office</div>
                      <div className="font-semibold text-slate-700">{t.footer.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-brand-600" />
                  <h3 className="font-display font-bold text-lg text-slate-900">{t.contact.officeTitle}</h3>
                </div>
                <pre className="text-slate-600 text-sm whitespace-pre-wrap font-sans leading-relaxed">{t.contact.officeHours}</pre>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
                <h3 className="font-bold text-green-800 mb-3">💬 Prefer WhatsApp?</h3>
                <p className="text-green-700 text-sm mb-4">Ajay responds to WhatsApp messages personally — usually within a few hours during business days.</p>
                <a
                  href={`https://wa.me/${t.whatsapp.number}?text=Hi Ajay ji, I need insurance advice.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t.contact.whatsappCta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
