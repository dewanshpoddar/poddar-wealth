'use client'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import QuickActions from '@/components/QuickActions'
import TrustSection from '@/components/TrustSection'
import ServicesSection from '@/components/ServicesSection'
import GoogleReviewsBadge from '@/components/GoogleReviewsBadge'
import LazySection from '@/components/LazySection'

const ProductTeaser = dynamic(
  () => import('@/components/ProductTeaser'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

const WealthBlueprintCalculator = dynamic(
  () => import('@/src/features/wealth-blueprint/components/WealthBlueprintCalculator'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-96 w-full" /> }
)

const TestimonialsSection = dynamic(
  () => import('@/components/TestimonialsSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

const BlogPreview = dynamic(
  () => import('@/components/BlogPreview'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)



const FinalCTA = dynamic(
  () => import('@/components/FinalCTA'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero */}
      <HeroSection />

      {/* Quick Actions Grid */}
      <QuickActions />

      {/* 2 — Trust stats bar */}
      <TrustSection />

      {/* 3 — Google Reviews Trust Badge */}
      <GoogleReviewsBadge />

      {/* 4 — Services discovery */}
      <ServicesSection />

      {/* 5 — Product browser teaser */}
      <LazySection height="h-96">
        <ProductTeaser />
      </LazySection>

      {/* 6 — Core conversion tool */}
      <LazySection height="h-96">
        <WealthBlueprintCalculator />
      </LazySection>

      {/* 7 — Social proof (Testimonials) */}
      <LazySection height="h-96">
        <TestimonialsSection />
      </LazySection>

      {/* 8 — Blog Preview (latest 3 posts) */}
      <LazySection height="h-96">
        <BlogPreview />
      </LazySection>

      {/* 10 — Final CTA */}
      <LazySection height="h-96">
        <FinalCTA />
      </LazySection>
    </>
  )
}


