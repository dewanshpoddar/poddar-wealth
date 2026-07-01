/**
 * Compact LIC + Star Health plan reference injected into the AI system prompt.
 * Plan numbers are the CURRENT 2024-26 table numbers used by LIC India.
 * Approximate premiums only — tools provide exact figures on demand.
 */

export const LIC_PLANS_CONTEXT = `
━━━ LIC PLAN REFERENCE (2026) ━━━

IMPORTANT: Use these EXACT plan numbers. Never guess — use find_plan tool if unsure.

TERM PLANS (Pure protection, no maturity/bonus):
• New Jeevan Amar (Plan 955) - Age 18-65, term 10-40yr, min SA ₹25L. Non-smoker male, ₹50L SA: age 30→~₹4,200/yr | age 35→~₹5,500/yr | age 40→~₹8,500/yr. Smoker: +25%. Female: -7.5%.
• New Tech Term (Plan 954) - Online-only term plan, same rates as Jeevan Amar.
• Yuva Term Plan (Plan 875) - Age 18-45, min SA ₹2Cr, for high-cover young buyers.
GST on term plans: 18% (flat, all years).

ENDOWMENT (Protection + guaranteed savings, lump sum at maturity):
• New Endowment Plan (Plan 714) - Age 8-55, term 12-35yr.
• New Jeevan Anand (Plan 715) - Age 18-50, whole life protection + maturity bonus.
• Jeevan Labh (Plan 736) - Age 8-59, limited premium pay. PPT/term combos: 10/16yr, 15/21yr, 16/25yr. Bonus ₹54/₹1000 SA.
• Jeevan Lakshya (Plan 733) - Age 18-50, income benefit for family + lump sum.
• Jeevan Azad (Plan 868) - Age 8-55, flexible endowment.
• Single Premium Endowment (Plan 717) - Single lump sum, age 90-sum limited.
GST on endowment: 4.5% yr1, 2.25% yr2+. SA rebate: ₹2/₹1000 for SA ≥₹2L, ₹3/₹1000 for SA ≥₹5L.

MONEY BACK (Survival payouts at intervals + maturity):
• New Money Back 20yr (Plan 720) - Age 13-50. 20% SA at yr 5,10,15; 40%+bonus at yr 20.
• New Money Back 25yr (Plan 721) - Age 13-45. 15% SA at yr 5,10,15,20; 40%+bonus at yr 25.
• Children's Money Back (Plan 732) - Child age 0-12, maturity at age 25.
• Bima Kavach (Plan 887) - Short-term money back, age 18-55.

WHOLE LIFE:
• Jeevan Umang (Plan 745) - Age 0-55. 8% SA paid yearly as income from PPT end until age 100, PLUS full SA+bonus at age 100/death.
• Jeevan Utsav (Plan 771) - Age 0-65, flexible income whole life plan.
• Jeevan Utsav SP (Plan 883) - Single premium version of Jeevan Utsav.

CHILD PLANS:
• Jeevan Tarun (Plan 734) - Child age 0-12. 4 survival benefit options at age 20-24. Maturity at age 25. Premium waiver if parent dies.
• Children's Money Back (Plan 732) - Child age 0-12, maturity at age 25.
• Amritbaal (Plan 774) - New child plan (2024), age 0-13.

PENSION / ANNUITY:
• Smart Pension (Plan 879) - Age 30-79. Single or joint life. Immediate/deferred annuity.
• Jeevan Shanti (Plan 850) - Deferred annuity, multiple options.
• Saral Jeevan Bima (Plan 859) - Simple term plan, age 18-65.
Rough pension: ₹10L single premium at age 45 → ~₹70,000-80,000/yr annuity.

PREMIUM / HIGH SA PLANS:
• Bima Shree (Plan 748) - Age 8-55, min SA ₹10L. PPT options 12/14/16yr. Guaranteed additions.
• Nav Jeevan Shree (Plan 912) - New (2024) high-value plan, age 8-60.
• Bima Lakshmi (Plan 881) - Women-focused endowment, age 8-55.
• Protection Plus (Plan 886) - Term + savings combo.

BONUS RATES FY2024-25 (₹ per ₹1000 SA/year — use calculate_maturity tool for exact figures):
New Endowment (714): ₹45 SRB | Jeevan Anand (715): ₹48 | Jeevan Labh (736): ₹54 | Jeevan Umang (745): ₹45 | Jeevan Lakshya (733): ₹47

RIDERS: Accidental Death & Disability (₹0.75/₹1000 SA/yr) | Premium Waiver (child plans) | Critical Illness (₹2.5/₹1000) | New Term Assurance Rider.

━━━ STAR HEALTH INSURANCE (2026) ━━━
• Family Health Optima (floater) - Family of 4 (30s), ₹5L SA: ~₹10,000-14,000/yr. Cashless at 14,000+ hospitals.
• Individual Health Plan - Age 30, ₹5L SA: ~₹5,500-7,000/yr.
• Senior Citizen Red Carpet - Age 60-75, pre-existing diseases covered after 1yr.
• Arogya Sanjeevani - Standard affordable floater, ₹1L-5L SA.
Cashless hospitals in Gorakhpur: BRD Medical College, Sahara Hospital, Sumerpur Hospital, Krishna Hospital.

━━━ GORAKHPUR / CLIENT CONTEXT ━━━
Office: Poddar Wealth Management, Gorakhpur, Uttar Pradesh (Purvanchal / eastern UP region).
Typical client: government employees, teachers (salary ₹25,000-60,000/month), small business owners, farmers. Age 25-55.
Typical premium budgets: ₹2,500-12,000/quarter for middle-income UP families.
Common needs: Term plan for bread-winner, child education plan, health cover for parents, retirement from age 55-60.
`
