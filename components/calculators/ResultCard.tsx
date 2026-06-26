'use client'
import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface ResultCardProps {
  value: string
  label: string
  subtext?: string
  type: 'positive' | 'neutral' | 'caution'
  inlineLinkText?: string
  inlineLinkHref?: string
  insightText?: string
  InsightIcon?: LucideIcon
  children?: React.ReactNode
}

export default function ResultCard({
  value,
  label,
  subtext,
  type,
  inlineLinkText,
  inlineLinkHref,
  insightText,
  InsightIcon,
  children
}: ResultCardProps) {
  const bgClasses = {
    positive: 'bg-emerald-50 border border-emerald-100 text-emerald-900',
    neutral: 'bg-blue-50 border border-blue-100 text-blue-900',
    caution: 'bg-amber-50 border border-amber-100 text-amber-900'
  }

  return (
    <div className={`rounded-xl p-5 ${bgClasses[type]} transition-all duration-300`}>
      <div className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {label}
      </div>
      {subtext && (
        <div className="text-sm italic text-gray-500 mt-1">
          {subtext}
        </div>
      )}

      {children}

      {inlineLinkText && inlineLinkHref && (
        <div className="mt-4 pt-3 border-t border-black/5">
          <Link
            href={inlineLinkHref}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {inlineLinkText}
          </Link>
        </div>
      )}

      {insightText && (
        <div className="text-sm mt-3 flex items-start gap-2 pt-2 border-t border-black/5">
          {InsightIcon && <InsightIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <span className="text-gray-700">{insightText}</span>
        </div>
      )}
    </div>
  )
}
