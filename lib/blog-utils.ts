/**
 * Shared blog constants and utilities.
 * Used by: BlogPreview, app/blog/page, app/blog/[slug]/page
 *
 * IMPORTANT: Keep icon imports here so consumers don't need to duplicate them.
 */

import { Shield, Heart, FileText, Calculator, ArrowLeftRight, BookOpen } from 'lucide-react'
import type { ComponentType } from 'react'

// ─── Category badge classes (used on card meta rows + related articles) ────

export const CATEGORY_COLORS: Record<string, string> = {
  'Life Insurance':   'bg-blue-50 text-blue-700 border-blue-200',
  'LIC Plans':        'bg-gold/10 text-amber-700 border-gold/30',
  'Health Insurance': 'bg-red-50 text-red-700 border-red-200',
  'Tax Planning':     'bg-green-50 text-green-700 border-green-200',
  'Claims':           'bg-purple-50 text-purple-700 border-purple-200',
  'Comparison':       'bg-amber-50 text-amber-700 border-amber-200',
  'Guides':           'bg-teal-50 text-teal-700 border-teal-200',
  'Child Plans':      'bg-pink-50 text-pink-700 border-pink-200',
}

export const CATEGORY_COLORS_DEFAULT = 'bg-gray-100 text-gray-600 border-gray-200'

// ─── Category header styles (solid-color hero blocks with icons) ───────────

export const CATEGORY_STYLES: Record<string, { bg: string; icon: ComponentType<{ className?: string }> }> = {
  'Life Insurance':   { bg: 'bg-blue-900',    icon: Shield },
  'Health Insurance': { bg: 'bg-emerald-800', icon: Heart },
  'LIC Plans':        { bg: 'bg-amber-800',   icon: FileText },
  'Tax Planning':     { bg: 'bg-indigo-900',  icon: Calculator },
  'Comparison':       { bg: 'bg-slate-800',   icon: ArrowLeftRight },
  'Claims':           { bg: 'bg-purple-950',  icon: FileText },
  'Guides':           { bg: 'bg-gray-900',    icon: BookOpen },
  'Child Plans':      { bg: 'bg-rose-900',    icon: Heart },
}

export const CATEGORY_STYLES_DEFAULT = { bg: 'bg-gray-900', icon: BookOpen }

// ─── Category filter list (blog listing page tabs) ────────────────────────

export const BLOG_CATEGORIES = [
  'All', 'Life Insurance', 'LIC Plans', 'Health Insurance',
  'Tax Planning', 'Claims', 'Comparison', 'Guides', 'Child Plans',
] as const

// ─── Date formatter ───────────────────────────────────────────────────────

/** Format a date string for display. Supports bilingual output. */
export function formatBlogDate(dateStr: string, lang: string = 'en') {
  const dateObj = new Date(dateStr)
  const formatted = dateObj.toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return lang === 'en' ? `Published: ${formatted}` : `प्रकाशित: ${formatted}`
}

/** Format date for card previews (no "Published:" prefix) */
export function formatBlogDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Reading time ─────────────────────────────────────────────────────────

/** Calculate reading time in minutes. Hindi uses char-count heuristic. */
export function getReadingTime(content: string, contentHi: string, lang: string) {
  return lang === 'hi'
    ? Math.ceil(contentHi.length / 5 / 200)
    : Math.ceil(content.split(/\s+/).length / 200)
}
