'use client'

import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ADVISOR_PHONE, SECONDARY_PHONE } from '@/lib/constants'
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

  const label = (en: string, hi: string) => lang === 'hi' ? hi : en

  return (
    <footer className="bg-gray-950 pt-20 pb-10 border-t border-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Brand Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-10 mb-10 border-b border-gray-900">
          <div className="flex items-center gap-3.5">
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
              <span className="text-white font-bold text-base leading-snug block uppercase tracking-wider">
                {t.footer.brand || 'PODDAR WEALTH MANAGEMENT'}
              </span>
              <span className="text-amber-500 text-[10px] uppercase tracking-widest font-semibold mt-0.5 block">
                {label('Since 1994', 'स्थापना 1994')}
              </span>
            </div>
          </div>
          
          <p className="text-gray-400 text-xs max-w-md leading-relaxed font-medium">
            {label(
              'Securing the future of families across India for over 31 years with trust, absolute transparency, and personalized care.',
              '31 वर्षों से अधिक के अटूट विश्वास और व्यक्तिगत सेवा के साथ भारत के परिवारों के भविष्य को सुरक्षित कर रहे हैं।'
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Google Reviews Block */}
            <a
              href="https://www.google.com/maps/place/Poddar+Wealth+Management/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Google Review Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500 text-sm">
                  ★ ★ ★ ★ ★
                </div>
                <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">
                  4.9 / 5.0
                </span>
                <span className="text-[10px] text-gray-500">
                  (154 {label('reviews', 'समीक्षाएं')})
                </span>
              </div>
            </a>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/share/1FnAn7yFPS/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={17} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={17} />
              </a>
              <a href="https://www.linkedin.com/company/poddarwealthmanagement/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={17} />
              </a>
              <a href={`https://wa.me/91${ADVISOR_PHONE}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="WhatsApp">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Grid Layout (5 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Column 1: Services */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {t.footer.services || 'Services'}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t.footer.lifeInsurance || 'Life Insurance', href: '/services/life-insurance' },
                { name: t.footer.healthInsurance || 'Health Insurance', href: '/services/health-insurance' },
                { name: t.footer.retirementPlanning || 'Retirement Planning', href: '/services/retirement' },
                { name: t.footer.childPlanning || 'Child Planning', href: '/services/child-planning' },
                { name: t.footer.taxPlanning || 'Tax Planning', href: '/services/tax-planning' },
              ].map((link) => (
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

          {/* Column 2: Tools & Calculators */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {t.footer.toolsAndCalculators || 'Tools & Calculators'}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t.footer.premiumCalculator || 'Premium Calculator', href: '/calculators/premium' },
                { name: t.footer.surrenderValue || 'Surrender Value', href: '/calculators/surrender-value' },
                { name: t.footer.maturityCalculator || 'Maturity Calculator', href: '/calculators/maturity' },
                { name: t.footer.retirementCalculator || 'Retirement Calculator', href: '/calculators/retirement' },
                { name: t.footer.policyHealthCheck || 'Policy Health Check', href: '/calculators/policy-health' },
                { name: t.footer.aiDocumentAnalyzer || 'AI Document Analyzer', href: '/analyzers/policy-document' },
              ].map((link) => (
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

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {t.footer.quickLinks || 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t.footer.payPremium || 'Pay Premium', href: '/pay-premium' },
                { name: t.footer.fileClaim || 'File a Claim', href: '/claims' },
                { name: t.footer.renewPolicy || 'Renew Policy', href: '/renew' },
                { name: t.footer.referEarn || 'Refer & Earn', href: '/refer' },
                { name: t.footer.faqs || 'FAQs', href: '/faq' },
                { name: t.footer.videos || 'Videos', href: '/videos' },
              ].map((link) => (
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

          {/* Column 4: Company */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {t.footer.company || 'Company'}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t.footer.aboutUs || 'About Us', href: '/about' },
                { name: t.footer.blog || 'Blog', href: '/blog' },
                { name: t.footer.becomeAdvisor || 'Become an Advisor', href: '/become-advisor' },
                { name: t.footer.contact || 'Contact', href: '/contact' },
                { name: t.footer.clientPortal || 'Client Portal', href: '/client' },
              ].map((link) => (
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

          {/* Column 5: Legal */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-4 px-2 border-l border-amber-500/80 ml-[-2px]">
                {t.footer.legal || 'Legal'}
              </h3>
              <ul className="space-y-3">
                {[
                  { name: t.footer.privacyPolicy || 'Privacy Policy', href: '/privacy-policy' },
                  { name: t.footer.termsOfService || 'Terms of Service', href: '/terms' },
                ].map((link) => (
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
            
            <div className="pt-4 border-t border-gray-900">
              <span className="text-white/60 text-[10px] uppercase tracking-wider block mb-2 font-bold">
                {t.footer.disclaimerTitle || 'Disclaimer'}
              </span>
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                {t.footer.disclaimer || 'Insurance is the subject matter of solicitation. IRDAI Registration No. XXXXXXXXXX.'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-900 space-y-3 text-xs">
              <span className="text-white/60 text-[10px] uppercase tracking-wider block font-bold">
                {t.footer.contactOffice || 'Contact & Office'}
              </span>
              <div className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="text-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">
                  {t.footer.address || 'AD Mall Compound, Vijay Chowk, Gorakhpur, U.P. 273001'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-gray-400">
                <Phone className="text-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 font-semibold">
                  <a href={`tel:+91${ADVISOR_PHONE}`} className="hover:text-white transition-colors">
                    +91 {ADVISOR_PHONE}
                  </a>
                  <a href={`tel:+91${SECONDARY_PHONE}`} className="hover:text-white transition-colors">
                    +91 {SECONDARY_PHONE}
                  </a>
                </div>
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
          {t.footer.disclaimer || 'Insurance is the subject matter of solicitation. IRDAI Registration No. XXXXXXXXXX.'}
        </div>

      </div>
    </footer>
  )
}
