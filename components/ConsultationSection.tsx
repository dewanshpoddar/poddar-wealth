'use client'

import { Phone, User, Shield, Award, Users } from 'lucide-react'
import BaseLeadForm from './base/BaseLeadForm'
import { useLang } from '@/lib/LangContext'

interface ConsultationSectionProps {
  intent?: string
}

const TRUST_ICONS = [Award, Shield, Users]

export default function ConsultationSection({ intent = 'Service Consultation' }: ConsultationSectionProps) {
  const { t } = useLang()
  const c = t.consultation

  const fields = [
    {
      name: 'name' as const,
      label: t.commonForm.name,
      icon: <User size={12} />,
      placeholder: 'Ex: Ramesh Sharma',
      required: true,
    },
    {
      name: 'mobile' as const,
      label: t.commonForm.phone,
      icon: <Phone size={12} />,
      placeholder: '10-digit mobile number',
      required: true,
      type: 'tel',
    },
  ]

  return (
    <section className="py-20 bg-navy relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(200,150,12,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-px bg-gold" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold/70">
                {c.eyebrow}
              </span>
            </div>

            <h2 className="font-display font-bold text-[28px] md:text-[34px] text-white leading-[1.2] mb-4">
              {c.heading}<br />
              <span className="text-gold">{c.headingGold}</span>
            </h2>

            <p className="text-white/55 text-[14px] leading-relaxed mb-8 max-w-[380px]">
              {c.body}
            </p>

            <div className="space-y-4">
              {c.trust.map((text, i) => {
                const Icon = TRUST_ICONS[i]
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-gold" />
                    </div>
                    <span className="text-[13px] text-white/70 font-medium">{text}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 max-w-[340px]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-[12px] text-white/60">
                {c.responseNote}{' '}
                <span className="text-white font-semibold">{c.responseTime}</span>{' '}
                {c.responseContext}
              </span>
            </div>
          </div>

          {/* Right — form card */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30">
              <div className="mb-6">
                <h3 className="font-display font-bold text-[20px] text-slate-900 mb-1">
                  {c.formTitle}
                </h3>
                <p className="text-[13px] text-slate-500">
                  {c.formSubtitle}
                </p>
              </div>

              <BaseLeadForm
                fields={fields}
                intent={intent}
                submitText={c.submitText}
                successTitle={c.successTitle}
                successMessage={c.successMessage}
              />

              <p className="text-[11px] text-slate-400 text-center mt-4 leading-snug">
                {c.privacy}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
