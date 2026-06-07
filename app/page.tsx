'use client'
import { Component, type ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import QuickActions from '@/components/QuickActions'
import TrustSection from '@/components/TrustSection'
import ServicesSection from '@/components/ServicesSection'
import GoogleReviewsBadge from '@/components/GoogleReviewsBadge'
import LazySection from '@/components/LazySection'

// Silent error boundary — if any below-fold component crashes, show nothing rather than the global error screen
class SectionBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

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

const NewsletterSignup = dynamic(
  () => import('@/components/NewsletterSignup'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-950 rounded-xl h-48 w-full" /> }
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
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <ProductTeaser />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 6 — Core conversion tool */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <WealthBlueprintCalculator />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 7 — Social proof (Testimonials) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 8 — Blog Preview (latest 3 posts) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <BlogPreview />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* Newsletter Signup */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <NewsletterSignup />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 9 — Final CTA */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <FinalCTA />
          </Suspense>
        </LazySection>
      </SectionBoundary>
    </>
  )
}
