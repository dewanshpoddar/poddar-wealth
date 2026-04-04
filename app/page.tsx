import ProblemSolutionSection from '@/components/ProblemSolutionSection'
import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import ServicesSection from '@/components/ServicesSection'
import CalculatorSection from '@/components/CalculatorSection'
import IntentSection from '@/components/IntentSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import LeadForm from '@/components/LeadForm'
import FinalCTA from '@/components/FinalCTA'

export default function HomePage() {
  return (
    <>
      {/* 1. Announcement Banner */}
      <ProblemSolutionSection />
      {/* 2. Hero + Quick Intent */}
      <HeroSection />
      {/* 3. Trust Bar + Partner Bar */}
      <TrustSection />
      {/* 4. Services Grid */}
      <ServicesSection />
      {/* 5. Premium Calculator */}
      <CalculatorSection />
      {/* 6. Emotional Hero (was IntentSection) */}
      <IntentSection />
      {/* 7. Testimonials */}
      <TestimonialsSection />
      {/* 8. About Ajay */}
      <FinalCTA />
      {/* 9. Agent Recruitment */}
      <LeadForm />
    </>
  )
}
