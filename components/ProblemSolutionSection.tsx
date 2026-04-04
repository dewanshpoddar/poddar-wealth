'use client'
import { useLang } from '@/lib/LangContext'

export default function ProblemSolutionSection() {
  const { t } = useLang()

  return (
    <div className="pw-banner">
      <div className="flex items-center gap-2.5">
        <div className="pw-banner-pulse" />
        <span className="text-12 font-medium text-white">{t.banner.text}</span>
        <div className="flex gap-2">
          {t.banner.plans.map((plan: string, i: number) => (
            <span key={i} className="pw-banner-plan">{plan}</span>
          ))}
        </div>
      </div>
      <span className="text-11 text-white font-medium cursor-pointer underline">{t.banner.cta}</span>
    </div>
  )
}
