'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator } from 'lucide-react'

interface CalculatorCTAProps {
  title: string
  desc: string
  btnText: string
  calculatorLink: string
  lang: 'en' | 'hi' | 'bn'
}

export default function CalculatorCTA({
  title,
  desc,
  btnText,
  calculatorLink,
  lang,
}: CalculatorCTAProps) {
  const router = useRouter()
  const isHi = lang === 'hi'

  const [age, setAge] = useState('30')
  const [coverage, setCoverage] = useState('1000000')
  const [term, setTerm] = useState('20')

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to the full calculator with pre-filled inputs
    router.push(`${calculatorLink}?age=${age}&coverage=${coverage}&term=${term}`)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-500 via-amber-650 to-amber-600 text-white relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-0 left-0 w-64 h-64 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Headline & Description */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
              <Calculator className="w-3.5 h-3.5" />
              <span>{isHi ? 'मुफ्त टूल' : 'Free Tool'}</span>
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-4">
              {title}
            </h2>
            <p className="text-white/80 leading-relaxed text-14 font-medium">
              {desc}
            </p>
          </div>

          {/* Interactive Mini-Form */}
          <div className="lg:col-span-7 bg-white text-navy rounded-2xl p-6 md:p-8 shadow-gold-lg">
            <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              {/* Age Field */}
              <div className="flex flex-col text-left">
                <label htmlFor="mini-age" className="text-11 font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {isHi ? 'आपकी आयु' : 'Your Age'}
                </label>
                <input
                  id="mini-age"
                  type="number"
                  min="18"
                  max="65"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-navy text-14 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              {/* Coverage Field */}
              <div className="flex flex-col text-left">
                <label htmlFor="mini-coverage" className="text-11 font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {isHi ? 'कवरेज लक्ष्य' : 'Desired Coverage'}
                </label>
                <select
                  id="mini-coverage"
                  value={coverage}
                  onChange={(e) => setCoverage(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-navy text-14 focus:outline-none focus:border-gold appearance-none"
                  required
                >
                  <option value="500000">₹5 Lakhs</option>
                  <option value="1000000">₹10 Lakhs</option>
                  <option value="2500000">₹25 Lakhs</option>
                  <option value="5000000">₹50 Lakhs</option>
                  <option value="10000000">₹1 Crore</option>
                  <option value="20000000">₹2 Crores</option>
                </select>
              </div>

              {/* Term Field */}
              <div className="flex flex-col text-left">
                <label htmlFor="mini-term" className="text-11 font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {isHi ? 'पॉलिसी टर्म' : 'Policy Term'}
                </label>
                <select
                  id="mini-term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-navy text-14 focus:outline-none focus:border-gold appearance-none"
                  required
                >
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                  <option value="35">35 Years</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-3 mt-2">
                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-250 shadow-gold-sm min-h-[48px] text-15 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{btnText}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
