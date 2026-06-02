'use client'

import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { Home, Shield, Phone, BookOpen, Calculator, Sparkles, MessageCircle } from 'lucide-react'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function NotFound() {
  const { lang } = useLang()

  const content = {
    en: {
      code: '404',
      title: 'Page Not Found',
      titleHi: 'ये पेज नहीं मिला',
      subtitle: "The page you are looking for may have moved or doesn't exist. Let's get you back on track.",
      home: 'Go Home',
      products: 'Insurance Plans',
      contact: 'Contact Us',
      blog: 'Knowledge Blog',
      calculator: 'Premium Calculator',
      aiAdvisor: 'Ask Poddar Ji for Help',
      aiDesc: 'Chat with our intelligent bilingual AI assistant for instant insurance answers.',
      whatsappCta: 'Chat on WhatsApp',
      whatsappSub: 'Direct support from Ajay sir'
    },
    hi: {
      code: '404',
      title: 'पेज नहीं मिला',
      titleHi: 'ये पेज नहीं मिला',
      subtitle: 'जो पेज आप ढूंढ रहे हैं वह शायद हट गया है या मौजूद नहीं है। आइए आपको सही राह पर ले जाएं।',
      home: 'मुख्य पृष्ठ',
      products: 'बीमा प्लान्स',
      contact: 'संपर्क करें',
      blog: 'ज्ञान ब्लॉग',
      calculator: 'प्रीमियम कैलकुलेटर',
      aiAdvisor: 'पोद्दार जी से सहायता लें',
      aiDesc: 'तुरंत बीमा से जुड़े सवालों के जवाब के लिए हमारे हिंदी+इंग्लिश AI असिस्टेंट से बात करें।',
      whatsappCta: 'WhatsApp पर चैट करें',
      whatsappSub: 'अजय सर से सीधी सहायता'
    }
  }

  const c = content[lang as keyof typeof content] ?? content.en

  return (
    <div className="min-h-screen bg-navy text-white flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background radial gold glow decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1b4f72]/15 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="max-w-xl w-full text-center relative z-10 animate-fade-up">
        
        {/* Animated large 404 number */}
        <div className="mb-6">
          <div className="text-8xl md:text-9xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-gold via-amber-400 to-amber-600 select-none tracking-wider opacity-0" style={{ animation: 'fadeIn 1.2s ease-out forwards' }}>
            {c.code}
          </div>
          
          <div className="mt-2 text-gold/80 font-display font-semibold italic text-lg md:text-xl tracking-wide flex items-center justify-center gap-2">
            <span>&ldquo;{c.titleHi}&rdquo;</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            <span>{c.title}</span>
          </div>
        </div>

        <p className="text-white/60 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          {c.subtitle}
        </p>

        {/* Poddar Ji Chatbot Hero CTA */}
        <div className="bg-white/[0.04] border border-white/10 hover:border-gold/30 rounded-3xl p-5 mb-8 text-left transition-all duration-300 group shadow-lg">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-gold tracking-[0.15em] uppercase block mb-1">Interactive Assistant</span>
              <h3 className="font-display font-bold text-base text-white leading-tight mb-1 flex items-center gap-2 group-hover:text-gold transition-colors">
                {c.aiAdvisor}
              </h3>
              <p className="text-white/55 text-xs leading-relaxed">
                {c.aiDesc}
              </p>
              <Link 
                href="/ai-advisor"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:text-amber-505 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Start Chatting →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10 text-left">
          {[
            { label: c.home, href: '/', icon: <Home size={15} /> },
            { label: c.products, href: '/products', icon: <Shield size={15} /> },
            { label: c.contact, href: '/contact', icon: <Phone size={15} /> },
            { label: c.blog, href: '/blog', icon: <BookOpen size={15} /> },
            { label: c.calculator, href: '/calculators/life-insurance', icon: <Calculator size={15} /> },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className={`flex items-center gap-2.5 bg-white/[0.02] border border-white/5 hover:border-gold/25 rounded-xl py-3 px-4 text-xs font-semibold text-white/80 hover:text-white transition-all hover:bg-white/[0.04] cursor-pointer ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <span className="text-gold">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* WhatsApp Direct Support CTA at bottom */}
        <div className="border-t border-white/10 pt-8">
          <a
            href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi Ajay ji, I landed on a 404 page and need help.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3.5 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <MessageCircle size={18} className="fill-white text-green-500" />
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold leading-none">{c.whatsappCta}</div>
              <div className="text-[10px] text-white/70 font-medium mt-1 leading-none">{c.whatsappSub}</div>
            </div>
          </a>
        </div>

      </div>

      {/* Global CSS animation style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </div>
  )
}
