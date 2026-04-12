import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import ProductTeaser from '@/components/ProductTeaser'
import ServicesSection from '@/components/ServicesSection'
import WealthBlueprintCalculator from '@/components/WealthBlueprintCalculator'
import IntentSection from '@/components/IntentSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ChatBot from '@/components/ChatBot'
import FinalCTA from '@/components/FinalCTA'
import LeadForm from '@/components/LeadForm'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ProductTeaser />
      <ServicesSection />
      <WealthBlueprintCalculator />
      <IntentSection />
      <TestimonialsSection />
      <ChatBot />
      <FinalCTA />
      <LeadForm />
    </>
  )
}
