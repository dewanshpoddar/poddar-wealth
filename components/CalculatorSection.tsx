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
    <section className="pw-section pw-section--warm">
      <div className="pw-eyebrow">{t.calculator.eyebrow}</div>
      <div className="pw-title">{t.calculator.title}</div>
      <div className="pw-subtitle">{t.calculator.subtitle}</div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 280px', alignItems: 'start' }}>
        <div>
          {/* Calculator inputs */}
          <div className="bg-white border-half border-gray-200 rounded-lg p-5">
            {/* Tabs */}
            <div className="flex gap-1.5 mb-5">
              <button className="pw-tab pw-tab--active">{t.calculator.tabs.life}</button>
              <button className="pw-tab">{t.calculator.tabs.health}</button>
            </div>

            {/* Age slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-12 text-gray-500">{t.calculator.age}</span>
                <span className="text-13 font-medium text-gray-900">{age} years</span>
              </div>
              <input type="range" min={18} max={60} value={age} onChange={e => setAge(+e.target.value)} className="w-full" />
              <div className="pw-range-limits"><span>18 yrs</span><span>60 yrs</span></div>
            </div>

            {/* Sum assured slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-12 text-gray-500">{t.calculator.sumAssured}</span>
                <span className="text-13 font-medium text-gray-900">₹{sa} Lakh</span>
              </div>
              <input type="range" min={5} max={200} step={5} value={sa} onChange={e => setSa(+e.target.value)} className="w-full" />
              <div className="pw-range-limits"><span>₹5L</span><span>₹2 Cr</span></div>
            </div>

            {/* Term slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-12 text-gray-500">{t.calculator.policyTerm}</span>
                <span className="text-13 font-medium text-gray-900">{term} years</span>
              </div>
              <input type="range" min={10} max={40} step={5} value={term} onChange={e => setTerm(+e.target.value)} className="w-full" />
              <div className="pw-range-limits"><span>10 yrs</span><span>40 yrs</span></div>
            </div>

            {/* Plan type */}
            <div className="mb-4">
              <div className="text-12 text-gray-500 mb-2">{t.calculator.planType}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {planKeys.map((k, i) => (
                  <div
                    key={k}
                    onClick={() => setPlan(k)}
                    className={`pw-opt ${plan === k ? 'pw-opt--sel' : ''}`}
                  >
                    {t.calculator.planTypes[i]}
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <div className="text-12 text-gray-500 mb-2">{t.calculator.frequency}</div>
              <div className="grid grid-cols-4 gap-1.5">
                {freqKeys.map((k, i) => (
                  <div
                    key={k}
                    onClick={() => setFreq(k)}
                    className={`pw-opt ${freq === k ? 'pw-opt--sel' : ''}`}
                  >
                    {t.calculator.frequencies[i]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended plans */}
          <div className="mt-6">
            <div className="text-11 text-gray-400 font-medium uppercase mb-2.5" style={{ letterSpacing: '0.06em' }}>
              {t.calculator.recommended}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {t.calculator.plans.map((p: any, i: number) => (
                <div key={i} className={`bg-white rounded-lg p-3 cursor-pointer ${i === 0 ? 'border-1.5 border-gold' : 'border-half border-gray-200 hover:border-gold transition-colors'}`}>
                  <div className="text-12 font-medium text-gray-900 mb-0.5">{p.name}</div>
                  <div className="text-10 text-gray-400 mb-1.5">{p.type}</div>
                  <div className="text-10 text-gray-500 leading-relaxed">{p.desc}</div>
                  <span className="pw-badge pw-badge--gold mt-1.5" style={{ fontSize: '9px' }}>{p.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="pw-result-box sticky top-4">
          <div className="text-11 text-muted font-medium uppercase mb-4" style={{ letterSpacing: '0.06em' }}>
            {t.calculator.resultTitle}
          </div>
          <div className="mb-4 pb-4 border-b-half border-navy-border">
            <div className="text-11 text-gold font-medium mb-1">{planNames[plan]}</div>
            <div className="font-display text-28 font-medium text-white">₹{fmt(freqPrem)}</div>
            <div className="text-11 text-muted">{freqNames[freq]}</div>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between"><span className="text-11 text-muted">{t.calculator.resultFields.annualPremium}</span><span className="text-12 font-medium text-white">~₹{fmt(annual)}</span></div>
            <div className="flex justify-between"><span className="text-11 text-muted">{t.calculator.resultFields.sumAssured}</span><span className="text-12 font-medium text-white">₹{sa} Lakh</span></div>
            <div className="flex justify-between"><span className="text-11 text-muted">{t.calculator.resultFields.policyTerm}</span><span className="text-12 font-medium text-white">{term} years</span></div>
            <div className="flex justify-between"><span className="text-11 text-muted">{t.calculator.resultFields.totalPay}</span><span className="text-12 font-medium text-white">~₹{fmt(total)}</span></div>
            <div className="flex justify-between"><span className="text-11 text-muted">{t.calculator.resultFields.coverRatio}</span><span className="text-12 font-medium text-white">{ratio}x</span></div>
          </div>
          <div className="rounded-md p-2.5 mb-4 text-11 text-muted leading-relaxed" style={{ background: '#1a3a5c' }}>
            At this cover, your family gets <span className="text-gold font-medium">{incomeYears} years</span> {t.calculator.incomeReplacement}.
          </div>
          <button className="pw-btn pw-btn--gold pw-btn--full">{t.calculator.resultCta}</button>
        </div>
      </div>
    </section>
  )
}
