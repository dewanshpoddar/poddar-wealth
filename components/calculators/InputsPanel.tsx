import { Calculator } from 'lucide-react'
import { SA_PRESETS, MODE_LABEL } from '@/lib/constants'
import { fmtSA, toWords } from '@/lib/format'
import { LicPlan } from '@/lib/types/lic-plan'

export interface InputsPanelProps {
  selectedPlan: LicPlan
  clientName: string
  setClientName: (val: string) => void
  salutation: 'Mr.' | 'Mrs.' | 'Ms.'
  setSalutation: (val: 'Mr.' | 'Mrs.' | 'Ms.') => void
  age: number
  setAge: (val: number) => void
  term: number
  setTerm: (val: number) => void
  safeterm: number
  minTerm: number
  maxTerm: number
  ppt: number
  sa: number
  setSa: (val: number) => void
  isPensionAnnuity: boolean
  isWholeLifeUtsav: boolean
  isJeevanTarun: boolean
  isBimaLakshmi: boolean
  isTermPlan: boolean
  isUlip: boolean
  purchasePrice: number
  setPurchasePrice: (val: number) => void
  annuityOption: string
  setAnnuityOption: (val: string) => void
  maturityAge: number
  setMaturityAge: (val: number) => void
  survivalBenefitPct: 5 | 10 | 15 | 20
  setSurvivalBenefitPct: (val: 5 | 10 | 15 | 20) => void
  bimaLakshmiOption: 'A' | 'B'
  setBimaLakshmiOption: (val: 'A' | 'B') => void
  mode: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly'
  setMode: (val: 'yearly' | 'halfyearly' | 'quarterly' | 'monthly') => void
  gender: 'male' | 'female'
  setGender: (val: 'male' | 'female') => void
  smoker: boolean
  setSmoker: (val: boolean | ((s: boolean) => boolean)) => void
  calculate: () => void
}

