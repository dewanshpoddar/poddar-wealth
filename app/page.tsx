import HeroSection from '@/components/HeroSection'
import AgentTeaserStrip from '@/components/AgentTeaserStrip'
import TrustSection from '@/components/TrustSection'
import { WealthBlueprintCalculator } from '@/src/features/wealth-blueprint'
import ServicesSection from '@/components/ServicesSection'
import ProductTeaser from '@/components/ProductTeaser'
import GoogleReviewsBadge from '@/components/GoogleReviewsBadge'
import TestimonialsSection from '@/components/TestimonialsSection'
import BlogPreview from '@/components/BlogPreview'
import FinalCTA from '@/components/FinalCTA'

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Trust stats bar */}
      <TrustSection />

      {/* 3 — Google Reviews Trust Badge */}
      <GoogleReviewsBadge />

      {/* 4 — Services discovery */}
      <ServicesSection />

      {/* 5 — Product browser teaser */}
      <ProductTeaser />

      {/* 6 — Core conversion tool */}
      <WealthBlueprintCalculator />

      {/* 7 — Social proof (Testimonials) */}
      <TestimonialsSection />

      {/* 8 — Blog Preview (latest 3 posts) */}
      <BlogPreview />

      {/* 9 — Agent teaser strip */}
      <AgentTeaserStrip />

      {/* 10 — Final CTA */}
      <FinalCTA />
    </>
  )
}

