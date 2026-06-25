'use client'
import { useLang } from '@/lib/LangContext'
import ServiceHero from './ServiceHero'
import ProblemSection from './ProblemSection'
import HowItWorks from './HowItWorks'
import PlanCards from './PlanCards'
import CalculatorCTA from './CalculatorCTA'
import ServiceTestimonial from './ServiceTestimonial'
import ServiceFAQ from './ServiceFAQ'
import CrossSell from './CrossSell'
import ServiceCTA from './ServiceCTA'

interface ServicePageTemplateProps {
  slug: string
}

// Maps slugs to alternating hero background variants ('light' or 'dark')
const heroBgVariantMap: Record<string, 'light' | 'dark'> = {
  'life-insurance': 'light',
  'health-insurance': 'dark',
  'term-life': 'light',
  'child-planning': 'dark',
  'child-wedding': 'light',
  'retirement': 'light',
  'tax-planning': 'dark',
  'critical-illness': 'light',
  'cancer-cover': 'dark',
  'keyman-insurance': 'light',
  'group-health': 'dark',
  'personal-accident': 'light',
  'protection': 'dark',
  'savings': 'light',
  'health': 'dark',
}

export default function ServicePageTemplate({ slug }: ServicePageTemplateProps) {
  const { t, lang } = useLang()

  // Retrieve service specific translations from global services object
  const servicesData = t.services as any
  const pageData = servicesData?.[slug]

  if (!pageData) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[50vh] flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-navy">Service Not Found</h1>
        <p className="text-slate-500 mt-2">The requested service page does not exist or has not been initialized.</p>
      </div>
    )
  }

  const isHub = slug === 'protection' || slug === 'savings' || slug === 'health'
  const bgVariant = heroBgVariantMap[slug] || 'light'

  // Map individual section data from translations
  const hero = pageData.hero || {}
  const problem = pageData.problem || {}
  const howItWorks = pageData.howItWorks || {}
  const plans = pageData.plans || {}
  const calculator = pageData.calculator || {}
  const testimonial = pageData.testimonial || {}
  const faq = pageData.faq || {}
  const crossSell = pageData.crossSell || {}
  const finalCta = pageData.finalCta || {}

  // Standardize calculators routing mapping
  const calcLinkMap: Record<string, string> = {
    premium: '/calculators/premium',
    'policy-health': '/calculators/policy-health',
    'life-insurance': '/calculators/life-insurance',
    maturity: '/calculators/maturity',
    retirement: '/calculators/retirement',
  }
  const calcLink = calcLinkMap[calculator.type] || '/calculators/premium'

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <ServiceHero
        slug={slug}
        category={pageData.category || ''}
        h1={hero.h1 || ''}
        subheadline={hero.sub || ''}
        stats={hero.stats || []}
        whatsappPrefill={hero.whatsappPrefill || ''}
        calculatorLink={isHub ? '' : calcLink}
        calculatorLabel={calculator.btnText || ''}
        bgVariant={bgVariant}
        lang={lang}
      />

      {/* 2. PROBLEM SECTION (Skip on category hubs) */}
      {!isHub && problem.title && problem.cards && (
        <ProblemSection title={problem.title} cards={problem.cards} />
      )}

      {/* 3. HOW IT WORKS SECTION (Skip on category hubs) */}
      {!isHub && howItWorks.title && howItWorks.steps && (
        <HowItWorks title={howItWorks.title} steps={howItWorks.steps} />
      )}

      {/* 4. PLAN CARDS OR NAVIGATION HUB GRID */}
      {(plans.items || pageData.childPages) && (
        <PlanCards
          title={isHub ? pageData.plansTitle : plans.title}
          plans={plans.items || []}
          childPages={pageData.childPages || []}
          isHub={isHub}
          lang={lang}
        />
      )}

      {/* 5. CALCULATOR CTA SECTION (Skip on category hubs) */}
      {!isHub && calculator.title && (
        <CalculatorCTA
          title={calculator.title}
          desc={calculator.desc}
          btnText={calculator.btnText}
          calculatorLink={calcLink}
          lang={lang}
        />
      )}

      {/* 6. TESTIMONIAL SECTION (Skip on category hubs) */}
      {!isHub && testimonial.quote && (
        <ServiceTestimonial testimonial={testimonial} lang={lang} />
      )}

      {/* 7. FAQ SECTION */}
      {faq.title && faq.items && (
        <ServiceFAQ title={faq.title} faqs={faq.items} slug={slug} />
      )}

      {/* 8. CROSS-SELL SECTION (Skip on category hubs) */}
      {!isHub && crossSell.title && crossSell.links && (
        <CrossSell title={crossSell.title} relatedSlugs={crossSell.links} />
      )}

      {/* 9. FINAL CTA SECTION */}
      <ServiceCTA
        title={finalCta.title || ''}
        subheadline={finalCta.sub || ''}
        whatsappPrefill={finalCta.whatsappPrefill || ''}
        lang={lang}
      />
    </div>
  )
}