export default function InputsPanel({
  selectedPlan, clientName, setClientName, salutation, setSalutation,
  age, setAge, term, setTerm, safeterm, minTerm, maxTerm, ppt, sa, setSa,
  isPensionAnnuity, isWholeLifeUtsav, isJeevanTarun, isBimaLakshmi, isTermPlan, isUlip,
  purchasePrice, setPurchasePrice, annuityOption, setAnnuityOption,
  maturityAge, setMaturityAge, survivalBenefitPct, setSurvivalBenefitPct,
  bimaLakshmiOption, setBimaLakshmiOption, mode, setMode, gender, setGender,
  smoker, setSmoker, calculate
}: InputsPanelProps) {
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

                    {/* ── Age: slider + number ── */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Age</label>
                      <div className="flex items-center gap-2 mb-1.5">
                        <input type="range" min={selectedPlan.minAge ?? 0} max={selectedPlan.maxAge ?? 65}
                          value={age} onChange={e => setAge(+e.target.value)}
                          className="flex-1 accent-[#b8860b] h-1.5 rounded-full" />
                        <input type="number" min={selectedPlan.minAge ?? 0} max={selectedPlan.maxAge ?? 65}
                          value={age} onChange={e => setAge(Math.min(selectedPlan.maxAge ?? 65, Math.max(selectedPlan.minAge ?? 0, +e.target.value)))}
                          className="w-16 px-2 py-1.5 text-[13px] font-bold text-center border border-gold/30 rounded-lg bg-gold/5 text-gold focus:outline-none focus:border-gold" />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-300">
                        <span>{selectedPlan.minAge ?? 0} yrs</span><span>{selectedPlan.maxAge ?? 65} yrs</span>
                      </div>
                    </div>

                    {/* ── Term: slider + number (hidden for pure annuity plans) ── */}
                    {!isPensionAnnuity && (
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Policy Term</label>
                        <div className="flex items-center gap-2 mb-1.5">
                          <input type="range" min={minTerm} max={maxTerm}
                            value={safeterm} onChange={e => setTerm(+e.target.value)}
                            className="flex-1 accent-[#b8860b] h-1.5 rounded-full" />
                          <input type="number" min={minTerm} max={maxTerm}
                            value={safeterm} onChange={e => setTerm(Math.min(maxTerm, Math.max(minTerm, +e.target.value)))}
                            className="w-16 px-2 py-1.5 text-[13px] font-bold text-center border border-gold/30 rounded-lg bg-gold/5 text-gold focus:outline-none focus:border-gold" />
                        </div>
                        <div className="flex justify-between text-[10px] mt-0.5">
                          <span className="text-gray-300">{minTerm} yrs</span>
                          <span className="text-amber-600 font-semibold">PPT: {ppt} yrs</span>
                          <span className="text-gray-300">{maxTerm} yrs</span>
                        </div>
                      </div>
                    )}

                    {/* ── Sum Assured (non-pension, non-ULIP) ── */}
                    {!isPensionAnnuity && !isUlip && (
                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                          Sum Assured
                          {selectedPlan.minSA && selectedPlan.minSA > sa && <span className="text-red-400 text-[10px] ml-1">(min {fmtSA(selectedPlan.minSA)})</span>}
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {SA_PRESETS.map((v: number) => (
                            <button key={v} onClick={() => setSa(v)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all
                                ${sa === v ? 'bg-gold text-white border-gold' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gold/30'}`}>
                              {fmtSA(v)}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <input type="range" min={selectedPlan.minSA ?? 100000} max={10000000} step={100000}
                            value={sa} onChange={e => setSa(+e.target.value)}
                            className="flex-1 accent-[#b8860b] h-1.5 rounded-full" />
                          <input type="number" min={selectedPlan.minSA ?? 100000} max={10000000} step={100000}
                            value={sa} onChange={e => setSa(Math.min(10000000, Math.max(selectedPlan.minSA ?? 100000, +e.target.value)))}
                            className="w-28 px-2 py-1.5 text-[12px] font-bold text-center border border-gold/30 rounded-lg bg-gold/5 text-gold focus:outline-none focus:border-gold" />
                        </div>
                        <div className="text-center text-[12px] text-gold font-semibold">( {toWords(sa)} )</div>
                      </div>
                    )}

                    {/* ── Purchase Price (pension/annuity plans) ── */}
                    {isPensionAnnuity && (
                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                          Purchase Price (Lump Sum)
                          <span className="text-gray-500 font-normal ml-1">(min {fmtSA(selectedPlan.minPurchasePrice ?? 100000)})</span>
                        </label>
                        <div className="flex items-center gap-2 mb-1">
                          <input type="range" min={selectedPlan.minPurchasePrice ?? 100000} max={20000000} step={100000}
                            value={purchasePrice} onChange={e => setPurchasePrice(+e.target.value)}
                            className="flex-1 accent-[#b8860b] h-1.5 rounded-full" />
                          <input type="number" min={selectedPlan.minPurchasePrice ?? 100000} max={20000000} step={100000}
                            value={purchasePrice} onChange={e => setPurchasePrice(Math.max(selectedPlan.minPurchasePrice ?? 100000, +e.target.value))}
                            className="w-28 px-2 py-1.5 text-[12px] font-bold text-center border border-gold/30 rounded-lg bg-gold/5 text-gold focus:outline-none focus:border-gold" />
                        </div>
                        <div className="text-center text-[12px] text-gold font-semibold">( {toWords(purchasePrice)} )</div>

                        {/* Annuity option */}
                        {selectedPlan.annuityOptions && selectedPlan.annuityOptions.length > 0 && (
                          <div className="mt-3">
                            <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Annuity Option</label>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedPlan.annuityOptions.map((opt: string) => (
                                <button key={opt} onClick={() => setAnnuityOption(opt)}
                                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all
                                    ${annuityOption === opt ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Maturity Age (Jeevan Utsav 771/883) ── */}
                    {isWholeLifeUtsav && selectedPlan.maturityAgeOptions && (
                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Select Maturity Age</label>
                        <div className="flex gap-2">
                          {selectedPlan.maturityAgeOptions.map((a: number) => (
                            <button key={a} onClick={() => setMaturityAge(a)}
                              className={`flex-1 text-[12px] font-bold py-2 rounded-lg border transition-all
                                ${maturityAge === a ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Survival Benefit % (Jeevan Tarun 734) ── */}
                    {isJeevanTarun && (
                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
                          Survival Benefit Option
                          <span className="text-gray-500 font-normal ml-1">(paid each year age 20–24)</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {([5,10,15,20] as const).map(pct => (
                            <button key={pct} onClick={() => setSurvivalBenefitPct(pct)}
                              className={`text-[12px] font-bold py-2.5 rounded-xl border transition-all
                                ${survivalBenefitPct === pct ? 'bg-navy text-white border-navy shadow' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-navy/20'}`}>
                              {pct}%
                              <div className="text-[9px] font-normal mt-0.5 opacity-70">of SA/yr</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Bima Lakshmi Option A/B ── */}
                    {isBimaLakshmi && (
                      <div className="sm:col-span-2">
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Plan Option</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['A','B'] as const).map(opt => (
                            <button key={opt} onClick={() => setBimaLakshmiOption(opt)}
                              className={`text-left p-3 rounded-xl border transition-all
                                ${bimaLakshmiOption === opt ? 'bg-navy text-white border-navy' : 'bg-gray-50 border-gray-100 hover:border-navy/20'}`}>
                              <div className={`text-[12px] font-bold ${bimaLakshmiOption === opt ? 'text-white' : 'text-gray-700'}`}>Option {opt}</div>
                              <div className={`text-[10px] mt-0.5 ${bimaLakshmiOption === opt ? 'text-white/70' : 'text-gray-500'}`}>
                                {opt === 'A' ? '50% SA survival benefit at end of PPT' : 'Deferred survival benefit at maturity'}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Mode (not for annuity) ── */}
                    {!isPensionAnnuity && (
                      <div>
                        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Premium Mode</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                          {(['yearly','halfyearly','quarterly','monthly'] as const).map(m => (
                            <button key={m} onClick={() => setMode(m)}
                              className={`text-[11px] font-bold py-2 rounded-lg border transition-all
                                ${mode === m ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-navy/20'}`}>
                              {MODE_LABEL[m]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Gender + Smoker ── */}
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Gender</label>
                      <div className="flex gap-2">
                        {(['male','female'] as const).map(g => (
                          <button key={g} onClick={() => setGender(g)}
                            className={`flex-1 text-[11px] font-bold py-2 rounded-lg border transition-all
                              ${gender === g ? 'bg-navy text-white border-navy' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                            {g === 'male' ? 'Male' : 'Female'}
                          </button>
                        ))}
                      </div>
                      {(isTermPlan || selectedPlan?.smokerNonSmokerRates) && (
                        <button onClick={() => setSmoker((s: boolean) => !s)}
                          className={`mt-2 w-full text-[11px] font-bold py-1.5 rounded-lg border transition-all
                            ${smoker ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                          Smoker {smoker ? '(+25% surcharge)' : '(click if applicable)'}
                        </button>
                      )}
                    </div>
                  </div>

                  <button onClick={calculate}
                    className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-3.5 rounded-xl transition-all text-[14px] flex items-center justify-center gap-2 shadow-md">
                    <Calculator className="w-4 h-4" /> Calculate &amp; See Results →
                  </button>
                </div>
  )
}
