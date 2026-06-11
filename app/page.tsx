'use client'
import { Component, type ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import AskPoddarJiWidget from '@/components/AskPoddarJiWidget'
import LifeEventsNavigator from '@/components/LifeEventsNavigator'
import TrustSection from '@/components/TrustSection'
import ProtectionCheckSection from '@/components/ProtectionCheckSection'
import QuickActions from '@/components/QuickActions'
import LazySection from '@/components/LazySection'

const ServicesSection = dynamic(
  () => import('@/components/ServicesSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-96 w-full" /> }
)

const ProductTeaser = dynamic(
  () => import('@/components/ProductTeaser'),
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

const NewsletterSignup = dynamic(
  () => import('@/components/NewsletterSignup'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-950 rounded-xl h-48 w-full" /> }
)

const FinalCTA = dynamic(
  () => import('@/components/FinalCTA'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

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

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Ask Poddar Ji Widget */}
      <AskPoddarJiWidget />

      {/* 3 — Life Stage Navigator */}
      <LifeEventsNavigator />

      {/* 4 — Trust stats bar */}
      <TrustSection />

      {/* 5 — Protection Check Section (Placed above services!) */}
      <ProtectionCheckSection />

      {/* 6 — Services discovery */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <ServicesSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 6.5 — Product Teaser (navy blue background) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <ProductTeaser />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 7 — Quick Actions Grid */}
      <QuickActions />

      {/* 8 — Social proof (Testimonials & Reviews merged) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 9 — Blog Preview (latest 3 posts) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <BlogPreview />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 10 — Newsletter Signup */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <NewsletterSignup />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 11 — Final CTA */}
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
