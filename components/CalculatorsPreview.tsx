'use client'
import Link from 'next/link'
import { Calculator, TrendingUp, Coins, ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/LangContext'

export default function CalculatorsPreview() {
  const { lang } = useLang()
  const hi = lang === 'hi'

  const eyebrow = hi ? 'स्मार्ट टूल्स और कैलकुलेटर' : 'SMART TOOLS & CALCULATORS'
  const title = hi ? 'पॉलिसी कैलकुलेटर' : 'Policy Calculators'
  const subtitle = hi 
    ? 'अपने निवेश, प्रीमियम और मैच्योरिटी का तुरंत ऑनलाइन अनुमान लगाएं' 
    : 'Get instant online estimates for your premiums, returns, and benefits'

  const calcs = [
    {
      id: 'premium',
      name: hi ? 'प्रीमियम कैलकुलेटर' : 'Premium Calculator',
      desc: hi 
        ? 'अपने वास्तविक LIC जीवन बीमा प्रीमियम और मिलने वाले लाभों की तुरंत गणना करें।'
        : 'Calculate your exact LIC life insurance premium and benefits instantly.',
      icon: <Calculator className="w-6 h-6 text-amber-500" />,
      link: '/calculators/premium',
      tag: hi ? 'प्रीमियम' : 'Premium',
    },
    {
      id: 'retirement',
      name: hi ? 'रिटायरमेंट कैलकुलेटर' : 'Retirement Calculator',
      desc: hi 
        ? 'रिटायरमेंट के बाद एक सुरक्षित और सम्मानजनक जीवन के लिए आवश्यक पेंशन फंड का अनुमान लगाएं।'
        : 'Estimate the pension corpus you need for a secure and worry-free retired life.',
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />,
      link: '/calculators/retirement',
      tag: hi ? 'पेंशन' : 'Pension',
    },
    {
      id: 'surrender',
      name: hi ? 'सरेंडर वैल्यू कैलकुलेटर' : 'Surrender Value Calculator',
      desc: hi 
        ? 'पॉलिसी सरेंडर करने से पहले उसकी वर्तमान सरेंडर वैल्यू और मिलने वाले अमाउंट का आकलन करें।'
        : 'Estimate the current surrender value and payouts before surrendering your policy.',
      icon: <Coins className="w-6 h-6 text-amber-500" />,
      link: '/calculators/surrender-value',
      tag: hi ? 'सरेंडर' : 'Surrender',
    }
  ]

  return (
    <section className="bg-slate-50 py-16 border-t border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2 text-center">
            {eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            {title}
          </h2>
          <p className="text-gray-500 mt-2 text-center max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calcs.map((c) => (
            <Link
              key={c.id}
              href={c.link}
              className="group bg-white border border-gray-100/80 hover:border-amber-500/40 rounded-2xl p-6 transition-[transform,border-color,box-shadow] duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {c.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    {c.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {c.name}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  {hi ? 'कैलकुलेट करें' : 'Calculate Now'} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
