'use client'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ArrowRight } from 'lucide-react'

interface CrossSellProps {
  title: string
  relatedSlugs: string[]
}

export default function CrossSell({ title, relatedSlugs }: CrossSellProps) {
  const { t, lang } = useLang()
  const isHi = lang === 'hi'

  const items = t.services?.items || []

  // Resolve related service data from global services translations list
  const resolvedCards = relatedSlugs.map((slug) => {
    const targetHref = `/services/${slug}`
    const matched = items.find(
      (item: any) => item.href === targetHref || item.href?.endsWith(slug)
    )
    return {
      title: matched?.title || slug.replace('-', ' '),
      desc: matched?.desc || '',
      href: targetHref,
    }
  })

  return (
    <section className="py-20 bg-white text-navy border-t border-gray-150/40">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-12 tracking-tight">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="bg-slate-50 border border-gray-150/50 rounded-2xl p-6 md:p-8 hover:shadow-card hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-navy group-hover:text-gold transition-colors duration-200 mb-3">
                  {card.title}
                </h3>
                <p className="text-13 text-slate-500 font-medium leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>
              <div className="text-12 font-bold text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                <span>{isHi ? 'अधिक जानें' : 'Learn More'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
