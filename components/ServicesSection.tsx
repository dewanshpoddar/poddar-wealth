'use client'
import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import { 
  Shield, Users, HeartPulse, Calculator, GraduationCap, Landmark, 
  Stethoscope, Building2, ShieldCheck, Ribbon, UserCheck, Heart, Users2 
} from 'lucide-react'

function getServiceIcon(emoji: string) {
  const cleanEmoji = emoji.replace(/[\ufe0f\u200d]/g, '').trim()
  switch (cleanEmoji) {
    case '🛡':
      return <Shield className="w-6 h-6 text-amber-500" />
    case '👨‍👩‍👧‍👦':
    case '👨👩👧👦':
      return <Users className="w-6 h-6 text-amber-500" />
    case '👨‍⚕️':
    case '👨⚕️':
      return <HeartPulse className="w-6 h-6 text-amber-500" />
    case '💼':
      return <Calculator className="w-6 h-6 text-amber-500" />
    case '👧':
      return <GraduationCap className="w-6 h-6 text-amber-500" />
    case '👴':
      return <Landmark className="w-6 h-6 text-amber-500" />
    case '🩺':
      return <Stethoscope className="w-6 h-6 text-amber-500" />
    case '🏢':
      return <Building2 className="w-6 h-6 text-amber-500" />
    case '🚶‍♂️':
    case '🚶':
    case '🚶♂️':
      return <ShieldCheck className="w-6 h-6 text-amber-500" />
    case '🎗️':
    case '🎗':
      return <Ribbon className="w-6 h-6 text-amber-500" />
    case '🧔':
      return <UserCheck className="w-6 h-6 text-amber-500" />
    case '👰':
      return <Heart className="w-6 h-6 text-amber-500" />
    case '👥':
      return <Users2 className="w-6 h-6 text-amber-500" />
    default:
      return <Shield className="w-6 h-6 text-amber-500" />
  }
}

const iconBgs: Record<string, string> = {
  blue: '#E6F1FB',
  red: '#FCEBEB',
  orange: '#FAEEDA',
  green: '#E1F5EE',
}

export default function ServicesSection() {
  const { t } = useLang()

  return (
    <section className="bg-slate-50 py-16 md:py-20 relative overflow-hidden">
      {/* Decorative gradient background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
              <span className="w-8 h-px bg-gold" />
              {t.services.eyebrow}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              {t.services.title}
            </h2>
            <p className="text-[14px] text-muted leading-relaxed max-w-sm">
              {t.services.subtitle}
            </p>
          </div>
          <Link href="/services" className="hidden md:flex items-center gap-2 group text-13 font-bold text-navy hover:text-gold transition-colors">
            {t.servicesSection.exploreAll}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.slice(0, 8).map((svc: any, i: number) => (
            <Link key={i} href={svc.href ?? '/services'}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8
                         hover:shadow-md hover:border-gold/30 hover:-translate-y-2
                         transition-all duration-500 group cursor-pointer relative overflow-hidden block">
              {svc.badge && (
                <div className="absolute top-0 right-0 py-1.5 px-4 bg-gold text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-xl shadow-lg z-20">
                  {svc.badge}
                </div>
              )}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative
                           bg-warm group-hover:bg-gold/10 transition-colors duration-500 text-2xl"
              >

                <div className="absolute inset-0 bg-gold/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                  {getServiceIcon(svc.icon)}
                </div>
              </div>


              <div className="text-[17px] font-bold text-navy mb-3 tracking-tight group-hover:text-gold transition-colors duration-300">
                {svc.title}
              </div>
              <div className="text-[13px] text-muted leading-relaxed mb-6">
                {svc.desc}
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-navy/5 text-[9px] text-navy font-bold uppercase tracking-[0.1em] border border-navy/5 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-300">
                  {svc.tag}
                </span>
                <span className="text-navy/0 group-hover:text-gold group-hover:translate-x-1 transition-all duration-500 font-bold text-16">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
