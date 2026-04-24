const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/calculators/premium/page.tsx');
let content = fs.readFileSync(pagePath, 'utf-8');
const lines = content.split('\n');

const resultsStart = lines.findIndex(l => l.includes('{premResult && (')) - 1; // get the <div className="space-y-4"> or {premResult
const resultsEnd = lines.findIndex(l => l.includes('</div>{/* end results panel */}'));
const resultsJsx = lines.slice(resultsStart, resultsEnd).join('\n');

const resultsComponent = `import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronDown, ChevronUp,
  Share2, CheckCircle2, Info, Shield, TrendingUp, Star
} from 'lucide-react'
import { fmt, fmtSA } from '@/lib/format'
import { MODE_LABEL, SA_PRESETS } from '@/lib/constants'
import { RIDERS } from '@/lib/lic-plans-data.js'
import { openLeadPopup } from '@/lib/events'
import { CAT_AVATAR_COLOR } from './calc-constants'

export interface ResultsPanelProps {
  selectedPlan: any
  clientName: string
  salutation: string
  age: number
  sa: number
  safeterm: number
  ppt: number
  isTermPlan: boolean
  isUlip: boolean
  premResult: any
  matResult: any
  tax80C: number | null
  xirr: string | null
  multiplier: string | null
  benefitTable: any[]
  showTable: boolean
  setShowTable: (val: any) => void
  showAllRows: boolean
  setShowAllRows: (val: any) => void
  showAllModes: boolean
  setShowAllModes: (val: any) => void
  allModesPrem: any[] | null
  mode: string
  setMode: (val: any) => void
  isUnlocked: boolean
  setIsUnlocked: (val: any) => void
  unlockMobile: string
  setUnlockMobile: (val: string) => void
  unlockWantTo: string
  setUnlockWantTo: (val: string) => void
  unlockIAm: string
  setUnlockIAm: (val: string) => void
  unlockEmail: string
  setUnlockEmail: (val: string) => void
  unlockStatus: 'idle' | 'sending' | 'done'
  handleUnlock: (e: any) => void
  whatsappShare: () => void
}

export default function ResultsPanel({
  selectedPlan, clientName, salutation, age, sa, safeterm, ppt, isTermPlan, isUlip,
  premResult, matResult, tax80C, xirr, multiplier, benefitTable,
  showTable, setShowTable, showAllRows, setShowAllRows, showAllModes, setShowAllModes,
  allModesPrem, mode, setMode, isUnlocked, setIsUnlocked,
  unlockMobile, setUnlockMobile, unlockWantTo, setUnlockWantTo, unlockIAm, setUnlockIAm,
  unlockEmail, setUnlockEmail, unlockStatus, handleUnlock, whatsappShare
}: ResultsPanelProps) {
  const visibleRows = showAllRows ? benefitTable : benefitTable.slice(0, 10);
  return (
    <>
${resultsJsx}
    </>
  )
}
`;

fs.writeFileSync(path.join(__dirname, '../components/calculators/ResultsPanel.tsx'), resultsComponent);

// Now rewrite page.tsx to use these components
const beforeConstants = lines.slice(0, 14).join('\n');
const planBrowserStart = lines.findIndex(l => l.includes('{/* ══ LEFT — Plan Browser ═══════════════ */}'));
const importsAndState = lines.slice(52, planBrowserStart).join('\n'); // keep all the state hooks

// Construct the new page.tsx
let newPage = `'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Calculator, ArrowRight, ChevronDown, ChevronUp,
  Share2, CheckCircle2, Info, Search, Shield, TrendingUp, Star, RefreshCw
} from 'lucide-react'
import { PLANS, calculatePremium, calculateMaturity, generateBenefitTable, getPPT, RIDERS } from '@/lib/lic-plans-data.js'
import { fmt, fmtSA, toWords } from '@/lib/format'
import { SA_PRESETS, MODE_LABEL } from '@/lib/constants'
import { openLeadPopup } from '@/lib/events'
import { CAT_BADGE, CAT_AVATAR_COLOR, CATEGORIES } from '@/components/calculators/calc-constants'
import PlanSearch from '@/components/calculators/PlanSearch'
import InputsPanel from '@/components/calculators/InputsPanel'
import ResultsPanel from '@/components/calculators/ResultsPanel'

${importsAndState}

          {/* ══ LEFT — Plan Browser ═══════════════ */}
          <div className="lg:w-[360px] lg:flex-shrink-0">
            <PlanSearch 
              quickPlanNo={quickPlanNo} setQuickPlanNo={setQuickPlanNo}
              quickAge={quickAge} setQuickAge={setQuickAge} handleQuickSelect={handleQuickSelect}
              activeCat={activeCat} setActiveCat={setActiveCat} search={search} setSearch={setSearch}
              filteredPlans={filteredPlans} selectedPlan={selectedPlan} handleSelectPlan={handleSelectPlan}
            />
          </div>

          {/* ══ RIGHT — Calculator ════════════════ */}
          <div className="flex-1 min-w-0 space-y-4">
`;

