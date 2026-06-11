'use client'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { TOP_PLANS } from '@/lib/data/top-plans'

const colorStyles: Record<string, { bg: string; text: string }> = {
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400' },
}

export default function PopularPlans() {
  const { lang } = useLang()
  const hi = lang === 'hi'

  const eyebrow = hi ? 'अजय सर द्वारा चुनिंदा' : 'HANDPICKED BY AJAY SIR'
  const title = hi ? 'लोकप्रिय प्लान' : 'Popular Plans'
  const subtitle = hi 
    ? '31 वर्षों के अनुभव और 5,000+ परिवारों के विश्वास पर आधारित' 
    : 'Based on 31 years of experience and 5,000+ families advised'

  return (
    <section className="bg-gray-950 py-16 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2 text-center">
            {eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            {title}
          </h2>
          <p className="text-gray-400 mt-2 text-center">
            {subtitle}
          </p>
        </div>

        {/* Premium 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOP_PLANS.map((plan) => {
            const Icon = (Icons as any)[plan.icon] || Icons.HelpCircle
            const colorStyle = colorStyles[plan.color] || colorStyles.amber
            const tag = hi ? plan.tagHi : plan.tag
            const type = hi ? plan.typeHi : plan.type
            const highlight = hi ? plan.highlightHi : plan.highlight
            const minPremium = hi ? plan.minPremiumHi : plan.minPremium

            return (
              <Link
                key={plan.id}
                href={plan.link}
                className="group bg-gray-900 border border-gray-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colorStyle.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colorStyle.text}`} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{type}</p>

                  <p className="text-sm text-gray-300 mt-3 leading-relaxed">{highlight}</p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-500">
                    {hi ? `${minPremium} से` : `From ${minPremium}`}
                  </span>
                  <span className="text-xs text-amber-500 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    {hi ? 'और जानें' : 'Learn more'} →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
