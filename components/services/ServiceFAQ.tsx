'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface ServiceFAQProps {
  title: string
  faqs: FAQItem[]
  slug: string
}

export default function ServiceFAQ({ title, faqs, slug }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  // Create FAQPage JSON-LD schema dynamically
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <section className="py-24 bg-gray-50 text-navy relative border-t border-gray-150/40">
      {/* Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-12 bg-gold mx-auto rounded-full" />
        </div>

        <div className="space-y-4 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200/50">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            const panelId = `faq-panel-${slug}-${idx}`
            const buttonId = `faq-button-${slug}-${idx}`

            return (
              <div
                key={idx}
                className={`border-b last:border-0 pb-4 last:pb-0 ${
                  isOpen ? 'border-gray-200' : 'border-gray-100'
                }`}
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between py-4 text-left font-bold text-16 md:text-18 text-navy hover:text-gold transition-colors duration-200 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="flex-shrink-0 ml-4 w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200/50 group">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-gold" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-slate-650" />
                    )}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[500px] opacity-100 mt-2 mb-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-14 md:text-15 text-slate-650 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