// Add everything from right calc start up to inputs panel
const rightCalcStart = lines.findIndex(l => l.includes('{/* No plan selected */}'));
const rightCalcEnd = lines.findIndex(l => l.includes('{/* Inputs panel */}')) + 1;
newPage += lines.slice(rightCalcStart, rightCalcEnd).join('\n') + '\n';

// Add InputsPanel usage
newPage += `
                  <div className={\`\${showResults ? 'hidden' : 'block'}\`}>
                    <InputsPanel 
                      selectedPlan={selectedPlan} clientName={clientName} setClientName={setClientName}
                      salutation={salutation} setSalutation={setSalutation} age={age} setAge={setAge}
                      term={term} setTerm={setTerm} safeterm={safeterm} minTerm={minTerm} maxTerm={maxTerm}
                      ppt={ppt} sa={sa} setSa={setSa} isPensionAnnuity={isPensionAnnuity}
                      isWholeLifeUtsav={isWholeLifeUtsav} isJeevanTarun={isJeevanTarun} isBimaLakshmi={isBimaLakshmi}
                      isTermPlan={isTermPlan} isUlip={isUlip} purchasePrice={purchasePrice} setPurchasePrice={setPurchasePrice}
                      annuityOption={annuityOption} setAnnuityOption={setAnnuityOption} maturityAge={maturityAge}
                      setMaturityAge={setMaturityAge} survivalBenefitPct={survivalBenefitPct} setSurvivalBenefitPct={setSurvivalBenefitPct}
                      bimaLakshmiOption={bimaLakshmiOption} setBimaLakshmiOption={setBimaLakshmiOption}
                      mode={mode} setMode={setMode} gender={gender} setGender={setGender} smoker={smoker} setSmoker={setSmoker}
                      calculate={calculate}
                    />
                  </div>{/* end inputs panel */}
`;

// Add ResultsPanel usage
newPage += `
                  {/* Results panel — slides in from right */}
                  <div className={\`transition-all duration-300 ease-in-out \${showResults ? 'block' : 'hidden'}\`}>
                    <ResultsPanel
                      selectedPlan={selectedPlan} clientName={clientName} salutation={salutation}
                      age={age} sa={sa} safeterm={safeterm} ppt={ppt} isTermPlan={isTermPlan} isUlip={isUlip}
                      premResult={premResult} matResult={matResult} tax80C={tax80C} xirr={xirr} multiplier={multiplier}
                      benefitTable={benefitTable} showTable={showTable} setShowTable={setShowTable}
                      showAllRows={showAllRows} setShowAllRows={setShowAllRows} showAllModes={showAllModes}
                      setShowAllModes={setShowAllModes} allModesPrem={allModesPrem} mode={mode} setMode={setMode}
                      isUnlocked={isUnlocked} setIsUnlocked={setIsUnlocked} unlockMobile={unlockMobile}
                      setUnlockMobile={setUnlockMobile} unlockWantTo={unlockWantTo} setUnlockWantTo={setUnlockWantTo}
                      unlockIAm={unlockIAm} setUnlockIAm={setUnlockIAm} unlockEmail={unlockEmail} setUnlockEmail={setUnlockEmail}
                      unlockStatus={unlockStatus} handleUnlock={handleUnlock} whatsappShare={whatsappShare}
                    />
                  </div>{/* end results panel */}
`;

// Add footer
const slideEnd = lines.findIndex(l => l.includes('</div>{/* end slide container */}'));
newPage += lines.slice(slideEnd, lines.length).join('\n');

fs.writeFileSync(pagePath, newPage);

console.log('Successfully refactored page.tsx to use sub-components');
