/**
 * Compact LIC + Star Health plan reference injected into the AI system prompt.
 * Keeps the bot grounded in real data instead of hallucinating premiums.
 * Approximate premiums only — direct users to Ajay sir (9415313434) for exact figures.
 */

export const LIC_PLANS_CONTEXT = `
━━━ LIC PLAN REFERENCE (2026) ━━━

TERM PLANS (Pure protection, no maturity/bonus):
• New Jeevan Amar (955) — Age 18-65, term 10-40yr, min SA ₹25L. Non-smoker male, ₹50L SA: age 30→~₹4,200/yr | age 35→~₹5,500/yr | age 40→~₹8,500/yr. Smoker: +25%. Female: -7.5%.
• New Tech Term (954) — Online-only version of Jeevan Amar, same rates.
• Yuva Term Plan (875) — Age 18-45, min SA ₹2Cr, for high-cover young buyers.
GST on term plans: 18% (flat, all years).

ENDOWMENT (Protection + guaranteed savings, lump sum at maturity):
• New Endowment Plan (914) — Age 8-55, term 12-35yr. ₹5L SA, age 35, 20yr: ~₹28,000-30,000/yr (after GST yr2+).
• New Jeevan Anand (915) — Age 18-50, whole life protection + maturity. ₹5L SA, age 35, 21yr: ~₹32,000-34,000/yr.
• Jeevan Labh (936) — Age 8-59, limited pay. Options: 10yr PPT/16yr term, 15yr PPT/21yr term, 16yr PPT/25yr term. ₹5L SA, age 35, 25yr (16yr PPT): ~₹30,000/yr.
• Jeevan Lakshya (933) — Age 18-50, income benefit for family. ₹5L SA, age 35, 20yr: ~₹29,000/yr.
• Jeevan Azad (868) — Age 8-55, flexible endowment.
GST on endowment: 4.5% yr1, 2.25% yr2+. SA rebate: ₹2/₹1000 for SA ≥2L, ₹3/₹1000 for SA ≥5L.

MONEY BACK (Survival payouts at intervals + maturity):
• New Money Back 20yr (920) — Age 13-50. 20% SA at year 5, 10, 15; remaining 40%+bonus at maturity (yr 20).
• New Money Back 25yr (921) — Age 13-45. 15% SA at yr 5,10,15,20; 40%+bonus at maturity (yr 25).
• Bima Bachat (916) — Age 15-50, single premium + loyalty additions.

WHOLE LIFE:
• Jeevan Umang (945) — Age 0-55. 8% of SA paid yearly as income from end of PPT until age 100, PLUS full SA+bonus at age 100 or death. Best for long-term wealth.
• Jeevan Utsav (771) — Age 0-65, flexible income whole life.

CHILD PLANS:
• Jeevan Tarun (934) — Child age 0-12. 4 options for survival benefit (0/5/10/15% of SA/yr at age 20-24). Maturity at child age 25. Premium waiver if parent dies.
• New Children's Money Back (932) — Child age 0-12. Maturity at age 25.

PENSION / ANNUITY:
• Jeevan Shanti (850) — Age 30-79. Single or joint life. Immediate or deferred annuity. 12 annuity options. No maturity benefit — lifetime pension.
• Jeevan Akshay VII (857) — Age 30-85. Single premium, immediate annuity. 10 options.
• Saral Pension (862) — Simplified, single premium, age 40+.
Rough pension: ₹10L single premium at age 45 → ~₹70,000-80,000/yr annuity (Jeevan Shanti).

PREMIUM PLANS (High SA):
• Bima Shree (948) — Age 8-55, min SA ₹10L, PPT options 12/14/16yr.
• Jeevan Shiromani (947) — Age 18-55, min SA ₹1Cr. 4 options.

BONUS RATES 2026 (approx ₹ per ₹1000 SA/year):
New Endowment (914): ₹45 SRB + ₹110 FAB | New Jeevan Anand (915): ₹48 + ₹125 | Jeevan Labh (936): ₹54 + ₹165 | Jeevan Umang (945): ₹45 + ₹150

RIDERS: Accidental Death & Disability (₹0.75/₹1000 SA/yr) | Premium Waiver (for child plans) | Critical Illness (₹2.5/₹1000) | New Term Assurance Rider.

━━━ STAR HEALTH INSURANCE (2026) ━━━
• Family Health Optima (floater) — Family of 4 (30s), ₹5L SA: ~₹10,000-14,000/yr. Restore benefit, unlimited day care, cashless at 14,000+ hospitals.
• Individual Health Plan — Age 30, ₹5L SA: ~₹5,500-7,000/yr.
• Senior Citizen Red Carpet — Age 60-75, ₹1L-10L SA. Pre-existing diseases covered after 1yr.
• Star Accident Care — Accident-only, very low premium.
• Arogya Sanjeevani — Standard affordable floater, ₹1L-5L SA.
Cashless hospitals in Gorakhpur: BRD Medical College, Sahara Hospital, Sumerpur Hospital, Krishna Hospital.

━━━ GORAKHPUR / CLIENT CONTEXT ━━━
Office: Poddar Wealth Management, Gorakhpur, Uttar Pradesh (Purvanchal / eastern UP region).
Typical client: government employees, teachers (salary ₹25,000-60,000/month), small business owners, farmers. Age 25-55.
Typical premium budgets: ₹2,500-12,000/quarter for middle-income UP families.
Common needs: Term plan for bread-winner, child education plan, health cover for parents, retirement from age 55-60.
`
