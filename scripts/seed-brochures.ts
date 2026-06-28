import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BROCHURES: [number, string][] = [
  [715,"https://licindia.in/documents/20121/1243952/Lic+NEW+Jeevan+Anand+2024++4x9+inches+wxh+single+page.pdf"],
  [714,"https://licindia.in/documents/20121/1248951/Lic+NEW+ENDOWMENT+PLAN+2024++4x9+inches+wxh+single+pages.pdf"],
  [717,"https://licindia.in/documents/20121/1243952/LIC_Single+Premium+Endowment+plan_Sales+Brochure_4+inch+x+9+inch_Eng+(5)+(1).pdf"],
  [745,"https://licindia.in/documents/20121/1248984/LIC_Jeevan+Umang_Sales+Brochure_4+inch+x+9+inch_Eng+(4).pdf"],
  [736,"https://licindia.in/documents/20121/1319704/LIC_Jeevan+labh_Sales+Brochure_Eng.pdf"],
  [748,"https://licindia.in/documents/20121/1319704/LIC_Bima+Shree+Sales+Brochure_Eng_141025.pdf"],
  [760,"https://licindia.in/documents/20121/1319704/LIC%27s+Modified+BIMA+JYOTI+Plan_Sales+Brochure+_Eng+..pdf"],
  [771,"https://licindia.in/documents/20121/1248984/102268-+Jeevan+Utsav+Sales+Brochure_WEB+PDF.pdf"],
  [774,"https://licindia.in/documents/20121/1248951/101941+LIC_Amritbaal+Sales+Brochure_SEPT+24+(4).pdf"],
  [859,"https://licindia.in/documents/20121/1319704/Modified_Sales+Brochure+LIC%27s+Saral+Jeevan+Bima.pdf"],
  [733,"https://licindia.in/documents/20121/1319704/LIC_Jeevan+Lakshya+Sales+Brochure_Eng_141025.pdf"],
  [734,"https://licindia.in/documents/20121/1319704/Lic+Jeevan+Tarun+2024++4x9+inches+wxh+new.pdf"],
  [732,"https://licindia.in/documents/20121/1319704/Final+Sales+Brochure_New+ChildrensMoney+BackPlan.pdf"],
  [720,"https://licindia.in/documents/20121/1319704/Final+Sales+Brochure_New+Money+Back+Plan-20+years.pdf"],
  [721,"https://licindia.in/documents/20121/1319704/LIC_Money+Back+25+yrs+Sales+Brochure+Eng_06112025.pdf"],
  [887,"https://licindia.in/documents/20121/1319704/LIC+Bima+Kavach+Sales+Brochure+Eng_03122025.pdf"],
  [955,"https://licindia.in/documents/20121/1500493/LIC_Jeevan+amar_Sales+Brochure_4+inch+x+9+inch_Eng+(1).pdf"],
  [883,"https://licindia.in/documents/20121/1319704/LIC_Jeevan+Utsav+SP+Sales+Brochure_Eng.pdf"],
  [879,"https://licindia.in/documents/20121/1500493/LIC_Smart+Pension_Sales+Brochure_Eng.pdf"],
  [881,"https://licindia.in/documents/20121/1500493/LIC_Bima+Lakshmi_Sales+Brochure_Eng.pdf"],
  [912,"https://licindia.in/documents/20121/1500493/LIC_Nav+Jeevan+Shree_Sales+Brochure_Eng.pdf"],
  [886,"https://licindia.in/documents/20121/1500493/LIC_Protection+Plus_Sales+Brochure_Eng.pdf"],
  [149,"https://licindia.in/documents/20121/389029/Sales-Brochure_149.pdf"],
  [14, "https://licindia.in/documents/20121/377150/Sales-Brochure_14.pdf"],
]

async function main() {
  const planNos = BROCHURES.map(b => b[0])
  const { data: plans, error: planErr } = await sb
    .from('lic_plans')
    .select('id, plan_no, name')
    .in('plan_no', planNos)
    .eq('is_current_version', true)

  if (planErr) { console.error('Failed to fetch plans:', planErr.message); process.exit(1) }

  const planMap = new Map(plans!.map((p: { id: number; plan_no: number; name: string }) => [p.plan_no, p]))

  const rows = []
  const missing: number[] = []
  for (const [plan_no, url] of BROCHURES) {
    const plan = planMap.get(plan_no)
    if (!plan) { missing.push(plan_no); continue }
    rows.push({ plan_id: plan.id, plan_no, brochure_url: url, status: 'pending' })
  }

  const { error } = await sb.from('lic_brochures').upsert(rows, { onConflict: 'plan_id,brochure_url' })
  if (error) { console.error('Insert error:', error.message); process.exit(1) }

  console.log(`✅ Inserted: ${rows.length}`)
  if (missing.length) console.log(`⚠️  No plan_id found for plan_nos: ${missing.join(', ')}`)
}

main().catch(err => { console.error(err); process.exit(1) })
