'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'

export default function NotFound() {
  const { lang } = useLang()

  const content = {
    en: {
      code: '404',
      title: "This page doesn't exist",
      subtitle: "The page you're looking for may have moved or never existed. Here are some helpful links:",
      home: 'Go Home',
      products: 'View Insurance Plans',
      contact: 'Contact Us',
      ai: 'Ask Poddar Ji',
    },
    hi: {
      code: '404',
      title: 'यह पृष्ठ मौजूद नहीं है',
      subtitle: 'जो पेज आप ढूंढ रहे हैं वह शायद हट गया है या कभी था ही नहीं। कुछ उपयोगी लिंक:',
      home: 'होम पर जाएं',
      products: 'बीमा प्लान देखें',
      contact: 'संपर्क करें',
      ai: 'पोद्दार जी से पूछें',
    },
  }

  const c = content[lang as keyof typeof content] ?? content.en

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-20">
      <div className="max-w-lg mx-auto text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center mb-4">
            <span className="text-5xl">🔍</span>
          </div>
          <div className="font-display font-bold text-8xl text-navy/10 leading-none select-none">
            {c.code}
          </div>
        </div>

        <h1 className="font-display font-bold text-2xl md:text-3xl text-navy mb-3">
          {c.title}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          {c.subtitle}
        </p>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/" className="flex items-center justify-center gap-2 bg-navy text-white font-bold text-sm py-3 px-4 rounded-xl hover:bg-navy/90 transition-colors">
            🏠 {c.home}
          </Link>
          <Link href="/products" className="flex items-center justify-center gap-2 bg-gold text-white font-bold text-sm py-3 px-4 rounded-xl hover:bg-amber-600 transition-colors">
            🛡️ {c.products}
          </Link>
          <Link href="/contact" className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-3 px-4 rounded-xl hover:border-navy hover:text-navy transition-colors">
            📞 {c.contact}
          </Link>
          <Link href="/ai-advisor" className="flex items-center justify-center gap-2 border border-gold/30 text-amber-700 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-gold/5 transition-colors">
            ✨ {c.ai}
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          {lang === 'en'
            ? 'Need help? Call Ajay sir directly: '
            : 'मदद चाहिए? अजय सर को सीधे कॉल करें: '}
          <a href="tel:9415313434" className="font-bold text-navy hover:text-gold transition-colors">
            9415313434
          </a>
        </p>
      </div>
    </div>
  )
}
