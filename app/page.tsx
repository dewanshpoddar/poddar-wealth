import HeroSection from '@/components/HeroSection'
import AgentTeaserStrip from '@/components/AgentTeaserStrip'
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
      <AgentTeaserStrip />

      {/* 8 — About the advisor + final CTA */}
      <FinalCTA />
    </>
  )
}
