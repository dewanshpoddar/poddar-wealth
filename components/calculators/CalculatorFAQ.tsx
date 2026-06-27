'use client'
import React from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface CalculatorFAQProps {
  faqs: FAQItem[]
}

export default function CalculatorFAQ({ faqs }: CalculatorFAQProps) {
  if (!faqs || faqs.length === 0) return null

  // JSON-LD FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-tight">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <details
              key={idx}
              className="group border border-gray-100 bg-gray-50/50 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-200"
            >
              <summary className="flex justify-between items-center px-4 py-3.5 text-xs font-semibold text-gray-800 hover:text-gray-950 cursor-pointer select-none">
                <span>{item.question}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200 text-[10px]">
                  ▾
                </span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-xs text-gray-600 border-t border-gray-100/50 bg-white leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
