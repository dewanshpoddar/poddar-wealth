'use client'
import { useLang } from '@/lib/LangContext'
import Image from 'next/image'
import Link from 'next/link'
import LeadForm from '@/components/LeadForm'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const { t } = useLang()

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
            👋 {t.about.heroSubtitle}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {t.about.heroTitle}
          </h1>
        </div>
      </section>

      {/* Story section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">{t.about.storyTitle}</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">{t.about.story}</p>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{t.about.missionTitle}</h3>
              <p className="text-slate-600 leading-relaxed mb-8">{t.about.mission}</p>
              <Link href="/contact" className="btn-primary">
                Get Free Advice <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-gold/10 shadow-2xl group/photo bg-white">
              <Image
                src="/assets/ajay-poddar.svg"
                alt="Ajay Kumar Poddar"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover/photo:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent opacity-60" />
              <div className="absolute -bottom-6 -left-6 bg-brand-700 text-white rounded-2xl p-5 shadow-card-hover">
                <div className="font-display font-bold text-3xl">27+</div>
                <div className="text-white/80 text-sm">Years of Trust</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 rounded-2xl p-4 shadow-card-hover">
                <div className="font-bold text-sm">🏆 MDRT</div>
                <div className="text-xs">Member</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.about.valuesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.values.map((v, i) => (
              <div key={i} className="card text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credential badges */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">{t.trust.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.trust.credentials.map((c, i) => (
              <div key={i} className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-display font-bold text-slate-900 mb-1">{c.title}</div>
                <div className="text-slate-500 text-sm">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadForm />
    </div>
  )
}
