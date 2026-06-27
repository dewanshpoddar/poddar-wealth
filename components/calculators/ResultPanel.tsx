'use client'
import React, { useState, useEffect } from 'react'
import { Info, AlertCircle, Lightbulb, ChevronRight, Share2, MessageCircle } from 'lucide-react'
import LeadGate from './LeadGate'
import { useLang } from '@/lib/LangContext'

interface ResultRow {
  label: string
  value: string | number
  isTotal?: boolean
}

interface CrossLink {
  label: string
  href?: string
  onClick?: () => void
  colorClass?: string
  icon: React.ComponentType<{ className?: string }>
}

interface ResultPanelProps {
  value: string
  rawValue?: number
  label: string
  contextText?: string
  humanLineText?: string
  HumanLineIcon?: React.ComponentType<{ className?: string }>
  visibleRows: ResultRow[]
  gatedRows: ResultRow[]
  insightText?: string
  crossLinks?: CrossLink[]
  isUnlocked: boolean
  onUnlock: (phone: string) => void
  calculatorName: string
  inputs: Record<string, any>
  resultSummary?: Record<string, any>
  whatsappMessage: string
  isCurrency?: boolean
  valueSuffix?: string
  children?: React.ReactNode
}

export default function ResultPanel({
  value,
  rawValue,
  label,
  contextText,
  humanLineText,
  HumanLineIcon,
  visibleRows,
  gatedRows,
  insightText,
  crossLinks,
  isUnlocked,
  onUnlock,
  calculatorName,
  inputs,
  resultSummary,
  whatsappMessage,
  isCurrency = true,
  valueSuffix = '',
  children
}: ResultPanelProps) {
  const { lang } = useLang()
  const [animatedValue, setAnimatedValue] = useState<number | null>(rawValue !== undefined ? 0 : null)

  // Count-up animation
  useEffect(() => {
    if (rawValue === undefined || rawValue === null) {
      setAnimatedValue(null)
      return
    }

    let active = true
    const duration = 800
    const start = performance.now()

    const step = (now: number) => {
      if (!active) return
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const current = Math.round(rawValue * eased)
      setAnimatedValue(current)
      if (t < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
    return () => {
      active = false
    }
  }, [rawValue])

  const displayVal = animatedValue !== null
    ? `${isCurrency ? '₹' : ''}${animatedValue.toLocaleString('en-IN')}${valueSuffix}`
    : value

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm flex flex-col h-full animate-fadeIn">
      {/* Local keyframe animations */}
      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheckPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-drawCircle {
          animation: drawCircle 0.5s ease-out forwards;
        }
        .animate-drawCheckPath {
          animation: drawCheckPath 0.3s ease-out 0.4s forwards;
        }
        .shimmer-top-border {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 50%, #d97706 100%);
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* ── DARK TOP SECTION (Hero Card) ── */}
      <div className="relative bg-gradient-to-br from-[#0f1225] via-[#141c38] to-[#0d1225] text-white p-5 pt-6 flex flex-col justify-between">
        {/* Shimmer line top border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] shimmer-top-border" />

        {/* Brand/Result Status */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/30 tracking-wider uppercase select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Live Result</span>
          </div>
          <span className="text-[10px] text-white/40 font-medium select-none">{label}</span>
        </div>

        {/* Big Number and Checkmark */}
        <div className="flex items-center gap-2 mb-1">
          <div className="text-3xl md:text-4xl font-bold text-amber-400 tracking-tight">
            {displayVal}
          </div>
          {rawValue !== undefined && (
            <svg
              className="w-5 h-5 text-emerald-500 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                strokeDasharray="63"
                strokeDashoffset="63"
                className="animate-drawCircle"
              />
              <path
                d="m9 12 2 2 4-4"
                strokeDasharray="12"
                strokeDashoffset="12"
                className="animate-drawCheckPath"
              />
            </svg>
          )}
        </div>

        {/* Context subtitle */}
        {contextText && (
          <div className="text-[10px] text-white/40 font-medium mb-3">
            {contextText}
          </div>
        )}

        {/* Human line description */}
        {humanLineText && (
          <div className="flex items-center gap-1.5 text-xs text-white/70 italic border-t border-white/5 pt-2.5">
            {HumanLineIcon && <HumanLineIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
            <span>{humanLineText}</span>
          </div>
        )}
      </div>

      {/* ── LIGHT MIDDLE SECTION (Breakdowns) ── */}
      <div className="bg-white p-4 flex-1">
        {/* Visible Rows */}
        <div className="space-y-2 mb-3">
          {visibleRows.map((row, index) => (
            <div
              key={index}
              className={`flex justify-between items-center text-xs pb-2 border-b border-gray-50 last:border-0 ${
                row.isTotal ? 'border-t border-gray-200 pt-2 font-bold text-amber-700' : 'text-gray-500'
              }`}
            >
              <span className={row.isTotal ? 'text-gray-900' : ''}>{row.label}</span>
              <span className={row.isTotal ? 'text-amber-700 text-sm' : 'text-gray-900 font-medium tabular-nums'}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {children}
      </div>

      {/* ── GATED / UNLOCKED FOOTER SECTION ── */}
      <div className="relative bg-gray-50 border-t border-gray-100 flex-1 flex flex-col justify-between">
        {!isUnlocked ? (
          /* Locked Content Block */
          <div className="relative min-h-[160px] flex-1 flex flex-col justify-between">
            {/* Blurred placeholder rows */}
            <div className="blur-[4px] pointer-events-none select-none p-4 space-y-2.5 opacity-30 flex-1">
              {gatedRows.map((row, index) => (
                <div key={index} className="flex justify-between text-xs font-medium">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Shield/Lead Lock Overlay */}
            <LeadGate
              onUnlock={onUnlock}
              calculatorName={calculatorName}
              inputs={inputs}
              resultSummary={{ ...resultSummary, _mainResult: value }}
              whatsappMessage={whatsappMessage}
            />
          </div>
        ) : (
          /* Unlocked Content Block */
          <div className="flex-1 flex flex-col justify-between animate-fadeIn">
            {/* Real Unlocked Rows */}
            <div className="p-4 space-y-2">
              {gatedRows.map((row, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center text-xs pb-2 border-b border-gray-100 last:border-0 ${
                    row.isTotal ? 'border-t border-gray-200 pt-2 font-bold text-amber-700' : 'text-gray-500'
                  }`}
                >
                  <span className={row.isTotal ? 'text-gray-900 font-bold' : ''}>{row.label}</span>
                  <span className="text-gray-900 font-semibold tabular-nums">{row.value}</span>
                </div>
              ))}

              {/* Contextual Bulby Insight Line */}
              {insightText && (
                <div className="flex gap-2 p-3 bg-amber-50/50 border border-amber-100 text-amber-900 rounded-xl text-[11px] leading-relaxed mt-4">
                  <Lightbulb className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
                  <div>{insightText}</div>
                </div>
              )}
            </div>

            {/* Unlocked Actions / Cross Links */}
            {crossLinks && crossLinks.length > 0 && (
              <div className="border-t border-gray-100 mt-2 bg-white">
                {crossLinks.map((link, idx) => {
                  const LinkIcon = link.icon
                  const defaultColorClass = link.colorClass || 'text-gray-700 hover:text-[#d97706]'
                  
                  const content = (
                    <span className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{link.label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                  )

                  if (link.href) {
                    return (
                      <a
                        key={idx}
                        href={link.href}
                        className={`flex px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 text-[11px] font-semibold transition-colors cursor-pointer ${defaultColorClass}`}
                      >
                        {content}
                      </a>
                    )
                  }

                  return (
                    <button
                      key={idx}
                      onClick={link.onClick}
                      className={`w-full flex text-left px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 text-[11px] font-semibold transition-colors cursor-pointer ${defaultColorClass}`}
                    >
                      {content}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
