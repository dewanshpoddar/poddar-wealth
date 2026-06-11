'use client'

import dynamic from 'next/dynamic'

const LifeInsuranceCalculator = dynamic(() => import('@/app/calculators/life-insurance/page'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100/50 rounded-3xl h-96 w-full" />
})
const RetirementCalculator = dynamic(() => import('@/app/calculators/retirement/page'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100/50 rounded-3xl h-96 w-full" />
})
const PolicyHealthCalculator = dynamic(() => import('@/app/calculators/policy-health/page'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100/50 rounded-3xl h-96 w-full" />
})
const PremiumCalculator = dynamic(() => import('@/app/calculators/premium/page'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100/50 rounded-3xl h-96 w-full" />
})

interface LifeStageCalculatorProps {
  slug: string
}

export default function LifeStageCalculator({ slug }: LifeStageCalculatorProps) {
  switch (slug) {
    case 'first-job':
    case 'bought-home':
      return <LifeInsuranceCalculator hideHero={true} />
    case 'just-married':
    case 'protect-health':
      return <PolicyHealthCalculator hideHero={true} />
    case 'became-parent':
      return <PremiumCalculator hideHero={true} />
    case 'planning-retirement':
      return <RetirementCalculator hideHero={true} />
    default:
      return null
  }
}
