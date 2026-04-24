'use client'
import { useState, useCallback } from 'react'
import { useLang } from '@/lib/LangContext'

const planKeys = ['term', 'endow', 'moneyback', 'ulip', 'pension', 'child'] as const
const freqKeys = ['monthly', 'quarterly', 'halfyearly', 'annual'] as const
const planNames: Record<string, string> = {
  term: 'LIC term plan (Jeevan Amar)',
  endow: 'LIC endowment (New Jeevan Anand)',
  moneyback: 'LIC money-back plan',
  ulip: 'LIC ULIP (Nivesh Plus)',
  pension: 'LIC pension plan (Jeevan Shanti)',
  child: 'LIC child plan (Jeevan Tarun)',
}
const freqNames: Record<string, string> = {
  monthly: 'per month', quarterly: 'per quarter', halfyearly: 'per half-year', annual: 'per year',
}
const baseRates: Record<string, number> = { term: 3.3, endow: 55, moneyback: 65, ulip: 60, pension: 50, child: 58 }
const freqMap: Record<string, { d: number; m: number }> = {
  monthly: { d: 12, m: 0.04 }, quarterly: { d: 4, m: 0.015 },
  halfyearly: { d: 2, m: 0.005 }, annual: { d: 1, m: 0 },
}

function fmt(n: number) { return n.toLocaleString('en-IN') }

export default function CalculatorSection() {
  const { t } = useLang()
  const [age, setAge] = useState(35)
  const [sa, setSa] = useState(50)
  const [term, setTerm] = useState(20)
  const [plan, setPlan] = useState('term')
  const [freq, setFreq] = useState('quarterly')

  const baseRate = baseRates[plan] || 3.3
  const ageMult = 1 + Math.max(0, age - 30) * 0.06
  const termMult = plan === 'term' ? (1 - Math.min(0.3, (term - 10) * 0.015)) : 1
  const annual = Math.round(baseRate * ageMult * termMult * sa * 10) / 10
  const fd = freqMap[freq]
  const freqPrem = Math.round(annual * (1 + fd.m) / fd.d)
  const total = Math.round(annual * term)
  const ratio = (sa * 100000 / annual).toFixed(1)
  const incomeYears = (sa * 100000 / annual / 1).toFixed(1)

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.14em] text-gold font-medium uppercase mb-4">
            <span className="w-8 h-px bg-gold" />
            {t.calculator.eyebrow}
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-[32px] lg:text-[42px] font-normal italic text-navy leading-tight mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-[14px] text-muted leading-relaxed max-w-2xl mx-auto">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left — Inputs Dashboard */}
          <div className="lg:col-span-8 bg-warm/30 rounded-3xl p-8 border border-[rgba(184,134,11,0.1)] shadow-sm">
            <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
              <button className="flex-shrink-0 px-6 py-2.5 rounded-full text-13 font-bold bg-navy text-white shadow-lg transition-all duration-300">
                {t.calculator.tabs.life}
              </button>
              <button className="flex-shrink-0 px-6 py-2.5 rounded-full text-13 font-medium bg-white/60 text-navy/60 hover:bg-white hover:text-navy transition-all duration-300 border border-navy/5">
                {t.calculator.tabs.health}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Age */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-13 font-bold text-navy tracking-tight">{t.calculator.age}</label>
                  <span className="text-15 font-display italic font-medium text-gold">{age} yrs</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={60}
                  value={age}
                  onChange={e => setAge(+e.target.value)}
                  className="pw-gold-range"
                />
              </div>

              {/* Sum Assured */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-13 font-bold text-navy tracking-tight">{t.calculator.sumAssured}</label>
                  <span className="text-15 font-display italic font-medium text-gold">₹{sa} Lakh</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={5}
                  value={sa}
                  onChange={e => setSa(+e.target.value)}
                  className="pw-gold-range"
                />
              </div>

              {/* Policy Term */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-13 font-bold text-navy tracking-tight">{t.calculator.policyTerm}</label>
                  <span className="text-15 font-display italic font-medium text-gold">{term} yrs</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={5}
                  value={term}
                  onChange={e => setTerm(+e.target.value)}
                  className="pw-gold-range"
                />
              </div>

              {/* Frequency */}
              <div className="flex flex-col gap-4">
                <label className="text-13 font-bold text-navy tracking-tight">{t.calculator.frequency}</label>
                <div className="grid grid-cols-2 gap-2">
                  {freqKeys.map((k, i) => (
                    <button
                      key={k}
                      onClick={() => setFreq(k)}
                      className={`px-4 py-2 rounded-xl text-11 font-bold transition-all duration-300 border ${freq === k ? 'bg-navy text-white border-navy shadow-md' : 'bg-white/60 text-navy/60 border-navy/5 hover:border-gold/30 hover:bg-white'}`}
                    >
                      {t.calculator.frequencies[i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Type — Full Width Row */}
              <div className="md:col-span-2 flex flex-col gap-4 pt-4 border-t border-[rgba(184,134,11,0.08)]">
                <label className="text-13 font-bold text-navy tracking-tight">{t.calculator.planType}</label>
                <div className="flex flex-wrap gap-2">
                  {planKeys.map((k, i) => (
                    <button
                      key={k}
                      onClick={() => setPlan(k)}
                      className={`px-6 py-2.5 rounded-xl text-11 font-bold transition-all duration-300 border ${plan === k ? 'bg-gold text-white border-gold shadow-md' : 'bg-white/60 text-navy/60 border-navy/5 hover:border-gold/30 hover:bg-white'}`}
                    >
                      {t.calculator.planTypes[i]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Live Result Box */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-navy rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="text-[10px] tracking-[0.2em] text-gold/80 font-bold uppercase mb-8">
                  {t.calculator.resultTitle}
                </div>

                <div className="mb-10 flex flex-col items-center text-center">
                  <div className="text-[13px] text-white/60 mb-2 font-medium tracking-tight">
                    {planNames[plan]}
                  </div>
                  <div className="text-[44px] font-display font-medium text-white mb-1 leading-none group-hover:scale-105 transition-transform duration-500">
                    ₹{fmt(freqPrem)}
                  </div>
                  <div className="text-[12px] text-gold/90 font-bold tracking-widest uppercase">
                    {freqNames[freq]}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-[12px] text-white/50">{t.calculator.resultFields.sumAssured}</span>
                    <span className="text-[13px] font-bold">₹{sa} Lakh</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-[12px] text-white/50">{t.calculator.resultFields.totalPay}</span>
                    <span className="text-[13px] font-bold">~₹{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-[12px] text-white/50">{t.calculator.resultFields.coverRatio}</span>
                    <span className="text-[13px] font-bold text-gold">{ratio}x</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-5 mb-8 border border-white/10">
                  <div className="text-[12px] text-white/80 leading-relaxed text-center">
                    Providing your family <span className="text-gold font-bold">{incomeYears} years</span> of {t.calculator.incomeReplacement}.
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-gold text-white font-bold text-14 hover:bg-gold-hover hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-gold/20">
                  {t.calculator.resultCta}
                </button>
              </div>
            </div>

            {/* Recommendation Hint */}
            <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-warm rounded-2xl border border-[rgba(184,134,11,0.1)]">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold text-18">🛡</div>
              <div className="text-[11px] text-muted leading-snug">
                <strong>{t.calculator.recommended}:</strong> LIC Dhan Vridhhi and Term insurance offer the best cover-to-cost ratio for your age.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
