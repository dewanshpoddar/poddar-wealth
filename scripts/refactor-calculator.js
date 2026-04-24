const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/calculators/premium/page.tsx');
let content = fs.readFileSync(pagePath, 'utf-8');
const lines = content.split('\n');

// Extract constants
const constantsEnd = lines.findIndex(l => l.includes('/* ─── page ────────────────────────────────── */'));
const constantsSection = lines.slice(12, constantsEnd).join('\n');

// Write constants to shared file
fs.writeFileSync(path.join(__dirname, '../components/calculators/calc-constants.ts'), 
`export ${constantsSection.replace(/const /g, 'export const ')}`);

// We'll just extract PlanSearch as a start to see if it reduces the file size cleanly
const planSearchStart = lines.findIndex(l => l.includes('{/* Quick Selector — like the competitor app */}')) - 2;
const planSearchEnd = lines.findIndex(l => l.includes('{/* ══ RIGHT — Calculator ════════════════ */}')) - 2;

const planSearchJsx = lines.slice(planSearchStart, planSearchEnd).join('\n');

const planSearchComponent = `import { Search, ChevronDown } from 'lucide-react'
import { CATEGORIES, CAT_AVATAR_COLOR } from './calc-constants'

export interface PlanSearchProps {
  quickPlanNo: string
  setQuickPlanNo: (val: string) => void
  quickAge: string
  setQuickAge: (val: string) => void
  handleQuickSelect: () => void
  activeCat: string
  setActiveCat: (val: string) => void
  search: string
  setSearch: (val: string) => void
  filteredPlans: any[]
  selectedPlan: any
  handleSelectPlan: (plan: any) => void
}

export default function PlanSearch({
  quickPlanNo, setQuickPlanNo, quickAge, setQuickAge, handleQuickSelect,
  activeCat, setActiveCat, search, setSearch, filteredPlans, selectedPlan, handleSelectPlan
}: PlanSearchProps) {
  return (
${planSearchJsx}
  )
}
`;

fs.writeFileSync(path.join(__dirname, '../components/calculators/PlanSearch.tsx'), planSearchComponent);

// Now let's extract InputsPanel
const inputsStart = lines.findIndex(l => l.includes('{/* Input form */}'));
const inputsEnd = lines.findIndex(l => l.includes('</div>{/* end inputs panel */}'));
const inputsJsx = lines.slice(inputsStart, inputsEnd).join('\n');

const inputsComponent = `import { Calculator } from 'lucide-react'
import { SA_PRESETS, MODE_LABEL } from '@/lib/constants'
import { fmtSA, toWords } from '@/lib/format'

export interface InputsPanelProps {
  selectedPlan: any
  clientName: string
  setClientName: (val: string) => void
  salutation: string
  setSalutation: (val: any) => void
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
  survivalBenefitPct: number
  setSurvivalBenefitPct: (val: number) => void
  bimaLakshmiOption: string
  setBimaLakshmiOption: (val: any) => void
  mode: string
  setMode: (val: any) => void
  gender: string
  setGender: (val: any) => void
  smoker: boolean
  setSmoker: (val: any) => void
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
${inputsJsx}
  )
}
`;

fs.writeFileSync(path.join(__dirname, '../components/calculators/InputsPanel.tsx'), inputsComponent);

console.log('Successfully extracted components.');
