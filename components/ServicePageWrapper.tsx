'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import ConsultationSection from './ConsultationSection'

interface ServicePageWrapperProps {
  icon: string
  label: string
  title: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  image: { src: string; alt: string }
  consultationIntent?: string
  children: React.ReactNode
}

export default function ServicePageWrapper({
  icon,
  label,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  consultationIntent,
  children,
}: ServicePageWrapperProps) {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
                {icon} {label}
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                {title}
              </h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">{subtitle}</p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-gold text-white font-bold px-6 py-3.5 rounded-xl hover:bg-gold-hover transition-colors"
                >
                  {primaryCta.label} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors font-medium"
                >
                  {secondaryCta.label}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-hero">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={450}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page-specific content */}
      {children}

      {/* Client consultation CTA — always at bottom, never agent recruitment */}
      <ConsultationSection intent={consultationIntent ?? `${label} Consultation`} />
    </div>
  )
}
