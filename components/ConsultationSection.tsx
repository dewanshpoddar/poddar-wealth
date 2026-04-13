'use client'

import { Phone, User, Shield, Award, Users } from 'lucide-react'
import BaseLeadForm from './base/BaseLeadForm'

interface ConsultationSectionProps {
  intent?: string
}

const trustPoints = [
  { icon: Award, text: 'MDRT Member — top 1% of advisors globally' },
  { icon: Shield, text: '31 years · Personal call, not a call centre' },
  { icon: Users, text: '5,000+ families protected across India' },
]

const fields = [
  {
    name: 'name' as const,
    label: 'Your Name',
    icon: <User size={12} />,
    placeholder: 'Ex: Ramesh Sharma',
    required: true,
  },
  {
    name: 'mobile' as const,
    label: 'WhatsApp Number',
    icon: <Phone size={12} />,
    placeholder: '10-digit mobile number',
    required: true,
    type: 'tel',
  },
]

export default function ConsultationSection({ intent = 'Service Consultation' }: ConsultationSectionProps) {
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
                Free Consultation
              </span>
            </div>

            <h2 className="font-display font-bold text-[28px] md:text-[34px] text-white leading-[1.2] mb-4">
              Book a free 30-min call<br />
              <span className="text-gold">with Ajay sir personally.</span>
            </h2>

            <p className="text-white/55 text-[14px] leading-relaxed mb-8 max-w-[380px]">
              No scripts. No call centre. Ajay Kumar Poddar reviews your situation himself and recommends exactly what your family needs — nothing more.
            </p>

            <div className="space-y-4">
              {trustPoints.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-gold" />
                  </div>
                  <span className="text-[13px] text-white/70 font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 max-w-[340px]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-[12px] text-white/60">
                Ajay typically responds within <span className="text-white font-semibold">2–4 hours</span> on business days
              </span>
            </div>
          </div>

          {/* Right — form card */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30">
              <div className="mb-6">
                <h3 className="font-display font-bold text-[20px] text-slate-900 mb-1">
                  Get your free plan review
                </h3>
                <p className="text-[13px] text-slate-500">
                  Just your name and number — Ajay does the rest.
                </p>
              </div>

              <BaseLeadForm
                fields={fields}
                intent={intent}
                submitText="Book Free Call with Ajay →"
                successTitle="Call booked! 🎉"
                successMessage="Ajay sir will personally call you within 2–4 hours on business days. No scripts, no sales pressure."
              />

              <p className="text-[11px] text-slate-400 text-center mt-4 leading-snug">
                Your number is only shared with Ajay. Never sold or mass-marketed.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
