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

const PopularPlans = dynamic(
  () => import('@/components/PopularPlans'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-48 w-full" /> }
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
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-950 rounded-xl h-48 w-full" /> }
)

const FinalCTA = dynamic(
  () => import('@/components/FinalCTA'),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-50 rounded-xl h-64 w-full" /> }
)

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

      {/* 3 — Protection Check ("What happens if income stops?") */}
      <ProtectionCheckSection />

      {/* 4 — Life Stages Navigator */}
      <LifeEventsNavigator />

      {/* 5 — Trust stats bar */}
      <TrustSection />

      {/* 6 — How We Help You (goal-oriented services) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <ServicesSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 7 — Popular Plans (curated 6-plan strip) */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <PopularPlans />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 8 — Calculator quick actions */}
      <QuickActions />

      {/* 9 — Trusted by 5,000+ Families (testimonials & reviews merged) */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 10 — Blog preview carousel */}
      <SectionBoundary>
        <LazySection height="h-96">
          <Suspense fallback={null}>
            <BlogPreview />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 11 — Join as Insurance Advisor */}
      <SectionBoundary>
        <LazySection height="h-64">
          <Suspense fallback={null}>
            <JoinAdvisorSection />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 12 — About the Founder */}
      <SectionBoundary>
        <LazySection height="h-64">
          <Suspense fallback={null}>
            <AboutFounder />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 13 — Newsletter signup */}
      <SectionBoundary>
        <LazySection height="h-48">
          <Suspense fallback={null}>
            <NewsletterSignup />
          </Suspense>
        </LazySection>
      </SectionBoundary>

      {/* 14 — Final CTA */}
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
