import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import ProductTeaser from '@/components/ProductTeaser'
import ServicesSection from '@/components/ServicesSection'
import CalculatorSection from '@/components/CalculatorSection'
import IntentSection from '@/components/IntentSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ChatBot from '@/components/ChatBot'
import FinalCTA from '@/components/FinalCTA'
import LeadForm from '@/components/LeadForm'
import LeadPopup from '@/components/LeadPopup'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ProductTeaser />
      <ServicesSection />
      <CalculatorSection />
      <IntentSection />
      <TestimonialsSection />
      <FinalCTA />

      <LeadForm />
      <LeadPopup />
    </>
  )
}
