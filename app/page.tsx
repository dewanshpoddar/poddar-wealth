import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import WealthBlueprintCalculator from '@/components/WealthBlueprintCalculator'
import ServicesSection from '@/components/ServicesSection'
import ProductTeaser from '@/components/ProductTeaser'
import TestimonialsSection from '@/components/TestimonialsSection'
import FinalCTA from '@/components/FinalCTA'

export default function HomePage() {
  return (
    <>
      {/* 1 — Hook */}
      <HeroSection />

      {/* 2 — Trust proof */}
      <TrustSection />

      {/* 3 — Core conversion tool (was section 6) */}
      <WealthBlueprintCalculator />

      {/* 4 — Service discovery */}
      <ServicesSection />

      {/* 5 — Product browser teaser */}
      <ProductTeaser />

      {/* 6 — Social proof */}
      <TestimonialsSection />

      {/* 7 — Agent teaser strip (subtle — does not interrupt client journey) */}
      <div className="bg-navy/5 border-y border-gold/10 py-6 px-8 text-center">
        <p className="text-[13px] text-slate-500">
          Are you a financial professional?{' '}
          <Link href="/become-advisor" className="text-gold font-semibold hover:underline">
            Join Ajay sir&apos;s advisor network →
          </Link>
        </p>
      </div>

      {/* 8 — About the advisor + final CTA */}
      <FinalCTA />
    </>
  )
}
