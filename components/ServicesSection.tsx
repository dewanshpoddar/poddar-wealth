'use client'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { GOAL_SERVICES } from '@/lib/data/goal-services'
import {
  Shield, HeartPulse, Landmark, GraduationCap, Calculator, Building2,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Shield, HeartPulse, Landmark, GraduationCap, Calculator, Building2,
}

const COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-50 text-blue-600',
  red:    'bg-red-50 text-red-500',
  orange: 'bg-orange-50 text-orange-500',
  green:  'bg-emerald-50 text-emerald-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
}

const TITLE_HI: Record<string, string> = {
  'life-protection':  'जीवन सुरक्षा',
  'health-insurance': 'स्वास्थ्य बीमा',
  'retirement':       'सेवानिवृत्ति आय',
  'child-planning':   'बाल नियोजन',
  'tax-planning':     'कर नियोजन',
  'keyman-insurance': 'कीमैन बीमा',
}

const DESC_HI: Record<string, string> = {
  'life-protection':  'अगर आपकी आमदनी रुक जाए तो परिवार को आर्थिक सुरक्षा दें।',
  'health-insurance': 'अस्पताल के बड़े खर्चों और कैशलेस इलाज की सुविधा पाएं।',
  'retirement':       'रिटायरमेंट के बाद जीवनभर पेंशन की स्थिर आय बनाएं।',
  'child-planning':   'बच्चे की पढ़ाई और शादी के लिए सुरक्षित फंड तैयार करें।',
  'tax-planning':     'धारा 80C और 80D के तहत कुशलता से टैक्स बचाएं।',
  'keyman-insurance': 'व्यापार के मुख्य व्यक्ति की अनुपस्थिति से व्यवसाय को सुरक्षित करें।',
}

export default function ServicesSection() {
  const { lang } = useLang()
  const hi = lang === 'hi'

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
            {hi ? 'हमारी सेवाएं' : 'OUR SERVICES'}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {hi ? 'हम आपकी कैसे मदद करते हैं' : 'How We Help You'}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            {hi
              ? 'अपना लक्ष्य चुनें। हम सही सुरक्षा खोज देंगे।'
              : "Choose your goal. We'll find the right protection."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GOAL_SERVICES.map((s) => {
            const Icon = ICON_MAP[s.iconName] ?? Shield
            const iconCls = COLOR_MAP[s.color] ?? 'bg-gray-100 text-gray-600'
            const title = hi ? (TITLE_HI[s.id] ?? s.title) : s.title
            const desc  = hi ? (DESC_HI[s.id]  ?? s.description) : s.description

            return (
              <Link
                key={s.id}
                href={s.link}
                className="flex items-start gap-4 bg-gray-50 hover:bg-gray-100 hover:border-amber-200 border border-transparent rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconCls}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            {hi ? 'सभी सेवाएं देखें' : 'View all services'} →
          </Link>
        </div>
      </div>
    </section>
  )
}
