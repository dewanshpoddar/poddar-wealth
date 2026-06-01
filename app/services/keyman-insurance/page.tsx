'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import ConsultationSection from '@/components/ConsultationSection'

const benefits = [
  'Protect company profits against the sudden demise of vital partners, directors, or key executives',
  'Fund recruitment, headhunting, and specialized training costs to quickly find a worthy replacement leader',
  'Bulletproof corporate credit facilities, business loans, and lines of credit from sudden recall by banks',
  'Tax deduction: Premium paid by the company is fully allowed as a business expense under Section 37(1)',
  'Build absolute confidence among key clients, vendors, investors, and creditors that operations will remain unaffected',
  'Prevent hostile takeover attempts by funding share buybacks from the deceased partner\'s heirs directly',
]

const PHONE = '9415313434'
const WA_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent('Hello Ajay sir, I need to discuss Keyman Insurance for my business.')}`

export default function KeymanInsurancePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero-gradient hero-pattern section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              {/* Breadcrumb / Category Tag */}
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-medium mb-6">
                🏢 Services / Keyman Insurance
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-5">
                Secure Business Continuity with Keyman Insurance
              </h1>
              <p className="text-white/80 text-xl leading-relaxed mb-8">
                Protect your business profits, credit lines, and company shareholding if a key partner or top performer is no longer there to lead.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="#consultation"
                  className="inline-flex items-center gap-2 bg-gold text-white font-bold px-6 py-3.5 rounded-xl hover:bg-gold-hover transition-colors"
                >
                  Discuss Corporate Plan <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#20c45a] transition-all shadow-md"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                  alt="Business partners discussing company strategy"
                  width={600}
                  height={450}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight mb-6">
                How Keyman Insurance Protects Your Enterprise
              </h2>
              <ul className="space-y-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-15 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              
              {/* Advisor Note */}
              <div className="mt-8 bg-gold/5 border border-gold/20 rounded-2xl p-5">
                <div className="font-display font-bold text-navy text-lg mb-1">🏆 Ajay sir&apos;s Advisory</div>
                <p className="text-navy/80 text-sm leading-relaxed">
                  &quot;Many business partners in Gorakhpur and UP overlook Keyman Insurance. They realize its value too late when a major crisis hits. Besides absolute business protection, the premium paid is 100% tax-free as a business expense, saving substantial company money.&quot;
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
                alt="Corporate office and wealth planning"
                width={600}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display font-bold text-22 text-slate-900 mb-2">Need a custom corporate proposal?</h3>
          <p className="text-slate-500 text-sm mb-6">Send your business requirements directly to Ajay sir on WhatsApp for an instant response.</p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] text-white font-bold h-12 px-8 rounded-full shadow-lg hover:bg-[#20c45a] active:scale-[0.98] transition-all"
          >
            Send WhatsApp Query (9415313434)
          </a>
        </div>
      </section>

      {/* Consultation Section */}
      <div id="consultation">
        <ConsultationSection intent="Keyman Insurance Consultation" />
      </div>
    </div>
  )
}
