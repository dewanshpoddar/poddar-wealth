'use client'

import { useLang } from '@/lib/LangContext'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ADVISOR_PHONE, SECONDARY_PHONE, OFFICE_HOURS } from '@/lib/constants'
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react'

// Inline SVG components for trademarked social icons since they aren't in Lucide-react core
const Facebook = ({ size = 17 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
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
    <footer className="bg-[#080b18] pt-16 pb-8 border-t border-white/[0.06] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Brand Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 mb-10 border-b border-white/[0.06]">
          {/* Logo + name - same style as navbar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center p-1.5 flex-shrink-0">
              <Image src="/assets/pwm-logo.svg" alt="Poddar Wealth Logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-white font-bold text-[16px] tracking-tight font-display block leading-tight">
                Poddar Wealth Management
              </span>
              <span className="text-amber-500/60 text-[8px] uppercase tracking-[0.22em] font-normal mt-0.5 block">
                Excellence in Service Since 1994
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-gray-500 text-[12px] max-w-sm leading-relaxed lg:text-right">
            {label(
              'Trusted by 5,000+ families across India for over 31 years.',
              '31 वर्षों से 5,000+ परिवारों का भरोसा।'
            )}
          </p>

          {/* Google rating + socials */}
          <div className="flex items-center gap-5">
            <a href="https://www.google.com/maps/place/Poddar+Wealth+Management/" target="_blank" rel="noopener noreferrer" className="group">
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Google Reviews</div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-[11px] tracking-tight">★★★★★</span>
                <span className="text-white text-[12px] font-semibold group-hover:text-amber-400 transition-colors">4.9</span>
                <span className="text-gray-500 text-[11px]">(154)</span>
              </div>
            </a>

            <div className="w-px h-8 bg-white/10" />

            <div className="flex items-center gap-1">
              {[
                { href: 'https://www.facebook.com/share/1FnAn7yFPS/', label: 'Facebook', icon: <Facebook size={15} /> },
                { href: 'https://www.linkedin.com/company/poddarwealthmanagement/', label: 'LinkedIn', icon: <Linkedin size={15} /> },
                { href: `https://wa.me/91${ADVISOR_PHONE}`, label: 'WhatsApp', icon: <MessageCircle size={15} /> },
              ].map(({ href, label: ariaLabel, icon }) => (
                <a key={ariaLabel} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid Layout (5 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-14">

          {/* Column 1: Services */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-[0.15em] mb-6 px-2 border-l border-amber-500/80 ml-[-2px]">
              {t.footer.services || 'Services'}
            </h3>
            <ul className="space-y-3">
              {[
                { name: label('Protection Solutions', 'सुरक्षा समाधान'), href: '/services/protection' },
                { name: label('Savings & Wealth Creation', 'बचत और वेल्थ क्रिएशन'), href: '/services/savings' },
                { name: label('Health Insurance', 'स्वास्थ्य बीमा'), href: '/services/health' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
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
                    className="text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
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
                    className="text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
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
                    className="text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
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
                      className="text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-colors duration-200 block"
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
              <p className="text-[10px] text-gray-400 leading-relaxed italic">
                {t.footer.disclaimer || 'Insurance is the subject matter of solicitation. IRDAI Registration No. XXXXXXXXXX.'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-900 space-y-3 text-xs">
              <span className="text-white/60 text-[10px] uppercase tracking-wider block font-bold">
                {t.footer.contactOffice || 'Contact & Office'}
              </span>
              <div className="flex items-start gap-2.5 text-gray-300">
                <MapPin className="text-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">
                  {t.footer.address || 'AD Mall Compound, Vijay Chowk, Gorakhpur, U.P. 273001'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-gray-300">
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
              <div className="flex items-start gap-2.5 text-gray-300">
                <Clock className="text-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">
                  {lang === 'hi' ? OFFICE_HOURS.hi : OFFICE_HOURS.en}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
          
          {/* Copyright & Award */}
          <div className="text-gray-400 text-[11px] font-medium order-2 lg:order-1">
            {t.footer.rights || `© 2026 PODDAR WEALTH MANAGEMENT`}
            <span className="mx-2 hidden lg:inline">|</span>
            <span className="text-amber-500/80 font-bold block lg:inline mt-1 lg:mt-0">
              {isBn ? 'MDRT সদস্য | চেয়ারম্যানস ক্লাব অ্যাওয়ার্ডপ্রাপ্ত' : isHi ? 'एमडीआरटी (MDRT) सदस्य | चेयरमैन क्लब अवॉर्डी' : 'MDRT Member | Chairman\'s Club awardee'}
            </span>
          </div>

          {/* Language toggle - slim pill, matches navbar style */}
          <div className="flex items-center order-1 lg:order-2">
            <div className="flex rounded-full p-[3px] border border-white/10 bg-white/5">
              {(['en', 'hi', 'bn'] as const).map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-[10px] font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    lang === l ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {['EN', 'हिं', 'বাং'][i]}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
