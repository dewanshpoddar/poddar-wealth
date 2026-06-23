'use client'

import { Component, type ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import LazySection from '@/components/LazySection'

const AskPoddarJiWidget = dynamic(
  () => import('@/components/AskPoddarJiWidget'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-950 h-24 w-full" /> }
)

// Below-fold components imported dynamically
const QuickActions = dynamic(
  () => import('@/components/QuickActions'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-16 w-full" /> }
)

const ProtectionCheckSection = dynamic(
  () => import('@/components/ProtectionCheckSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

const LifeEventsNavigator = dynamic(
  () => import('@/components/LifeEventsNavigator'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-48 w-full" /> }
)

const TrustSection = dynamic(
  () => import('@/components/TrustSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-16 w-full" /> }
)

const ServicesSection = dynamic(
  () => import('@/components/ServicesSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-96 w-full" /> }
)

const PopularPlans = dynamic(
  () => import('@/components/PopularPlans'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-48 w-full" /> }
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

const JoinAdvisorSection = dynamic(
  () => import('@/components/JoinAdvisorSection'),
  { ssr: false, loading: () => <div className="animate-pulse bg-amber-50 rounded-xl h-64 w-full" /> }
)

const AboutFounder = dynamic(
  () => import('@/components/AboutFounder'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

const NewsletterSignup = dynamic(
  () => import('@/components/NewsletterSignup'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-48 w-full" /> }
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

      {/* 2 — Ask Poddar Ji widget */}
      <AskPoddarJiWidget />

      {/* 3 — Calculator quick actions */}
      <SectionBoundary>
        <LazySection height="h-16">
          <Suspense fallback={null}>
            <QuickActions />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 4 — Protection Check ("What happens if income stops?") */}
      <SectionBoundary>
        <LazySection height="h-64">
          <Suspense fallback={null}>
            <ProtectionCheckSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 5 — Life Stages Navigator */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <LifeEventsNavigator />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 6 — Trust stats bar */}
      <SectionBoundary>
        <LazySection height="h-16">
          <Suspense fallback={null}>
            <TrustSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 7 — How We Help You (goal-oriented services) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <ServicesSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 8 — Popular Plans (curated premium dark grid) */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <PopularPlans />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 9 — Wealth Blueprint Calculator (Calculators / tools section) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <WealthBlueprintCalculator />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 10 — Trusted by 5,000+ Families (testimonials & reviews merged) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 11 — Blog preview carousel */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <BlogPreview />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 12 — Join as Insurance Advisor */}
      <SectionBoundary>
        <LazySection height="h-64">
          <Suspense fallback={null}>
            <JoinAdvisorSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 13 — About the Founder */}
      <SectionBoundary>
        <LazySection height="h-64">
          <Suspense fallback={null}>
            <AboutFounder />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 14 — Newsletter signup */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <NewsletterSignup />
          </Suspense>
        </LazySection>
      </SectionBoundary>
    </>
  )
}
