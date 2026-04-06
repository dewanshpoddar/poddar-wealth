'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ShieldCheck, TrendingUp, HeartPulse, GraduationCap, ArrowRight } from 'lucide-react'

export default function ProductTeaser() {
  const { lang } = useLang()

  const tickerPlans = [
    "LIC Jeevan Umang", "Star Gold Health", "LIC New Endowment", 
    "LIC Tech-Term", "Star Optima", "LIC Jeevan Anand", 
    "LIC Bima Jyoti", "Star Senior Citizen Red Carpet",
    "LIC Pension Plus", "Star Young Star", "LIC New Children's Money Back"
  ]

  const items = [
    { 
      icon: <ShieldCheck className="text-blue-600" size={32} />, 
      title: lang === 'en' ? 'Term Protection' : 'टर्म सुरक्षा',
      desc: lang === 'en' ? 'Pure life cover at lowest cost' : 'न्यूनतम लागत पर शुद्ध जीवन कवर',
      delay: 0
    },
    { 
      icon: <TrendingUp className="text-green-600" size={32} />, 
      title: lang === 'en' ? 'Wealth Creation' : 'धन सृजन',
      desc: lang === 'en' ? 'Guaranteed returns + life cover' : 'गारंटीड रिटर्न + लाइफ कवर',
      delay: 0.2
    },
    { 
      icon: <GraduationCap className="text-orange-600" size={32} />, 
      title: lang === 'en' ? 'Child Future' : 'बच्चों का भविष्य',
      desc: lang === 'en' ? 'Secure your child\'s dreams' : 'अपने बच्चे के सपनों को सुरक्षित करें',
      delay: 0.4
    },
    { 
      icon: <HeartPulse className="text-red-600" size={32} />, 
      title: lang === 'en' ? 'Retirement Income' : 'रिटायरमेंट आय',
      desc: lang === 'en' ? 'Lifetime guaranteed pension' : 'आजीवन गारंटीड पेंशन',
      delay: 0.6
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-navy/[0.02] -z-10 skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/[0.01] -z-10 -skew-x-12 -translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-20">
          
          {/* Left Content - The Hook */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pw-eyebrow text-gold mb-4"
            >
              {lang === 'en' ? 'Institutional Wealth Solutions' : 'संस्थागत वेल्थ समाधान'}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-36 md:text-52 font-display font-bold text-navy mb-8 leading-tight tracking-tight"
            >
              {lang === 'en' 
                ? 'Explore 26+ Premium Wealth & Protection Plans' 
                : '26+ प्रीमियम वेल्थ एवं सुरक्षा योजनाओं का अन्वेषण करें'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-16 md:text-18 text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {lang === 'en'
                ? 'From guaranteed income to future security, we combine the best of LIC and Star Health to build your family\'s financial fortress. Pure protection, no compromises.'
                : 'गारंटीड आय से लेकर भविष्य की सुरक्षा तक, हम आपके परिवार के वित्तीय किले के निर्माण के लिए एलआईसी और स्टार हेल्थ के सर्वश्रेष्ठ को मिलाते हैं। शुद्ध सुरक्षा, कोई समझौता नहीं।'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/products" className="pw-btn--navy h-14 px-10 inline-flex items-center gap-2 group shadow-lg shadow-navy/10">
                {lang === 'en' ? 'Explore 26+ Wealth Plans' : '26+ वेल्थ प्लान्स देखें'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 text-13 font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {lang === 'en' ? 'IRDAI Approved' : 'IRDAI द्वारा स्वीकृत'}
              </div>
            </motion.div>
          </div>

          {/* Right Content - The Glimpse Grid */}
          <div className="flex-1 w-full relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(0, 48, 96, 0.12)" }}
                  className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm transition-all group overflow-hidden relative"
                >
                  {/* Floating Icon Wrapper */}
                  <motion.div 
                    animate={{ 
                      y: [0, -6, 0],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: item.delay 
                    }}
                    className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-navy/5"
                  >
                    {item.icon}
                  </motion.div>
                  
                  <h4 className="text-18 font-bold text-navy mb-2 group-hover:text-gold transition-colors">{item.title}</h4>
                  <p className="text-14 text-gray-400 leading-snug">{item.desc}</p>

                  {/* Gradient Glow */}
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-navy/[0.03] rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Ticker Row - High Impact */}
        <div className="border-t border-gray-100 pt-10">
           <div className="flex items-center gap-6 mb-6">
              <span className="text-12 font-bold text-gold uppercase tracking-widest whitespace-nowrap">Popular Solution In-Focus</span>
              <div className="h-px bg-gray-100 w-full" />
           </div>
           
           <div className="overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 cursor-default opacity-60 hover:opacity-100">
             <motion.div 
               animate={{ x: [0, -1500] }}
               transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
               className="flex gap-16 items-center whitespace-nowrap"
             >
               {[...tickerPlans, ...tickerPlans].map((plan, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <span className="text-20 font-display font-bold text-navy/80 hover:text-navy transition-colors">{plan}</span>
                   <span className="text-gold opacity-30">✦</span>
                 </div>
               ))}
             </motion.div>
           </div>
        </div>
      </div>
    </section>
  )
}
