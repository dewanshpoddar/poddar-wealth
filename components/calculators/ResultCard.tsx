'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LucideIcon, Share2, Check } from 'lucide-react'
import { useLang } from '@/lib/LangContext'

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

  // New props for animations, sharing, and celebration
  rawValue?: number
  valueSuffix?: string
  isCurrency?: boolean
  shareText?: string
  celebrationText?: string
  CelebrationIcon?: LucideIcon
  pulseIcon?: boolean
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
  children,
  rawValue,
  valueSuffix = '',
  isCurrency = true,
  shareText,
  celebrationText,
  CelebrationIcon,
  pulseIcon = false
}: ResultCardProps) {
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)
  const [animatedValue, setAnimatedValue] = useState<number | null>(rawValue !== undefined ? 0 : null)

  const bgClasses = {
    positive: 'bg-emerald-50 border border-emerald-100 text-emerald-900',
    neutral: 'bg-blue-50 border border-blue-100 text-blue-900',
    caution: 'bg-amber-50 border border-amber-100 text-amber-900'
  }

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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const textToShare = shareText || `I calculated my result on Poddar Wealth.\nTry it: ${window.location.href}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: label || 'Calculation Result',
          text: textToShare,
          url: window.location.href
        })
      } catch (err) {
        console.error('Sharing failed:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Clipboard copy failed:', err)
      }
    }
  }

  const displayVal = animatedValue !== null
    ? `${isCurrency ? '₹' : ''}${animatedValue.toLocaleString('en-IN')}${valueSuffix}`
    : value

  return (
    <div className={`rounded-xl p-5 ${bgClasses[type]} result-card-container transition-all duration-300 relative overflow-hidden`}>
      {/* CSS Styles injection */}
      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheckPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes scaleUpCard {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes greenPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.4)); }
        }
        .animate-drawCircle {
          animation: drawCircle 0.5s ease-out forwards;
        }
        .animate-drawCheckPath {
          animation: drawCheckPath 0.3s ease-out 0.4s forwards;
        }
        .result-card-container {
          animation: scaleUpCard 0.2s ease-out forwards;
        }
        .animate-bounceIn {
          animation: bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-greenPulse {
          animation: greenPulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* Main Title Row with Share Button */}
      <div className="flex justify-between items-start gap-4 mb-2">
        <div className="text-sm text-gray-600 font-medium">
          {label}
        </div>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer bg-white/90 hover:bg-white border border-gray-200/60 px-2.5 py-1 rounded-lg shadow-sm active:scale-[0.96] transform"
          aria-label="Share this calculation"
        >
          <Share2 className="w-3 h-3" />
          <span>{copied ? (lang === 'hi' ? 'कॉपी!' : 'Copied!') : (lang === 'hi' ? 'शेयर ↗' : 'Share ↗')}</span>
        </button>
      </div>

      {/* Numeric Value + Checkmark Animation */}
      <div className="flex items-center gap-2">
        <div className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {displayVal}
        </div>
        {rawValue !== undefined && (
          <svg
            className="w-5 h-5 text-emerald-500 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
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

      {/* Subtext */}
      {subtext && (
        <div className="text-xs italic text-gray-500 mt-1.5">
          {subtext}
        </div>
      )}

      {/* Springy Contextual Celebration Moment */}
      {celebrationText && (
        <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 text-xs font-semibold animate-bounceIn w-fit">
          {CelebrationIcon && (
            <CelebrationIcon className={`w-3.5 h-3.5 flex-shrink-0 ${pulseIcon ? 'animate-greenPulse' : ''}`} />
          )}
          <span>{celebrationText}</span>
        </div>
      )}

      {children}

      {inlineLinkText && inlineLinkHref && (
        <div className="mt-4 pt-3 border-t border-black/5">
          <Link
            href={inlineLinkHref}
            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {inlineLinkText}
          </Link>
        </div>
      )}

      {insightText && (
        <div className="text-xs mt-3 flex items-start gap-2 pt-2.5 border-t border-black/5">
          {InsightIcon && <InsightIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
          <span className="text-gray-700 leading-relaxed">{insightText}</span>
        </div>
      )}
    </div>
  )
}
