'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/LangContext'
import { Shield, ArrowRight, Info, CheckCircle2, Zap, LayoutGrid, List } from 'lucide-react'

interface Plan {
  id: string
  name: { en: string; hi: string }
  planNo: string
  tagline: { en: string; hi: string }
  keyBenefit: { en: string; hi: string }
  category: string
  entryAge: string
  sumAssured: string
  premiumPayment: string
  highlights: { en: string; hi: string }[]
  officialUrl: string
  status: string
}

interface Category {
  label: { en: string; hi: string }
  tagline: { en: string; hi: string }
  icon: string
  color: string
  plans: Plan[]
}

interface LicData {
  meta: any
  categories: Record<string, Category>
}

export default function LicPlans() {
  const { lang, t } = useLang()
  const [data, setData] = useState<LicData | null>(null)
  const [lastSync, setLastSync] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('')
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lic-plans')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data)
          setLastSync(res.lastSync)
          setActiveTab(Object.keys(res.data.categories)[0])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch plans:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin" />
          <p className="text-14 font-bold text-navy/40 uppercase tracking-widest">Loading Premium Plans...</p>
        </div>
      </div>
    )
  }

  if (!data || !data.categories) return null

  const activeCategory = data.categories[activeTab]

  const handleGetPlan = (planName: string) => {
    const event = new CustomEvent('open-lead-popup', {
      detail: { intent: `Interest in ${planName}` }
    })
    window.dispatchEvent(event)
  }

  return (
    <section className="py-12 bg-gray-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pw-eyebrow text-navy/60 mb-2"
          >
            {lang === 'en' ? 'Institutional Grade Protection' : 'संस्थागत स्तर की सुरक्षा'}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-32 md:text-48 font-display font-bold text-navy mb-4"
          >
            {lang === 'en' ? 'Explore LIC Wealth Plans' : 'एलआईसी वेल्थ प्लान्स का अन्वेषण करें'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-15 text-gray-500 max-w-2xl mx-auto"
          >
            {lang === 'en' 
              ? 'Hand-picked solutions for wealth creation, family protection, and guaranteed retirement income.' 
              : 'धन सृजन, परिवार की सुरक्षा और गारंटीड सेवानिवृत्ति आय के लिए चुने हुए समाधान।'}
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar scroll-smooth">
          {Object.entries(data.categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl border-1.5 transition-all flex items-center gap-2 whitespace-nowrap
                ${activeTab === key 
                  ? 'bg-navy border-navy text-white shadow-navy' 
                  : 'bg-white border-gray-100 text-gray-500 hover:border-navy/30'}`}
            >
              <span className="text-18">{cat.icon}</span>
              <span className="font-bold text-13">{cat.label[lang as keyof typeof cat.label]}</span>
              <span className={`text-10 px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-white/20' : 'bg-gray-100'}`}>
                {cat.plans.filter(p => p.status !== 'withdrawn').length}
              </span>
            </button>
          ))}
        </div>

        {/* Category Hero */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white rounded-2xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-20 shadow-lg"
                    style={{ background: activeCategory.color }}
                  >
                    {activeCategory.icon}
                  </div>
                  <h2 className="text-22 font-bold text-navy">
                    {activeCategory.label[lang as keyof typeof activeCategory.label]}
                  </h2>
                </div>
                <p className="text-15 text-gray-500 italic">
                  {activeCategory.tagline[lang as keyof typeof activeCategory.tagline]}
                </p>
              </div>
              
              <div className="flex items-center gap-8 md:border-l border-gray-100 md:pl-8 relative z-10">
                <div className="text-center">
                  <div className="text-11 font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
                  <div className="flex items-center gap-1.5 text-green-600 font-bold text-13">
                    <Zap size={14} fill="currentColor" /> Live Sync
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-11 font-bold text-gray-400 uppercase tracking-widest mb-1">Last Updated</div>
                  <div className="flex items-center gap-1.5 text-gold font-bold text-13 underline underline-offset-2">
                    <CheckCircle2 size={14} /> {data.meta.lastUpdated}
                  </div>
                </div>
              </div>

              {/* Decorative background circle */}
              <div 
                className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-[0.03] pointer-events-none"
                style={{ backgroundColor: activeCategory.color }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {activeCategory?.plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden relative
                  ${expandedPlan === plan.id ? 'border-navy/20 shadow-xl' : 'border-gray-100 hover:border-navy/10 hover:shadow-card'}
                  ${plan.status === 'withdrawn' ? 'opacity-60 saturate-50' : ''}`}
              >
                {/* Plan Status Badges */}
                {plan.status === 'new' && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-green-500 text-white text-10 font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest animate-pulse">
                      New Plan
                    </span>
                  </div>
                )}
                {plan.status === 'withdrawn' && (
                  <div className="absolute inset-0 z-30 bg-white/40 flex items-center justify-center p-6 text-center pointer-events-none">
                     <span className="bg-gray-800 text-white text-12 font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                       Plan Discontinued
                     </span>
                  </div>
                )}

                {/* Card Top */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-10 font-bold px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 uppercase tracking-wider">
                      Plan No. {plan.planNo}
                    </span>
                    {plan.id.includes('715') && plan.status !== 'new' && (
                      <span className="text-10 font-bold px-2 py-1 bg-gold/10 text-gold rounded border border-gold/10 uppercase tracking-wider">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <h3 className="text-18 font-bold text-navy mb-2 line-clamp-1">
                    {plan.name[lang as keyof typeof plan.name] || plan.name.en}
                  </h3>
                  <p className="text-13 text-gray-500 italic mb-4 line-clamp-2">
                    {plan.tagline[lang as keyof typeof plan.tagline] || (lang === 'en' ? 'Authentic LIC Protection' : 'प्रामाणिक एलआईसी सुरक्षा')}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                    <div className="text-10 font-bold text-gray-400 uppercase tracking-wider mb-1">Key Advantage</div>
                    <div className="text-13 font-semibold text-navy leading-tight">
                      {plan.keyBenefit[lang as keyof typeof plan.keyBenefit] || (lang === 'en' ? 'Institutional Grade Coverage' : 'संस्थागत स्तर का कवरेज')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white border border-gray-50 p-2 rounded-md">
                      <div className="text-10 text-gray-400">Entry Age</div>
                      <div className="text-13 font-bold text-navy">{plan.entryAge || 'Check IRDAI'}</div>
                    </div>
                    <div className="bg-white border border-gray-50 p-2 rounded-md">
                      <div className="text-10 text-gray-400">S.A. (Cover)</div>
                      <div className="text-13 font-bold text-navy">{plan.sumAssured || 'Customized'}</div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom / Actions */}
                <div className="mt-auto p-6 pt-0 space-y-3 relative z-10">
                  <button
                    onClick={() => handleGetPlan(plan.name.en)}
                    disabled={plan.status === 'withdrawn'}
                    className={`w-full h-11 text-white rounded-xl font-bold text-13 shadow-sm transition-all flex items-center justify-center gap-2 group
                      ${plan.status === 'withdrawn' 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-navy to-navy-light hover:shadow-navy/20'}`}
                  >
                    {lang === 'en' ? 'Get This Plan' : 'यह प्लान प्राप्त करें'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                    className="w-full text-12 font-bold text-gray-400 hover:text-navy transition-colors flex items-center justify-center gap-1.5"
                  >
                    {expandedPlan === plan.id 
                      ? (lang === 'en' ? 'Hide Details' : 'विवरण छुपाएं') 
                      : (lang === 'en' ? 'View Full Benefits' : 'सभी लाभ देखें')}
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedPlan === plan.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50 border-t border-gray-100"
                    >
                      <div className="p-6 space-y-4">
                        <div>
                          <div className="text-11 font-bold text-gray-400 uppercase tracking-widest mb-2">Key Highlights</div>
                          <div className="space-y-2">
                            {(plan.highlights && plan.highlights.length > 0) ? plan.highlights.map((h, i) => (
                              <div key={i} className="flex items-start gap-2 text-13 text-gray-600">
                                <CheckCircle2 size={14} className="text-green-500 mt-1 flex-shrink-0" />
                                <span>{h[lang as keyof typeof h] || h.en}</span>
                              </div>
                            )) : (
                              <div className="flex items-start gap-2 text-13 text-gray-600">
                                <Info size={14} className="text-navy/40 mt-1 flex-shrink-0" />
                                <span>{lang === 'en' ? 'Standard LIC benefits apply' : 'मानक एलआईसी लाभ लागू होते हैं'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <a 
                          href={plan.officialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-center text-11 font-bold text-navy/40 hover:text-navy transition-colors underline uppercase tracking-tighter"
                        >
                          View Official IRDAI Document
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-400 text-12 max-w-xl mx-auto border-t border-gray-100 pt-8">
          <p className="mb-2 italic">
            {lang === 'en' 
              ? `Last synced with official records: ${data.meta.lastUpdated}` 
              : `आधिकारिक रिकॉर्ड के साथ अंतिम सिंक: ${data.meta.lastUpdated}`}
          </p>
          <p className="mb-4">
            {lang === 'en' 
              ? 'All policy benefits are subject to standard LIC terms and conditions. The premium calculations are tailored to each case.' 
              : 'सभी पॉलिसी लाभ मानक एलआईसी नियमों और शर्तों के अधीन हैं। प्रीमियम गणना प्रत्येक मामले के लिए अलग होती है।'}
          </p>
          <div className="flex items-center justify-center gap-4">
             <span>IRDAI Reg No. 512</span>
             <span>•</span>
             <span>Trusted Since 1994</span>
          </div>
        </div>
      </div>
    </section>
  )
}
