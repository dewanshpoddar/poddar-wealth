'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/lib/LangContext'

interface LangToggleProps {
  scrolled?: boolean
}

/**
 * Language toggle with:
 * - Spring-animated sliding pill (framer-motion)
 * - Click / tap support
 * - Touch swipe: swipe left → EN, swipe right → HI
 * - Mouse drag: drag left → EN, drag right → HI
 * - Keyboard: focused with Tab, toggle with Space/Enter
 */
export default function LangToggle({ scrolled = false }: LangToggleProps) {
  const { lang, setLang } = useLang()
  const dragStartX = useRef<number | null>(null)

  // ── Touch handlers (mobile / tablet) ──────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return
    const delta = e.changedTouches[0].clientX - dragStartX.current
    if (Math.abs(delta) > 20) {
      setLang(delta > 0 ? 'hi' : 'en')
    }
    dragStartX.current = null
  }

  // ── Mouse drag handlers (desktop) ─────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX
  }
  const onMouseUp = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 16) {
      setLang(delta > 0 ? 'hi' : 'en')
    }
    dragStartX.current = null
  }

  // ── Keyboard ───────────────────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      setLang(lang === 'en' ? 'hi' : 'en')
    }
    if (e.key === 'ArrowLeft') setLang('en')
    if (e.key === 'ArrowRight') setLang('hi')
  }

  const bg    = scrolled ? 'bg-white/10' : 'bg-gray-100'
  const pill  = scrolled ? 'bg-gold'     : 'bg-navy'
  const enCls = scrolled
    ? lang === 'en' ? 'text-white' : 'text-white/40 hover:text-white/70'
    : lang === 'en' ? 'text-white' : 'text-gray-400 hover:text-navy'
  const hiCls = scrolled
    ? lang === 'hi' ? 'text-white' : 'text-white/40 hover:text-white/70'
    : lang === 'hi' ? 'text-white' : 'text-gray-400 hover:text-navy'

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`pw-lang-toggle relative border-none select-none cursor-pointer transition-colors duration-500 ${bg}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Sliding pill */}
      <motion.div
        className={`absolute top-1 bottom-1 rounded-md shadow-md z-0 transition-colors duration-500 ${pill}`}
        initial={false}
        animate={{
          left:  lang === 'en' ? '4px' : 'calc(50% + 2px)',
          width: 'calc(50% - 6px)',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />

      {/* EN button */}
      <button
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
        className={`pw-lang-btn relative z-10 text-[11px] font-bold transition-colors duration-300 ${enCls}`}
      >
        EN
      </button>

      {/* HI button */}
      <button
        aria-pressed={lang === 'hi'}
        onClick={() => setLang('hi')}
        className={`pw-lang-btn relative z-10 text-[11px] font-bold transition-colors duration-300 ${hiCls}`}
      >
        हिंदी
      </button>
    </div>
  )
}
