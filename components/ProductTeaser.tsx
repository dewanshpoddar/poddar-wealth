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
      icon: <ShieldCheck className="text-blue-400" size={32} />, 
      title: lang === 'en' ? 'Term Protection' : 'टर्म सुरक्षा',
      desc: lang === 'en' ? 'Pure life cover at lowest cost' : 'न्यूनतम लागत पर शुद्ध जीवन कवर',
      delay: 0
    },
    { 
      icon: <TrendingUp className="text-green-400" size={32} />, 
      title: lang === 'en' ? 'Wealth Creation' : 'धन सृजन',
      desc: lang === 'en' ? 'Guaranteed returns + life cover' : 'गारंटीड रिटर्न + लाइफ कवर',
      delay: 0.2
    },
    { 
      icon: <GraduationCap className="text-orange-400" size={32} />, 
      title: lang === 'en' ? 'Child Future' : 'बच्चों का भविष्य',
      desc: lang === 'en' ? 'Secure your child\'s dreams' : 'अपने बच्चे के सपनों को सुरक्षित करें',
      delay: 0.4
    },
    { 
      icon: <HeartPulse className="text-red-400" size={32} />, 
      title: lang === 'en' ? 'Retirement Income' : 'रिटायरमेंट आय',
      desc: lang === 'en' ? 'Lifetime guaranteed pension' : 'आजीवन गारंटीड पेंशन',
      delay: 0.6
    }
  ]

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Background Accents - Material consistency */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.03] -z-10 skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/[0.05] -z-10 -skew-x-12 -translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-20">
          
          {/* Left Content - The Hook */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-4"
            >
              <span className="w-8 h-px bg-gold/50" />
              <span className="text-[11px] tracking-[0.14em] text-gold font-medium uppercase">
                {lang === 'en' ? 'Institutional Wealth Solutions' : 'संस्थागत वेल्थ समाधान'}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-36 md:text-52 font-display font-bold text-white mb-8 leading-tight tracking-tight"
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
              className="text-16 md:text-18 text-white/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {lang === 'en'
                ? 'From guaranteed income to future security, we combine the best of LIC and Star Health to build your family\'s financial fortress.'
                : 'गारंटीड आय से लेकर भविष्य की सुरक्षा तक, हम आपके परिवार के वित्तीय किले के निर्माण के लिए एलआईसी और स्टार हेल्थ के सर्वश्रेष्ठ को मिलाते हैं।'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/products" className="pw-btn--gold h-14 px-10 inline-flex items-center gap-2 group shadow-lg shadow-gold/20 rounded-full">
                {lang === 'en' ? 'Explore 26+ Wealth Plans' : '26+ वेल्थ प्लान्स देखें'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 text-13 font-bold text-gold/40">
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
                  whileHover={{ y: -8, backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(200, 150, 12, 0.3)" }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl shadow-sm transition-all group overflow-hidden relative"
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
                    className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-white/10"
                  >
                    {item.icon}
                  </motion.div>
                  
                  <h4 className="text-18 font-bold text-white mb-2 group-hover:text-gold transition-colors">{item.title}</h4>
                  <p className="text-14 text-white/50 leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Ticker Row - Refined Header & Separators */}
        <div className="pt-8 border-t border-white/5">
           <div className="flex items-center gap-4 mb-6">
              <span className="text-[11px] font-bold text-gold/60 uppercase tracking-[0.2em] whitespace-nowrap">
                {lang === 'en' ? 'Popular Solution In-Focus' : 'लोकप्रिय समाधान इन-फोकस'}
              </span>
              <div className="h-px bg-gold/30 w-12" /> {/* Short golden highlight line after */}
           </div>
           
           <div className="overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 cursor-default opacity-40 hover:opacity-100">
             <motion.div 
               animate={{ x: [0, -1800] }}
               transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
               className="flex gap-16 items-center whitespace-nowrap"
             >
               {[...tickerPlans, ...tickerPlans, ...tickerPlans].map((plan, i) => (
                 <div key={i} className="flex items-center gap-16">
                   <span className="text-20 font-display font-bold text-white/80 hover:text-white transition-colors">{plan}</span>
                   <span className="text-gold/20 text-12">✦</span>
                 </div>
               ))}
             </motion.div>
           </div>
        </div>
      </div>
    </section>
  )
}
