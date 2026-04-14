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

const STORAGE_KEY = 'pw_lang'

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
})

export function LangProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage on first render (falls back to 'en')
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'hi' ? 'hi' : 'en'
  })

  // Persist to localStorage and sync <html lang> whenever language changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
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
