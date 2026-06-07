'use client'

import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'
import { ADVISOR_PHONE } from '@/lib/constants'
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react'

export default function Footer() {
  const { t, lang } = useLang()
  const isHi = lang === 'hi'

  const quickLinks = [
    { name: isHi ? 'मुख्य पृष्ठ' : 'Home', href: '/' },
    { name: isHi ? 'हमारे बारे में' : 'About Us', href: '/about' },
    { name: t.nav.products || (isHi ? 'उत्पाद' : 'Products'), href: '/products' },
    { name: t.nav.services || (isHi ? 'सेवाएं' : 'Services'), href: '/services' },
    { name: isHi ? 'ब्लॉग' : 'Blog', href: '/blog' },
    { name: isHi ? 'संपर्क करें' : 'Contact', href: '/contact' },
  ]

  const resources = [
    { name: isHi ? 'प्रीमियम कैलकुलेटर' : 'Premium Calculator', href: '/calculators/premium' },
    { name: isHi ? 'AI पॉलिसी विश्लेषक' : 'AI Policy Analyzer', href: '/analyzers/policy-document' },
    { name: isHi ? 'इन्शुरन्स क्विज़' : 'Insurance Quiz', href: '/insurance-quiz' },
    { name: isHi ? 'वेल्थ ब्लूप्रिंट' : 'Wealth Blueprint', href: '/#blueprint' },
    { name: isHi ? 'बीमा सुगम गाइड' : 'Bima Sugam Guide', href: '/bima-sugam' },
    { name: isHi ? 'MyLIC सहायता' : 'MyLIC Help', href: '/lic-help' },
    { name: isHi ? 'प्रीमियम रिमाइंडर' : 'Premium Reminder', href: '/premium-reminder' },
    { name: isHi ? 'LIC बोनस गणना' : 'LIC Bonus Calculator', href: '/lic-bonus' },
    { name: isHi ? 'पॉलिसी पुनरुद्धार' : 'Policy Revival', href: '/policy-revival' },
  ]

  return (
    <footer className="bg-gray-950 pt-20 pb-10 border-t border-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Reviews */}
          <div className="space-y-6">
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
                  {isHi ? 'पोद्दार वेल्थ मैनेजमेंट' : 'Poddar Wealth'}
                </span>
                <span className="text-amber-500 text-[10px] uppercase tracking-widest font-semibold mt-0.5 block">
                  {isHi ? 'स्थापना 1994' : 'Since 1994'}
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-medium">
              {isHi 
                ? '31 वर्षों से अधिक के अटूट विश्वास और व्यक्तिगत सेवा के साथ गोरखपुर के परिवारों के भविष्य को सुरक्षित कर रहे हैं।'
                : 'Securing the future of Gorakhpur families for over 31 years with trust, absolute transparency, and personalized care.'}
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
                  <span className="text-xs text-gray-500">
                    (154 {isHi ? 'समीक्षाएं' : 'reviews'})
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isHi ? 'त्वरित लिंक्स' : 'Quick Links'}
            </h3>
            <ul className="space-y-3.5">
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

          {/* Column 3: Tools & Resources */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isHi ? 'साधन और संसाधन' : 'Tools & Resources'}
            </h3>
            <ul className="space-y-3.5 font-medium">
              {resources.map((link) => (
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
                  {isHi ? 'पोद्दार जी (AI सलाहकार)' : 'AI Advisor (Poddar Ji)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {isHi ? 'संपर्क सूत्र' : 'Contact Details'}
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
                  {isHi ? 'कार्यालय समय' : 'Office Hours'}
                </span>
                <span className="text-gray-500 text-[11px] font-medium">
                  {isHi ? 'सोमवार - शनिवार: सुबह 9:00 - शाम 6:00' : 'Mon - Sat: 9:00 AM - 6:00 PM'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-[11px] font-medium text-center md:text-left order-2 md:order-1">
            {t.footer.rights || `© 2026 PODDAR WEALTH MANAGEMENT`}
            <span className="mx-2 hidden md:inline">|</span>
            <span className="text-amber-500/80 font-bold block md:inline mt-1 md:mt-0">
              {isHi ? 'एमडीआरटी (MDRT) सदस्य | चेयरमैन क्लब अवॉर्डी' : 'MDRT Member | Chairman\'s Club awardee'}
            </span>
          </div>

          <div className="flex items-center gap-5 order-1 md:order-2">
            <Link 
              href="/privacy-policy" 
              className="text-[11px] text-gray-500 hover:text-white font-medium transition-colors"
            >
              {isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </Link>
            <span className="text-gray-800">·</span>
            <Link 
              href="/terms" 
              className="text-[11px] text-gray-500 hover:text-white font-medium transition-colors"
            >
              {isHi ? 'सेवा की शर्तें' : 'Terms of Service'}
            </Link>
          </div>

          <div className="text-[10px] text-gray-600 text-center md:text-right max-w-xl leading-relaxed italic order-3 w-full md:w-auto">
            {t.footer.disclaimer || 'Insurance is the subject matter of solicitation. IRDAI Reg. No. XXXXXXXXXX'}
          </div>
        </div>

      </div>
    </footer>
  )
}
