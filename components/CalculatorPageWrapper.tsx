'use client'

interface CalculatorPageWrapperProps {
  icon: string
  label: string
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function CalculatorPageWrapper({
  icon,
  label,
  title,
  subtitle,
  children,
}: CalculatorPageWrapperProps) {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
            {icon} {label}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        </div>
      </section>

      {/* Calculator content */}
      {children}

      {/* IRDAI disclaimer */}
      <div className="section-container py-6">
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          For illustrative purposes only. Premiums and benefits are indicative and subject to IRDAI regulations,
          plan terms, and underwriting. Consult a licensed advisor before purchasing any insurance product.
        </p>
      </div>
    </div>
  )
}
