'use client'

import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ADVISOR_PHONE } from '@/lib/constants'
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react'

// Inline SVG components for trademarked social icons since they aren't in Lucide-react core
const Facebook = ({ size = 17 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const Youtube = ({ size = 17 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
)

const Linkedin = ({ size = 17 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)


export default function Footer() {
  const { t, lang, setLang } = useLang()
  const pathname = usePathname()

  if (pathname?.startsWith('/lp/')) return null

  const isHi = lang === 'hi'
  const isBn = lang === 'bn'

  const quickLinks = [
    { name: isBn ? 'হোম' : isHi ? 'मुख्य पृष्ठ' : 'Home', href: '/' },
    { name: isBn ? 'আমাদের সম্পর্কে' : isHi ? 'हमारे बारे में' : 'About Us', href: '/about' },
    { name: isBn ? 'পণ্য' : isHi ? 'उत्पाद' : 'Products', href: '/products' },
    { name: isBn ? 'পরিষেবা' : isHi ? 'सेवाएं' : 'Services', href: '/services' },
    { name: isBn ? 'ব্লগ' : isHi ? 'ব্লগ' : 'Blog', href: '/blog' },
    { name: isBn ? 'যোগাযোগ' : isHi ? 'সম্পর্ক করুন' : 'Contact', href: '/contact' },
    { name: isBn ? 'বন্ধুকে রেফার করুন' : isHi ? 'मित्र को रेफर करें' : 'Refer a Friend', href: '/refer' },
  ]

  const ourProducts = [
    { name: isBn ? 'এলআইসি সঞ্চয় পরিকল্পনা' : isHi ? 'LIC बचत योजनाएं' : 'LIC Savings Plans', href: '/services/life-insurance' },
    { name: isBn ? 'স্বাস্থ্য বীমা' : isHi ? 'स्वास्थ्य बीमा' : 'Health Insurance', href: '/services/health-insurance' },
    { name: isBn ? 'শিশু পরিকল্পনা' : isHi ? 'बाल योजना' : 'Child Plans', href: '/services/child-planning' },
    { name: isBn ? 'অবসর পরিকল্পনা' : isHi ? 'सेवानिवृत्ति योजना' : 'Retirement Plans', href: '/services/retirement' },
    { name: isBn ? 'টার্ম লাইফ' : isHi ? 'टर्म लाइफ' : 'Term Life', href: '/services/term-life' },
    { name: isBn ? 'ক্রিটিকাল ইলনেস' : isHi ? 'गंभीर बीमारी' : 'Critical Illness', href: '/services/critical-illness' },
  ]

  const onlineTools = [
    { name: isBn ? 'প্রিমিয়াম ক্যালকুলেটর' : isHi ? 'प्रीमियम कैलकुलेटर' : 'Premium Calculator', href: '/calculators/premium' },
    { name: isBn ? 'বীমা কুইজ' : isHi ? 'बीमा क्विज़' : 'Insurance Quiz', href: '/insurance-quiz' },
    { name: isBn ? 'ওয়েলথ ব্লুপ্রিন্ট' : isHi ? 'वेल्थ ब्लूप्रिंट' : 'Wealth Blueprint', href: '/#blueprint' },
    { name: isBn ? 'AI পলিসি বিশ্লেষক' : isHi ? 'AI पॉलिसी विश्लेषक' : 'AI Analyzer', href: '/analyzers/policy-document' },
    { name: isBn ? 'LIC ULIP NAV ট্র্যাকার' : isHi ? 'LIC ULIP NAV ट्रैकर' : 'NAV Tracker', href: '/nav-tracker' },
    { name: isBn ? 'ভিডিও' : isHi ? 'वीडियो' : 'Videos', href: '/videos' },
  ]

  const customerCare = [
    { name: isBn ? 'পলিশি রিনিউ করুন' : isHi ? 'पॉलिसी रिन्यू' : 'Renew Policy', href: '/renew' },
    { name: isBn ? 'দাবি সহায়তা' : isHi ? 'दावा सहायता' : 'Claim Support', href: '/claims' },
    { name: isBn ? 'পলিসি পুনরুজ্জীবন' : isHi ? 'पॉलिसी पुनरुद्धार' : 'Policy Revival', href: '/policy-revival' },
    { name: isBn ? 'MyLIC সহায়তা' : isHi ? 'MyLIC सहायता' : 'MyLIC Help', href: '/lic-help' },
    { name: isBn ? 'প্রিমিয়াম রিমাইন্ডার' : isHi ? 'प्रीमियम रिमाइंडर' : 'Premium Reminder', href: '/premium-reminder' },
    { name: isBn ? 'LIC বোনাস গণনা' : isHi ? 'LIC बोनस गणना' : 'LIC Bonus Calculator', href: '/lic-bonus' },
  ]

  return (
    <footer className="bg-gray-950 pt-20 pb-10 border-t border-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Main Grid Layout (8 columns on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 mb-16">
          
          {/* Column 1: Brand & Reviews */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md overflow-hidden flex-shrink-0">
                <Image 
                  src="/assets/pwm-logo.svg" 
                  alt="Poddar Wealth Logo" 
                  width={56} 
                  height={56} 
                  className="w-full h-full object-contain scale-110" 
                />
              </div>
              <div>
                <span className="text-white font-bold text-[14px] leading-snug block uppercase tracking-wider">
                  {isBn ? <>পোদ্দার ওয়েলথ<br />ম্যানেজমেন্ট</> : isHi ? <>पोद्दार वेल्थ<br />मैनेजमेंट</> : <>Poddar Wealth<br />Management</>}
                </span>
                <span className="text-amber-500 text-[10px] uppercase tracking-widest font-semibold mt-0.5 block">
                  {isBn ? '১৯৯৪ থেকে' : isHi ? 'स्थापना 1994' : 'Since 1994'}
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed font-medium">
              {isBn 
                ? '৩১ বছরেরও বেশি সময় ধরে সততা, সম্পূর্ণ স্বচ্ছতা এবং ব্যক্তিগত যত্নের সাথে ভারতের পরিবারগুলির ভবিষ্যৎ সুরক্ষিত করছি।'
                : isHi 
                ? '31 वर्षों से अधिक के अटूट विश्वास और व्यक्तिगत सेवा के साथ भारत के परिवारों के भविष्य को सुरक्षित कर रहे हैं।'
                : 'Securing the future of families across India for over 31 years with trust, absolute transparency, and personalized care.'}
            </p>

            {/* Google Reviews Block */}
            <div className="pt-2 border-t border-gray-900">
              <a
                href="https://www.google.com/maps/place/Poddar+Wealth+Management/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group"
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  <span>Google Review Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500 text-sm">
                    ★ ★ ★ ★ ★
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">
                    4.9 / 5.0
                  </span>
                  <span className="text-[11px] text-gray-500">
                    (154 {isBn ? 'রিভিউ' : isHi ? 'समीक्षाएं' : 'reviews'})
                  </span>
                </div>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-900/60">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={17} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={17} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={17} />
              </a>
              <a href={`https://wa.me/91${ADVISOR_PHONE}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="WhatsApp">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isBn ? 'সহজ লিঙ্কসমূহ' : isHi ? 'त्वरित लिंक्स' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Products */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isBn ? 'আমাদের পণ্য' : isHi ? 'हमारे उत्पाद' : 'Our Products'}
            </h3>
            <ul className="space-y-3">
              {ourProducts.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Online Tools */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isBn ? 'অনলাইন টুলস' : isHi ? 'ऑनलाइन टूल्स' : 'Online Tools'}
            </h3>
            <ul className="space-y-3 font-medium">
              {onlineTools.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/ai-advisor" 
                  className="text-amber-500 hover:text-amber-400 text-xs font-bold tracking-wide transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  {isBn ? 'পোদ্দার জী (AI উপদেষ্টা)' : isHi ? 'पोद्दार जी (AI सलाहकार)' : 'AI Advisor (Poddar Ji)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Customer Care */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isBn ? 'কাস্টমার কেয়ার' : isHi ? 'ग्राहक सेवा' : 'Customer Care'}
            </h3>
            <ul className="space-y-3">
              {customerCare.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Contact Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isBn ? 'যোগাযোগের তথ্য' : isHi ? 'संपर्क सूत्र' : 'Contact Details'}
            </h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-start gap-2.5">
                <MapPin className="text-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-gray-400">
                  {t.footer.address || 'AD Mall Compound, Vijay Chowk, Gorakhpur, U.P. 273001'}
                </span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Phone className="text-amber-500 w-4 h-4 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a 
                    href={`tel:+91${ADVISOR_PHONE}`} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 {ADVISOR_PHONE}
                  </a>
                  <a 
                    href="tel:+917007937104" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 7007937104
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="text-amber-500 w-4 h-4 flex-shrink-0" />
                <a 
                  href={`https://wa.me/91${ADVISOR_PHONE}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  WhatsApp: +91 {ADVISOR_PHONE.slice(0, 5)} {ADVISOR_PHONE.slice(5)}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="text-amber-500 w-4 h-4 flex-shrink-0" />
                <a 
                  href="mailto:poddarwealth@gmail.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  poddarwealth@gmail.com
                </a>
              </div>

              <div className="pt-2 border-t border-gray-900 flex flex-col gap-1">
                <span className="text-white/60 text-[10px] uppercase tracking-wider block">
                  {isBn ? 'অফিসের সময়' : isHi ? 'कार्यालय समय' : 'Office Hours'}
                </span>
                <span className="text-gray-500 text-[11px] font-medium">
                  {isBn ? 'সোম - শনি: সকাল ৯:০০ - সন্ধ্যা ৬:০০' : isHi ? 'सोमवार - शनिवार: सुबह 9:00 - शाम 6:00' : 'Mon - Sat: 9:00 AM - 6:00 PM'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
          
          {/* Copyright & Award */}
          <div className="text-gray-500 text-[11px] font-medium order-2 lg:order-1">
            {t.footer.rights || `© 2026 PODDAR WEALTH MANAGEMENT`}
            <span className="mx-2 hidden lg:inline">|</span>
            <span className="text-amber-500/80 font-bold block lg:inline mt-1 lg:mt-0">
              {isBn ? 'MDRT সদস্য | চেয়ারম্যানস ক্লাব অ্যাওয়ার্ডপ্রাপ্ত' : isHi ? 'एमडीआरटी (MDRT) सदस्य | चेयरमैन क्लब अवॉर्डी' : 'MDRT Member | Chairman\'s Club awardee'}
            </span>
          </div>

          {/* Links & Language Toggle */}
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 lg:gap-6 order-1 lg:order-2">
            <Link 
              href="/privacy-policy" 
              className="text-[11px] text-gray-500 hover:text-white font-medium transition-colors"
            >
              {isBn ? 'গোপনীয়তা নীতি' : isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </Link>
            <span className="text-gray-800">·</span>
            <Link 
              href="/terms" 
              className="text-[11px] text-gray-500 hover:text-white font-medium transition-colors"
            >
              {isBn ? 'শর্তাবলী' : isHi ? 'सेवा की शर्तें' : 'Terms of Service'}
            </Link>
            <span className="text-gray-800">·</span>
            
            {/* 3-Language Selector */}
            <div className="flex items-center gap-1.5 bg-gray-900/60 rounded-lg p-0.5 border border-gray-800">
              <button
                onClick={() => setLang('en')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                  lang === 'en' ? 'text-amber-500 bg-amber-500/10' : 'text-gray-500 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-gray-800">|</span>
              <button
                onClick={() => setLang('hi')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                  lang === 'hi' ? 'text-amber-500 bg-amber-500/10' : 'text-gray-500 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <span className="text-gray-800">|</span>
              <button
                onClick={() => setLang('bn')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                  lang === 'bn' ? 'text-amber-500 bg-amber-500/10' : 'text-gray-500 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Row */}
        <div className="mt-6 text-[10px] text-gray-600 text-center leading-relaxed italic border-t border-gray-900/40 pt-4 w-full">
          {t.footer.disclaimer || 'Insurance is the subject matter of solicitation. IRDAI Reg. No. XXXXXXXXXX'}
        </div>

      </div>
    </footer>
  )
}
