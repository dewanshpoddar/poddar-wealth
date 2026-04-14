'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from './en.json'
import hi from './hi.json'

type Lang = 'en' | 'hi'
type Translations = typeof en

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const COOKIE_KEY   = 'pw_lang'
const STORAGE_KEY  = 'pw_lang'
const COOKIE_MAX   = 60 * 60 * 24 * 365  // 1 year

// ── Cookie helpers (no external dependency) ──────────────────────────────────
function getCookie(): Lang | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(/(?:^|;\s*)pw_lang=([^;]+)/)
  const v = m?.[1]
  return v === 'hi' ? 'hi' : v === 'en' ? 'en' : null
}

function setCookie(lang: Lang) {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=${COOKIE_MAX}; SameSite=Lax`
}

// ── URL param helper ─────────────────────────────────────────────────────────
function getUrlParam(): Lang | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('lang')
  return v === 'hi' ? 'hi' : v === 'en' ? 'en' : null
}

// ── Browser language detection (first-time visitors) ────────────────────────
// Follows Amazon/Facebook pattern: detect Hindi browser users automatically
function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'en'
  const langs = navigator.languages ?? [navigator.language]
  for (const l of langs) {
    if (l.startsWith('hi')) return 'hi'
  }
  return 'en'
}

/**
 * Priority chain (same as Amazon/Facebook/Google):
 *  1. URL ?lang= param          — explicit link, highest trust
 *  2. Cookie pw_lang            — returning user, private-mode safe
 *  3. localStorage pw_lang      — fast read, same-device persistence
 *  4. navigator.languages       — first-time visitor auto-detect
 *  5. 'en'                      — safe default
 */
function resolveInitialLang(): Lang {
  const fromUrl     = getUrlParam()
  if (fromUrl) return fromUrl

  const fromCookie  = getCookie()
  if (fromCookie) return fromCookie

  try {
    const fromStore = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (fromStore === 'hi' || fromStore === 'en') return fromStore
  } catch { /* private mode may throw */ }

  return detectBrowserLang()
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(resolveInitialLang)

  // On every lang change: write to cookie + localStorage + html[lang]
  useEffect(() => {
    setCookie(lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* private mode */ }
    document.documentElement.lang = lang

    // If page was loaded with ?lang= param, clean it from URL (canonical URLs)
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.delete('lang')
      window.history.replaceState({}, '', url.toString())
    }
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  const t = lang === 'hi' ? hi as unknown as Translations : en

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
