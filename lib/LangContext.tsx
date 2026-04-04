'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import en from './en.json'
import hi from './hi.json'

type Lang = 'en' | 'hi'
type Translations = typeof en

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = lang === 'hi' ? hi as unknown as Translations : en
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
