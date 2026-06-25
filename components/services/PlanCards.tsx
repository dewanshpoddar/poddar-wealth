'use client'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'
import { ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react'

interface Plan {
  name: string
  num?: string
  type: string
  benefit: string
  premium: string
  coverage: string
  term: string
  badge?: string
  whatsappPrefill: string
}

interface ChildPage {
  title: string
  desc: string
  href: string
  tag?: string
}

interface PlanCardsProps {
  title: string
  plans?: Plan[]
  childPages?: ChildPage[]
  isHub?: boolean
  lang: 'en' | 'hi' | 'bn'
}

export default function PlanCards({
  title,
  plans = [],
  childPages = [],
  isHub = false,
  lang,
}: PlanCardsProps) {
  const isHi = lang === 'hi'

  return (
    <section className="py-24 bg-gray-50 text-navy relative">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-12 bg-gold mx-auto rounded-full" />
        </div>

        {isHub && childPages.length > 0 ? (
          /* Hub navigation cards for parent category pages */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {childPages.map((page, idx) => (
              <Link
                key={idx}
                href={page.href}
                className="bg-white border border-gray-200/60 rounded-2xl p-8 hover:shadow-card-hover hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {page.tag && (
                      <span className="px-3 py-1 bg-gold/10 text-gold text-11 font-bold tracking-widest uppercase rounded-full">
                        {page.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors duration-250 mb-3">
                    {page.title}
                  </h3>
                  <p className="text-14 text-slate-500 font-medium leading-relaxed mb-6">
                    {page.desc}
                  </p>
                </div>
                <div className="text-13 font-bold text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-250">
                  {isHi ? 'विवरण देखें' : 'View Details'} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Recommended plans list for specific service pages */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {plans.map((plan, idx) => {
                const whatsappUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                  plan.whatsappPrefill
                )}`

                const hasBadge = !!plan.badge

                return (
                  <div
                    key={idx}
                    className={`bg-white border rounded-2xl p-6 relative hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group ${
                      hasBadge
                        ? 'border-gold shadow-gold-sm hover:border-gold-hover'
                        : 'border-gray-200/60 hover:border-gold/30'
                    }`}
                  >
                    {/* Badge */}
                    {hasBadge && (
                      <div className="absolute -top-3.5 right-6 py-1 px-4 bg-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      {/* Plan Header */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-lg font-bold text-navy group-hover:text-gold transition-colors duration-250 leading-tight">
                            {plan.name}
                          </h3>
                          {plan.num && (
                            <span className="text-12 font-bold text-slate-400">{plan.num}</span>
                          )}
                        </div>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-100 text-slate-600 text-11 font-bold uppercase tracking-wide rounded-md">
                          {plan.type}
                        </span>
                      </div>

                      {/* Key Benefit */}
                      <div className="mb-6 py-3 border-t border-b border-gray-100">
                        <p className="text-13 text-slate-600 font-bold leading-normal flex items-start gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                          <span>{plan.benefit}</span>
                        </p>
                      </div>

                      {/* Detail Metrics */}
                      <div className="space-y-2 mb-8 text-13">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">
                            {isHi ? 'प्रीमियम शुरू:' : 'Starts From:'}
                          </span>
                          <span className="font-bold text-navy">{plan.premium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">
                            {isHi ? 'कवरेज सीमा:' : 'Coverage:'}
                          </span>
                          <span className="font-bold text-navy">{plan.coverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">
                            {isHi ? 'पॉलिसी टर्म:' : 'Policy Term:'}
                          </span>
                          <span className="font-bold text-navy">{plan.term}</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Action */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl font-bold text-14 transition-all duration-300 min-h-[44px] ${
                        hasBadge
                          ? 'bg-gold hover:bg-gold-hover text-white'
                          : 'bg-cream hover:bg-gold/15 text-gold border border-gold/20'
                      }`}
                    >
                      {isHi ? 'कोटेशन प्राप्त करें' : 'Get Quote'} →
                    </a>
                  </div>
                )
              })}
            </div>

            {/* AI Advisor Prompt */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 py-4 px-6 rounded-2xl bg-white border border-gray-150 shadow-sm">
                <HelpCircle className="w-5 h-5 text-gold" />
                <span className="text-14 font-semibold text-slate-600">
                  {isHi
                    ? 'समझ नहीं आ रहा कि कौन सा प्लान चुनें? हमारे AI एडवाइजर से पूछें।'
                    : 'Not sure which plan matches your goals? Let our AI advisor help.'}
                </span>
                <Link
                  href="/ai-advisor"
                  className="text-14 font-bold text-gold hover:text-gold-hover underline flex items-center gap-0.5"
                >
                  {isHi ? 'अभी चैट करें' : 'Talk with Poddar Ji'} →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
