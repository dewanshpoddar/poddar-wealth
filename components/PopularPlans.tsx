'use client'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { TOP_PLANS } from '@/lib/data/top-plans'

export default function PopularPlans() {
  const { lang } = useLang()
  const hi = lang === 'hi'

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {hi ? 'लोकप्रिय प्लान' : 'Popular Plans'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {hi
              ? '31 साल के अनुभव से अजय सर द्वारा चुने गए'
              : 'Handpicked by Ajay sir based on 31 years of experience'}
          </p>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {TOP_PLANS.map((plan) => (
            <Link
              key={plan.id}
              href={plan.link}
              className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-200 hover:border-amber-300 p-4 transition-all hover:shadow-sm snap-start group"
            >
              <span className="inline-block bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3">
                {plan.tag}
              </span>
              <p className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-amber-600 transition-colors">
                {plan.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">{plan.type}</p>
              <p className="text-xs text-amber-500 font-semibold mt-3">
                {hi ? 'जानें →' : 'Learn more →'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
