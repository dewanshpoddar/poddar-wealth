'use client'
import { useLang } from '@/lib/LangContext'
import Image from 'next/image'

interface FounderSectionTranslation {
  eyebrow: string
  title: string
  subtitle: string
}

export default function AboutFounder() {
  const { t, lang } = useLang()

  const rawFounderSection = (t as any).founderSection
  const f: FounderSectionTranslation =
    rawFounderSection && typeof rawFounderSection === 'object'
      ? (rawFounderSection as FounderSectionTranslation)
      : {
          eyebrow: lang === 'en' ? 'ABOUT THE FOUNDER' : lang === 'hi' ? 'संस्थापक के बारे में' : 'প্রতিষ্ঠাতা সম্পর্কে',
          title: lang === 'en' ? 'Meet Ajay Kumar Poddar' : lang === 'hi' ? 'अजय कुमार पोद्दार से मिलें' : 'শ্রী অজয় কুমার পোদ্দার',
          subtitle: lang === 'en' ? 'Managing Director, Poddar Wealth Management' : lang === 'hi' ? 'प्रबंध निदेशक, पोद्दार वेल्थ मैनेजमेंट' : 'অন-গ্রাউন্ড বীমা এবং সম্পদ পরিকল্পনার 31+ বছরের অভিজ্ঞতা'
        }

  const aboutSection = t.aboutSection ?? {
    eyebrow: lang === 'en' ? 'MDRT USA Member' : 'MDRT सदस्य',
    name: lang === 'en' ? 'Ajay Kumar Poddar' : 'अजय कुमार पोद्दार',
    bio: '',
    badges: []
  }

  return (
    <section className="bg-white py-16 md:py-20 border-t border-gray-100/60">
      <div className="max-w-5xl mx-auto px-6 md:px-8">

        {/* Single unified card - no duplicate heading */}
        <div className="flex flex-col md:flex-row gap-0 rounded-[32px] overflow-hidden border border-gray-200/70 shadow-lg">

          {/* Left - photo panel with dark bg */}
          <div className="relative md:w-64 lg:w-72 shrink-0 bg-[#0f1225] flex flex-col items-center justify-end pt-10 pb-0 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-amber-400/10 blur-[40px] pointer-events-none" />
            {/* Eyebrow label */}
            <p className="relative z-10 text-amber-400/80 text-[9px] font-bold uppercase tracking-[0.22em] mb-3 text-center px-4">
              {f.eyebrow}
            </p>
            {/* Photo flush to bottom */}
            <div className="relative z-10 w-48 h-60 md:w-full md:h-72 overflow-hidden">
              <Image
                src="/assets/ajay-poddar.svg"
                alt="Ajay Kumar Poddar - Founder, Poddar Wealth Management"
                fill
                className="object-cover object-top scale-[1.2] origin-top"
                priority
              />
            </div>
          </div>

          {/* Right - content panel */}
          <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center text-center md:text-left">

            {/* Name + title */}
            <h2 className="font-display text-slate-900 text-2xl md:text-3xl font-bold leading-tight mb-1">
              {aboutSection.name}
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              {f.subtitle}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {(aboutSection.badges ?? []).map((badge: any, i: number) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                    badge.type === 'gold'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {badge.text.includes('MDRT') && (
                    <Image src="/assets/mdrt-seeklogo.svg" alt="MDRT" width={14} height={14} className="w-3.5 h-3.5 object-contain flex-shrink-0" />
                  )}
                  {(badge.text.includes('Chairman') || badge.text.includes('चेयरमैन')) && (
                    <Image src="/assets/chairmanclub.webp" alt="Chairman's Club" width={14} height={14} className="w-3.5 h-3.5 object-contain flex-shrink-0" />
                  )}
                  {badge.text}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-[14px] text-slate-600 leading-relaxed max-w-xl font-medium mb-8">
              {aboutSection.bio}
            </p>

            {/* Stat strip */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6 border-t border-gray-100">
              {[
                { num: '31+', label: lang === 'hi' ? 'वर्षों का अनुभव' : 'Years of service' },
                { num: '5,000+', label: lang === 'hi' ? 'परिवारों की सुरक्षा' : 'Families protected' },
                { num: '4.9★', label: lang === 'hi' ? 'Google रेटिंग' : 'Google rating' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center md:text-left">
                  <p className="text-xl font-bold text-amber-600 leading-none">{num}</p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
