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
      return <LifeInsuranceCalculator  />
    case 'just-married':
    case 'protect-health':
      return <PolicyHealthCalculator  />
    case 'became-parent':
      return <PremiumCalculator  />
    case 'planning-retirement':
      return <RetirementCalculator  />
    default:
      return null
  }
}
