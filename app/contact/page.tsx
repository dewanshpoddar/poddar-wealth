'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LangContext'
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2, MessageCircle } from 'lucide-react'
import { ADVISOR_PHONE, OFFICE_HOURS, WHATSAPP_PREFILL } from '@/lib/constants'

export default function ContactPage() {
  const { t, lang } = useLang()
  const isHi = lang === 'hi'
  const [form, setForm] = useState({ name: '', phone: '', wantTo: '', iAm: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || form.name.trim().length < 2) {
      setError(isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.')
      return
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError(isHi ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.')
      return
    }
    if (!form.wantTo) {
      setError(isHi ? 'कृपया चुनें कि आप क्या करना चाहते हैं।' : 'Please select what you want to do.')
      return
    }
    if (!form.iAm) {
      setError(isHi ? 'कृपया चुनें कि आप कौन हैं।' : 'Please select who you are.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          mobile: form.phone,
          wantTo: form.wantTo,
          iAm: form.iAm,
          message: form.message,
          intent: 'Contact Page',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Submission failed')
      }
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError(isHi ? `कुछ गलत हो गया। कृपया हमें ${ADVISOR_PHONE} पर कॉल करें।` : `Something went wrong. Please call us at ${ADVISOR_PHONE}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern py-16 md:py-20">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-5"><Phone size={16} /> Contact Us</div>
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
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{t.contactPage?.successTitle || (isHi ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message Sent Successfully!')}</h3>
                  <p className="text-slate-500">
                    {isHi ? 'अजय सर व्यक्तिगत रूप से 24 घंटों के भीतर आपसे संपर्क करेंगे।' : 'Ajay will personally get back to you within 24 hours.'}
                  </p>
                  <button
                    onClick={() => { setSuccess(false); setForm({ name: '', phone: '', wantTo: '', iAm: '', message: '' }) }}
                    className="mt-6 text-sm font-bold text-green-700 hover:underline"
                  >
                    {isHi ? '← दूसरा संदेश भेजें' : '← Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-gray-500 mb-4">* Required fields</p>
                  <div>
                    <label htmlFor="ct-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {isHi ? 'आपका नाम *' : 'Your Name *'}
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="input-field"
                      placeholder={isHi ? 'रमेश शर्मा' : 'Ramesh Sharma'}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {isHi ? 'व्हाट्सएप / फोन *' : 'WhatsApp / Phone *'}
                    </label>
                    <input
                      id="ct-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                      className="input-field"
                      placeholder={isHi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                      inputMode="numeric"
                      maxLength={10}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="wantTo" className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {isHi ? 'मैं चाहता हूँ *' : 'I want to *'}
                      </label>
                      <select
                        id="wantTo"
                        required
                        value={form.wantTo}
                        onChange={e => setForm({...form, wantTo: e.target.value})}
                        className="input-field appearance-none cursor-pointer"
                      >
                        <option value="">{isHi ? 'चुनें' : 'Select'}</option>
                        <option value="Protect my family">{isHi ? 'अपने परिवार को सुरक्षित करना' : 'Protect my family'}</option>
                        <option value="Create wealth">{isHi ? 'संपत्ति (Wealth) बनाना' : 'Create wealth'}</option>
                        <option value="Plans for Children's future">{isHi ? 'बच्चों के भविष्य के लिए प्लान' : "Plans for Children's future"}</option>
                        <option value="Plan for my retirement">{isHi ? 'रिटायरमेंट के लिए प्लान' : 'Plan for my retirement'}</option>
                        <option value="Get health cover">{isHi ? 'स्वास्थ्य बीमा (Health Cover) लेना' : 'Get health cover'}</option>
                        <option value="Complete financial checkup">{isHi ? 'पूर्ण वित्तीय जांच' : 'Complete financial checkup'}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="iAm" className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {isHi ? 'मैं हूँ *' : 'I am *'}
                      </label>
                      <select
                        id="iAm"
                        required
                        value={form.iAm}
                        onChange={e => setForm({...form, iAm: e.target.value})}
                        className="input-field appearance-none cursor-pointer"
                      >
                        <option value="">{isHi ? 'चुनें' : 'Select'}</option>
                        <option value="Prospective Policy Holder">{isHi ? 'नया पॉलिसी ग्राहक' : 'Prospective Policy Holder'}</option>
                        <option value="Existing Policy Holder">{isHi ? 'मौजूदा पॉलिसी ग्राहक' : 'Existing Policy Holder'}</option>
                        <option value="An NRI">{isHi ? 'एक प्रवासी भारतीय (NRI)' : 'An NRI'}</option>
                        <option value="An agent">{isHi ? 'एक एजेंट (Agent)' : 'An agent'}</option>
                        <option value="Employee">{isHi ? 'कर्मचारी (Employee)' : 'Employee'}</option>
                        <option value="Retired employee">{isHi ? 'सेवानिवृत्त कर्मचारी' : 'Retired employee'}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      {isHi ? 'आपका संदेश' : 'Your Message'}
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      className="input-field resize-none"
                      placeholder={isHi ? 'बताएं कि हम आपकी कैसे मदद कर सकते हैं...' : 'Tell us how we can help...'}
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-4 text-base disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isHi ? 'संदेश भेजें →' : 'Send Message →')}
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    {isHi ? 'आपके विवरण पूरी तरह सुरक्षित हैं और कभी साझा नहीं किए जाते।' : 'Your details are secure and never shared.'}
                  </p>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="font-display font-bold text-xl text-slate-900 mb-6">{t.contact.infoTitle}</h2>
                <div className="space-y-4">
                  <a href={`tel:${t.footer.phone}`} className="flex items-center gap-4 p-4 bg-gold/5 rounded-2xl hover:bg-gold/10 transition-colors group">
                    <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">{isHi ? 'कॉल / व्हाट्सएप' : 'Call / WhatsApp'}</div>
                      <div className="font-semibold text-slate-900 group-hover:text-gold">{t.footer.phone}</div>
                    </div>
                  </a>
                  <a href={`mailto:${t.footer.email}`} className="flex items-center gap-4 p-4 bg-gold/5 rounded-2xl hover:bg-gold/10 transition-colors group">
                    <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div className="font-semibold text-slate-900 group-hover:text-gold">{t.footer.email}</div>
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
                  <Clock className="w-5 h-5 text-gold" />
                  <h3 className="font-display font-bold text-lg text-slate-900">{t.contact.officeTitle}</h3>
                </div>
                  <pre className="text-slate-600 text-sm whitespace-pre-wrap font-sans leading-relaxed">{isHi ? OFFICE_HOURS.hi : OFFICE_HOURS.en}</pre>
              </div>

              {/* Google Maps embed card */}
              <div className="bg-white rounded-3xl shadow-card p-6 overflow-hidden border border-slate-100">
                <h3 className="font-display font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} /> {lang === 'en' ? 'Our Location' : 'हमारा पता'}
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                  AD Mall Compound, Vijay Chowk, Gorakhpur, Uttar Pradesh 273001
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-100 h-[300px] w-full relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.9056637380963!2d83.371286!3d26.747376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39914443194a28d5%3A0xf6a84f3e6955fc18!2sVijay%20Chowk%2C%20Gorakhpur%2C%20Uttar%20Pradesh%20273001!5e0!3m2!1sen!2sin!4v1717200000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href="https://www.google.com/maps/search/AD+Mall+Compound+Vijay+Chowk+Gorakhpur+273001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block text-center text-xs font-bold text-gold hover:text-amber-700 transition-colors uppercase tracking-wider"
                >
                  {lang === 'en' ? 'Open in Google Maps →' : 'गूगल मैप्स में खोलें →'}
                </a>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2"><MessageCircle size={18} /> {t.contactPage?.whatsappAlt || (isHi ? 'क्या आप व्हाट्सएप पसंद करते हैं?' : 'Prefer WhatsApp?')}</h3>
                <p className="text-green-700 text-sm mb-4">Ajay responds to WhatsApp messages personally - usually within a few hours during business days.</p>
                <a
                  href={`https://wa.me/${t.whatsapp.number}?text=${encodeURIComponent(isHi ? WHATSAPP_PREFILL.hi : WHATSAPP_PREFILL.en)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t.contact.whatsappCta}
                </a>
                <p className="text-xs text-green-700/80 mt-2.5 font-medium leading-relaxed">
                  {t.contact.whatsappPrivacy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
