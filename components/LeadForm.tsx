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
    <section className="pw-section pw-section--green">
      <div className="grid gap-8 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Left — info */}
        <div>
          <div className="pw-eyebrow pw-eyebrow--green">{t.agent.eyebrow}</div>
          <div className="pw-title pw-title--green">{t.agent.title}</div>
          <div className="pw-subtitle pw-subtitle--green">{t.agent.subtitle}</div>
          <div className="flex flex-col gap-2">
            {t.agent.perks.map((perk: string, i: number) => (
              <div key={i} className="pw-perk">
                <div className="pw-perk-dot" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="pw-card--green">
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-32 mb-3">🎉</div>
              <div className="text-13 font-medium text-agent-dark mb-2">Thank you for your interest!</div>
              <div className="text-12 text-agent-mid">Ajay sir will call you within 24 hours.</div>
            </div>
          ) : (
            <>
              <div className="text-13 font-medium mb-4" style={{ color: '#173404' }}>{t.agent.formTitle}</div>
              <form onSubmit={handleSubmit}>
                <div className="pw-field">
                  <label className="pw-label">{t.agent.fields.name}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.agent.placeholders.name}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="pw-input"
                  />
                </div>
                <div className="pw-field">
                  <label className="pw-label">{t.agent.fields.phone}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t.agent.placeholders.phone}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="pw-input"
                  />
                </div>
                <div className="pw-field">
                  <label className="pw-label">{t.agent.fields.city}</label>
                  <input
                    type="text"
                    placeholder={t.agent.placeholders.city}
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="pw-input"
                  />
                </div>
                <div className="mb-4">
                  <label className="pw-label">{t.agent.fields.profession}</label>
                  <input
                    type="text"
                    placeholder={t.agent.placeholders.profession}
                    value={form.profession}
                    onChange={e => setForm({ ...form, profession: e.target.value })}
                    className="pw-input"
                  />
                </div>
                <button type="submit" className="pw-btn pw-btn--green pw-btn--full">
                  {t.agent.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
