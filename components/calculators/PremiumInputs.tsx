import React from 'react'
import { fmtSA, toWords } from '@/lib/format'
import { Calculator } from 'lucide-react'

interface PremiumInputsProps {
  selectedPlan: any
  clientName: string
  setClientName: (v: string) => void
  salutation: string
  setSalutation: (v: any) => void
  age: number
  setAge: (v: number) => void
  safeterm: number
  setTerm: (v: number) => void
  sa: number
  setSa: (v: number) => void
  mode: string
  setMode: (v: any) => void
  gender: string
  setGender: (v: any) => void
  smoker: boolean
  setSmoker: (v: any) => void
  calculate: () => void
  ppt: number
  minTerm: number
  maxTerm: number
}

const SA_PRESETS = [500000, 1000000, 2500000, 5000000, 10000000]
const MODE_LABEL: Record<string, string> = {
  yearly: 'Yly', halfyearly: 'Hly', quarterly: 'Qly', monthly: 'Mly'
}

export default function PremiumInputs({
  selectedPlan,
  clientName, setClientName,
  salutation, setSalutation,
  age, setAge,
  safeterm, setTerm,
  sa, setSa,
  mode, setMode,
  gender, setGender,
  smoker, setSmoker,
  calculate,
  ppt, minTerm, maxTerm
}: PremiumInputsProps) {
  const isTermPlan = selectedPlan?.category === 'term'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(184,134,11,0.08)] p-5 space-y-5">
      <h2 className="font-display font-bold text-[16px] text-navy">Enter Details</h2>

      {/* Name + Salutation */}
      <div className="pb-4 border-b border-gray-50">
        <label className="block text-[12px] font-semibold text-gray-600 mb-2">
          Client Name <span className="text-gray-300 font-normal">(personalises report)</span>
        </label>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {(['Mr.', 'Mrs.', 'Ms.'] as const).map(s => (
              <button key={s} onClick={() => setSalutation(s)}
                className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-all
                  ${salutation === s ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                {s}
              </button>
            ))}
          </div>
          <input type="text" placeholder="e.g. Rajesh Kumar" value={clientName}
            onChange={e => setClientName(e.target.value)}
            className="flex-1 px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-gold/40 focus:bg-white transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Age */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
            Age: <span className="text-gold">{age} years</span>
          </label>
          <input type="range" min={selectedPlan.minAge ?? 18} max={selectedPlan.maxAge ?? 65}
            value={age} onChange={e => setAge(+e.target.value)}
            className="w-full accent-[#b8860b] h-1.5 rounded-full" />
          <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
            <span>{selectedPlan.minAge ?? 18}</span><span>{selectedPlan.maxAge ?? 65}</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
            Term: <span className="text-gold">{safeterm} years</span>
          </label>
          <input type="range" min={minTerm} max={maxTerm}
            value={safeterm} onChange={e => setTerm(+e.target.value)}
            className="w-full accent-[#b8860b] h-1.5 rounded-full" />
          <div className="flex justify-between text-[10px] mt-0.5">
            <span className="text-gray-300">{minTerm} yrs</span>
            <span className="text-amber-600 font-semibold">PPT: {ppt} Years</span>
            <span className="text-gray-300">{maxTerm} yrs</span>
          </div>
        </div>

        {/* Sum Assured */}
        <div className="sm:col-span-2">
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
            Sum Assured: <span className="text-gold">{fmtSA(sa)}</span>
            {selectedPlan.minSA > sa && <span className="text-red-400 text-[10px] ml-1">(min {fmtSA(selectedPlan.minSA)})</span>}
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SA_PRESETS.map(v => (
              <button key={v} onClick={() => setSa(v)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all
                  ${sa === v ? 'bg-gold text-white border-gold' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gold/30'}`}>
                {fmtSA(v)}
              </button>
            ))}
          </div>
          <input type="range" min={selectedPlan.minSA ?? 100000} max={10000000} step={100000}
            value={sa} onChange={e => setSa(+e.target.value)}
            className="w-full accent-[#b8860b] h-1.5 rounded-full" />
          <div className="text-center text-[12px] text-gold font-semibold mt-1.5">
            ( {toWords(sa)} )
          </div>
        </div>

        {/* Mode */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Premium Mode</label>
          <div className="grid grid-cols-4 gap-1">
            {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`text-[11px] font-bold py-2 rounded-lg border transition-all
                  ${mode === m ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Gender + Smoker */}
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Gender</label>
          <div className="flex gap-2">
            {(['male','female'] as const).map(g => (
              <button key={g} onClick={() => setGender(g)}
                className={`flex-1 text-[11px] font-bold py-2 rounded-lg border transition-all
                  ${gender === g ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                {g === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
          {isTermPlan && (
            <button onClick={() => setSmoker(!smoker)}
              className={`mt-2 w-full text-[11px] font-bold py-1.5 rounded-lg border transition-all
                ${smoker ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
              🚬 Smoker {smoker ? '(+25% surcharge)' : '(click if applicable)'}
            </button>
          )}
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 shadow-md">
        <Calculator className="w-4 h-4" /> Calculate Premium
      </button>
    </div>
  )
}
