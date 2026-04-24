'use client'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'

export default function AgentTeaserStrip() {
  const { t } = useLang()
  return (
    <div className="bg-navy/5 border-y border-gold/10 py-6 px-8 text-center">
      <p className="text-[13px] text-slate-500">
        {t.homePage.agentStrip}{' '}
        <Link href="/become-advisor" className="text-gold font-semibold hover:underline">
          {t.homePage.agentStripCta}
        </Link>
      </p>
    </div>
  )
}
