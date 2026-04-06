'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ShieldCheck, TrendingUp, HeartPulse, GraduationCap, ArrowRight } from 'lucide-react'

export default function ProductTeaser() {
  const { lang } = useLang()

  const items = [
    { 
      icon: <ShieldCheck className="text-blue-600" size={24} />, 
      title: lang === 'en' ? 'Term Protection' : 'टर्म सुरक्षा',
      desc: lang === 'en' ? 'Pure life cover at lowest cost' : 'न्यूनतम लागत पर शुद्ध जीवन कवर'
    },
    { 
      icon: <TrendingUp className="text-green-600" size={24} />, 
      title: lang === 'en' ? 'Savings & Wealth' : 'बचत और धन',
      desc: lang === 'en' ? 'Guaranteed returns + life cover' : 'गारंटीड रिटर्न + लाइफ कवर'
    },
    { 
      icon: <GraduationCap className="text-orange-600" size={24} />, 
      title: lang === 'en' ? 'Child Education' : 'बच्चों की शिक्षा',
      desc: lang === 'en' ? 'Secure your child\'s future' : 'अपने बच्चे का भविष्य सुरक्षित करें'
    },
    { 
      icon: <HeartPulse className="text-red-600" size={24} />, 
      title: lang === 'en' ? 'Pension Plans' : 'पेंशन योजनाएं',
      desc: lang === 'en' ? 'Lifetime guaranteed income' : 'आजीवन गारंटीड आय'
    }
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-navy/[0.02] -z-10 skew-x-12 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content - The Hook */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pw-eyebrow text-gold mb-3"
            >
              {lang === 'en' ? 'New Integration — April 2025' : 'नई पेशकश — अप्रैल 2025'}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-32 md:text-48 font-display font-bold text-navy mb-6 leading-tight"
            >
              {lang === 'en' 
                ? 'Explore 26+ Specialized LIC Insurance Plans' 
                : '26+ विशिष्ट एलआईसी बीमा योजनाओं का अन्वेषण करें'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-16 text-gray-500 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {lang === 'en'
                ? 'From term assurance to child future plans, we’ve brought the entire LIC catalog to your fingertips. Institutional grade protection for every Indian family.'
                : 'टर्म एश्योरेंस से लेकर बच्चों की भविष्य की योजनाओं तक, हम आपकी उंगलियों पर संपूर्ण एलआईसी कैटलॉग लाए हैं। हर भारतीय परिवार के लिए संस्थागत स्तर की सुरक्षा।'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/products" className="pw-btn--navy h-14 px-10 inline-flex items-center gap-2 group">
                {lang === 'en' ? 'View All LIC Plans' : 'सभी एलआईसी योजनाएं देखें'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content - The Glimpse Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-16 font-bold text-navy mb-1">{item.title}</h4>
                  <p className="text-13 text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Trust Badge overlay */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gold/10 border border-gold/20 p-4 rounded-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white shrink-0">
                <ShieldCheck size={20} />
              </div>
              <p className="text-12 font-bold text-navy leading-tight">
                {lang === 'en' 
                  ? 'IRDAI Approved & MDRT Recommended Plans' 
                  : 'IRDAI द्वारा स्वीकृत और MDRT द्वारा अनुशंसित योजनाएं'}
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
