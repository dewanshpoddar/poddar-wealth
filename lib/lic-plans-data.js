/**
 * LIC Plans Master Data — poddar-wealth
 * All 30+ active LIC plans with tabular premium rates,
 * bonus rates, GST rules, riders, and calculation logic.
 * Sources: licindia.in, liccalculator.org, insurance21.in (2026)
 * NOTE: All values are illustrative. Actual premiums may vary per LIC underwriting rules.
 */

// ─────────────────────────────────────────────
// GST RULES (as of 2026)
// ─────────────────────────────────────────────
export const GST_RULES = {
  endowment:   { year1: 0.045, year2plus: 0.0225 },
  moneyback:   { year1: 0.045, year2plus: 0.0225 },
  wholelife:   { year1: 0.045, year2plus: 0.0225 },
  child:       { year1: 0.045, year2plus: 0.0225 },
  term:        { year1: 0.18,  year2plus: 0.18   },
  pension:     { year1: 0.045, year2plus: 0.045  },
  ulip:        { year1: 0.18,  year2plus: 0.18   }, // on charges only
  singlePrem:  { year1: 0.018, year2plus: 0       },
};

// ─────────────────────────────────────────────
// MODE REBATE (discount on base premium)
// ─────────────────────────────────────────────
export const MODE_REBATE = {
  yearly:      0.03,
  halfyearly:  0.015,
  quarterly:   0,
  monthly:     0,
};

// ─────────────────────────────────────────────
// HIGH SUM ASSURED REBATE (per mille of SA)
// ─────────────────────────────────────────────
export const SA_REBATE = (sa) => {
  if (sa >= 500000)  return 3; // ₹3 per ₹1000
  if (sa >= 200000)  return 2; // ₹2 per ₹1000
  return 0;
};

// ─────────────────────────────────────────────
// SURRENDER VALUE FACTORS (% of total premiums paid)
// ─────────────────────────────────────────────
export const GSV_FACTORS = {
  year3: 0.30, year4: 0.50, year5: 0.50,
  year6: 0.50, year7: 0.55, year8: 0.55,
  year9: 0.60, year10: 0.65, year11: 0.70,
  year12: 0.75, year13: 0.80, year14: 0.85,
  year15plus: 0.90,
};

// ─────────────────────────────────────────────
// RIDERS (available across plans)
// ─────────────────────────────────────────────
export const RIDERS = {
  ADB: {
    id: "ADB",
    name: "Accidental Death & Disability Benefit",
    desc: "Extra payout equal to SA if death/disability due to accident.",
    ratePerThousand: 0.75,
    maxSA: 200000,
  },
  PWB: {
    id: "PWB",
    name: "Premium Waiver Benefit",
    desc: "Future premiums waived on death/disability of proposer (for child plans).",
    ratePerThousand: 1.50,
  },
  TERM: {
    id: "TERM",
    name: "New Term Assurance Rider",
    desc: "Additional life cover at low cost for the policy term.",
    ratePerThousand: 1.20,
  },
  CI: {
    id: "CI",
    name: "Critical Illness Rider",
    desc: "Lump sum on diagnosis of 15 specified critical illnesses.",
    ratePerThousand: 2.50,
  },
  LADB: {
    id: "LADB",
    name: "Linked Accidental Death Benefit",
    desc: "For ULIPs — accidental death benefit linked to fund.",
    ratePerThousand: 0.50,
  },
};

// ─────────────────────────────────────────────
// BONUS RATES 2026 (₹ per ₹1000 SA per year)
// Source: LIC declared bonus data, liccalculator.org 2026
// ─────────────────────────────────────────────
export const BONUS_RATES_2026 = {
  // Plan No → { srb (Simple Reversionary Bonus), fab (Final Addition Bonus per ₹1000 SA) }
  914:  { srb: 45, fab: 110 }, // New Endowment
  915:  { srb: 48, fab: 125 }, // New Jeevan Anand
  933:  { srb: 47, fab: 105 }, // Jeevan Lakshya
  936:  { srb: 54, fab: 165 }, // Jeevan Labh
  920:  { srb: 42, fab: 95  }, // New Money Back 20yr
  921:  { srb: 40, fab: 90  }, // New Money Back 25yr
  945:  { srb: 55, fab: 185 }, // Jeevan Umang
  948:  { srb: 50, fab: 150 }, // Bima Shree
  947:  { srb: 48, fab: 140 }, // Jeevan Shiromani
  934:  { srb: 42, fab: 90  }, // Jeevan Tarun (child)
  932:  { srb: 40, fab: 85  }, // New Children's Money Back
  715:  { srb: 48, fab: 125 }, // New Jeevan Anand (old plan, existing policyholders)
  // Non-par plans use Guaranteed Additions (GA) instead of SRB
  860:  { ga: 50,  fab: 0   }, // Bima Jyoti (GA per ₹1000/yr)
  771:  { ga: 40,  fab: 0   }, // Jeevan Utsav 771 (GA per ₹1000/yr during PPT)
  883:  { ga: 40,  fab: 0   }, // Jeevan Utsav Single Premium 883
};

// ─────────────────────────────────────────────
// TABULAR PREMIUM RATES (₹ per ₹1000 SA)
// Format: planNo → { age → { term → rate } }
// ─────────────────────────────────────────────
export const TABULAR_RATES = {

  // ── 914: NEW ENDOWMENT PLAN ──────────────────
  // Regular pay endowment. Term 12–35 yrs. Age 8–55.
  914: {
    20: { 12: 70.10, 16: 56.20, 20: 47.50, 25: 41.10, 30: 37.20 },
    25: { 12: 72.40, 16: 57.80, 20: 48.90, 25: 42.30, 30: 38.10 },
    30: { 12: 75.80, 16: 60.50, 20: 51.20, 25: 44.50, 30: 40.10 },
    35: { 12: 81.20, 16: 65.30, 20: 55.60, 25: 48.60, 30: 44.20 },
    40: { 12: 89.50, 16: 72.80, 20: 62.40, 25: 55.10 },
    45: { 12: 101.20, 16: 83.60, 20: 72.30 },
    50: { 12: 118.30, 16: 99.40 },
    55: { 12: 142.10 },
  },

  // ── 915: NEW JEEVAN ANAND ────────────────────
  // Regular pay endowment + whole life cover post maturity.
  // Term 15–35 yrs. Age 18–50.
  915: {
    18: { 15: 60.10, 20: 50.80, 25: 44.20, 30: 40.10, 35: 37.20 },
    20: { 15: 61.20, 20: 51.70, 25: 45.00, 30: 40.80, 35: 37.80 },
    25: { 15: 64.30, 20: 54.20, 25: 47.10, 30: 42.60, 35: 39.40 },
    30: { 15: 69.10, 20: 58.45, 25: 50.90, 30: 46.10, 35: 42.50 },
    35: { 15: 76.80, 20: 65.20, 25: 57.30, 30: 52.10, 35: 48.20 },
    40: { 15: 88.20, 20: 75.60, 25: 67.40, 30: 61.80 },
    45: { 15: 104.50, 20: 90.80, 25: 81.20 },
    50: { 15: 127.30, 20: 111.60 },
  },

  // ── 933: JEEVAN LAKSHYA ──────────────────────
  // Family income protection. PPT = Term - 3. Age 18–50.
  // Death benefit: 10% SA annually till maturity + 110% SA at maturity.
  933: {
    18: { 13: 60.20, 17: 51.10, 22: 44.80, 27: 40.50 },
    20: { 13: 61.50, 17: 52.20, 22: 45.70, 27: 41.30 },
    25: { 13: 64.80, 17: 54.90, 22: 48.10, 27: 43.50 },
    30: { 13: 69.50, 17: 59.20, 22: 52.00, 27: 47.20 },
    35: { 13: 77.20, 17: 66.10, 22: 58.50, 27: 53.40 },
    40: { 13: 88.90, 17: 76.60, 22: 68.20 },
    45: { 13: 105.40, 17: 91.80 },
    50: { 13: 129.10 },
  },

  // ── 936: JEEVAN LABH ─────────────────────────
  // Limited pay endowment. PPT 10/15/16 yrs for term 16/21/25 yrs. Age 8–59.
  936: {
    18: { 16: 40.20, 21: 36.50, 25: 33.80 },
    20: { 16: 41.10, 21: 37.20, 25: 34.50 },
    25: { 16: 43.80, 21: 39.60, 25: 36.80 },
    30: { 16: 47.90, 21: 43.40, 25: 40.30 },
    35: { 16: 54.20, 21: 49.30, 25: 45.90 },
    40: { 16: 63.10, 21: 57.80, 25: 54.10 },
    45: { 16: 75.80, 21: 70.20 },
    50: { 16: 93.40, 21: 87.60 },
    55: { 16: 118.20 },
  },

  // ── 920: NEW MONEY BACK 20 YRS ───────────────
  // Survival benefits: 20% SA at end of 5, 10, 15 yrs. 40% SA + bonuses at maturity.
  // Fixed term 20 yrs. PPT 15 yrs. Age 13–50.
  920: {
    13: { 20: 64.20 },
    18: { 20: 67.50 },
    20: { 20: 69.10 },
    25: { 20: 73.80 },
    30: { 20: 80.20 },
    35: { 20: 89.60 },
    40: { 20: 103.40 },
    45: { 20: 122.80 },
    50: { 20: 149.20 },
  },

  // ── 921: NEW MONEY BACK 25 YRS ───────────────
  // Survival benefits: 15% SA at 5, 10, 15, 20 yrs. 40% SA + bonuses at maturity.
  // Fixed term 25 yrs. PPT 20 yrs. Age 13–45.
  921: {
    13: { 25: 56.30 },
    18: { 25: 59.20 },
    20: { 25: 60.80 },
    25: { 25: 65.10 },
    30: { 25: 71.40 },
    35: { 25: 80.90 },
    40: { 25: 94.20 },
    45: { 25: 113.60 },
  },

  // ── 945: JEEVAN UMANG ────────────────────────
  // Whole life. PPT 15/20/25/30 yrs. Survival benefit: 8% SA/yr after PPT.
  // Maturity at age 100: SA + bonuses. Age 90 days to 55/60 yrs.
  945: {
    18: { 15: 52.40, 20: 44.20, 25: 38.50, 30: 34.80 },
    20: { 15: 53.60, 20: 45.20, 25: 39.40, 30: 35.60 },
    25: { 15: 57.10, 20: 48.30, 25: 42.10, 30: 38.00 },
    30: { 15: 62.80, 20: 53.40, 25: 46.70, 30: 42.30 },
    35: { 15: 70.90, 20: 60.80, 25: 53.50, 30: 48.80 },
    40: { 15: 82.60, 20: 71.20, 25: 63.10 },
    45: { 15: 99.10, 20: 86.40 },
    50: { 15: 122.40 },
  },

  // ── 771: JEEVAN UTSAV (NEW) ──────────────────
  // Non-par whole life. PPT 5–16 yrs. GA: ₹40/₹1000 SA/yr during PPT.
  // Survival benefit: 10% SA/yr for life after PPT OR flexi income at 5.5% interest.
  // Age 90 days–65 yrs.
  771: {
    18: { 5: 196.40, 8: 128.50, 10: 106.20, 12: 91.40, 15: 77.80, 16: 74.20 },
    20: { 5: 198.20, 8: 129.80, 10: 107.30, 12: 92.40, 15: 78.60, 16: 74.90 },
    25: { 5: 203.60, 8: 133.50, 10: 110.40, 12: 95.10, 15: 81.00, 16: 77.20 },
    30: { 5: 210.80, 8: 138.80, 10: 115.00, 12: 99.20, 15: 84.70, 16: 80.80 },
    35: { 5: 220.40, 8: 146.20, 10: 121.40, 12: 104.80, 15: 89.90, 16: 85.80 },
    40: { 5: 233.10, 8: 156.40, 10: 130.20, 12: 112.80, 15: 97.20 },
    45: { 5: 249.80, 8: 169.60, 10: 142.00, 12: 123.40 },
    50: { 5: 271.20, 8: 186.80, 10: 157.40 },
    55: { 5: 298.60, 8: 209.40 },
    60: { 5: 334.20 },
  },

  // ── 948: BIMA SHREE ──────────────────────────
  // HNI plan. Limited pay. Money back + endowment. Min SA ₹10 lakh.
  // PPT 12/14/16 for term 20/24/28 yrs. Age 8–55.
  948: {
    18: { 20: 48.20, 24: 42.10, 28: 37.80 },
    25: { 20: 51.40, 24: 44.90, 28: 40.30 },
    30: { 20: 55.80, 24: 48.70, 28: 43.90 },
    35: { 20: 62.10, 24: 54.60, 28: 49.40 },
    40: { 20: 71.40, 24: 63.20, 28: 57.60 },
    45: { 20: 84.20, 24: 75.10 },
    50: { 20: 102.30 },
  },

  // ── 947: JEEVAN SHIROMANI ────────────────────
  // HNI plan. Min SA ₹1 crore. Limited pay. Money back + endowment.
  // PPT 14/16/18 for term 20/24/28 yrs. Age 18–55.
  947: {
    18: { 20: 46.80, 24: 40.90, 28: 36.70 },
    25: { 20: 49.80, 24: 43.60, 28: 39.20 },
    30: { 20: 54.10, 24: 47.40, 28: 42.70 },
    35: { 20: 60.30, 24: 53.10, 28: 48.00 },
    40: { 20: 69.50, 24: 61.60, 28: 56.10 },
    45: { 20: 82.10, 24: 73.20 },
    50: { 20: 99.80 },
  },

  // ── 934: JEEVAN TARUN (CHILD) ────────────────
  // Child plan. Risk from age 8. Survival benefits age 20, 21, 22, 23, 24 (proportional).
  // Age of child: 90 days–12 yrs.
  934: {
    0:  { 20: 48.20, 25: 42.10 },
    5:  { 20: 52.60, 25: 46.30 },
    8:  { 20: 56.40, 25: 49.80 },
    10: { 20: 59.20, 25: 52.40 },
    12: { 20: 62.80, 25: 55.90 },
  },

  // ── 932: NEW CHILDREN'S MONEY BACK ───────────
  // Child plan. Survival benefits at ages 18, 20, 22 (20% SA each).
  // Maturity: 40% SA + bonuses at age 25. Age of child: 0–12.
  932: {
    0:  { 25: 45.80 },
    3:  { 25: 48.20 },
    5:  { 25: 50.10 },
    8:  { 25: 53.60 },
    10: { 25: 56.40 },
    12: { 25: 59.80 },
  },

  // ── TERM PLANS ────────────────────────────────

  // 954: NEW TECH TERM (Online term, non-smoker male rates)
  // Pure protection. No maturity. Term 10–40 yrs. Age 18–65.
  954: {
    18: { 10: 2.80, 15: 3.20, 20: 3.80, 25: 4.50, 30: 5.40, 35: 6.60, 40: 8.10 },
    20: { 10: 2.90, 15: 3.30, 20: 3.90, 25: 4.60, 30: 5.60, 35: 6.80, 40: 8.40 },
    25: { 10: 3.20, 15: 3.80, 20: 4.50, 25: 5.20, 30: 6.10, 35: 7.40, 40: 9.20 },
    30: { 10: 4.10, 15: 5.20, 20: 6.40, 25: 7.80, 30: 9.20, 35: 11.40 },
    35: { 10: 6.20, 15: 8.10, 20: 10.40, 25: 13.20, 30: 16.80 },
    40: { 10: 9.80, 15: 13.20, 20: 17.50, 25: 22.80 },
    45: { 10: 16.40, 15: 22.80, 20: 30.20 },
    50: { 10: 27.20, 15: 38.60 },
    55: { 10: 45.80 },
  },

  // 955: NEW JEEVAN AMAR (Offline term, agent channel)
  // Level or increasing SA. Age 18–65. Non-smoker male rates.
  955: {
    18: { 10: 3.20, 15: 3.80, 20: 4.60, 25: 5.50, 30: 6.60, 35: 8.10, 40: 9.90 },
    25: { 10: 3.80, 15: 4.60, 20: 5.60, 25: 6.70, 30: 7.90, 35: 9.60, 40: 11.80 },
    30: { 10: 5.10, 15: 6.50, 20: 8.10, 25: 9.90, 30: 11.80, 35: 14.40 },
    35: { 10: 7.80, 15: 10.20, 20: 13.10, 25: 16.50, 30: 20.40 },
    40: { 10: 12.40, 15: 16.80, 20: 22.10, 25: 28.60 },
    45: { 10: 20.80, 15: 28.60, 20: 38.40 },
    50: { 10: 34.60, 15: 48.20 },
  },

  // 859: SARAL JEEVAN BIMA (Simplified term)
  // Standardized term plan. SA ₹5L–₹25L. Age 18–65.
  859: {
    18: { 5: 6.20, 10: 4.80, 15: 5.60, 20: 6.80 },
    25: { 5: 6.80, 10: 5.40, 15: 6.40, 20: 7.80 },
    30: { 5: 7.80, 10: 6.60, 15: 8.20, 20: 10.40 },
    35: { 5: 9.60, 10: 8.60, 15: 11.20, 20: 14.60 },
    40: { 5: 12.40, 10: 11.80, 15: 15.80, 20: 21.40 },
    45: { 5: 16.80, 10: 16.80, 15: 23.60 },
    50: { 5: 23.60, 10: 25.20 },
  },

  // 875: YUVA TERM (for youth 18–45)
  // Online term plan. Age 18–45. Min SA ₹50L.
  875: {
    18: { 10: 2.60, 15: 3.00, 20: 3.50, 25: 4.10, 30: 4.90 },
    20: { 10: 2.70, 15: 3.10, 20: 3.60, 25: 4.20, 30: 5.00 },
    25: { 10: 3.00, 15: 3.50, 20: 4.20, 25: 4.90, 30: 5.80 },
    30: { 10: 3.80, 15: 4.90, 20: 6.00, 25: 7.20, 30: 8.60 },
    35: { 10: 5.80, 15: 7.60, 20: 9.80, 25: 12.40 },
    40: { 10: 9.20, 15: 12.40, 20: 16.50 },
    45: { 10: 15.40, 15: 21.40 },
  },

  // ── PENSION PLANS ─────────────────────────────

  // 858: NEW JEEVAN SHANTI (Single premium immediate/deferred annuity)
  // Annuity rates per ₹1000 purchase price per annum (Option A — Life Annuity)
  858: {
    40: { immediate: 62.40 },
    45: { immediate: 68.20 },
    50: { immediate: 75.80 },
    55: { immediate: 85.60 },
    60: { immediate: 98.40 },
    65: { immediate: 115.20 },
    70: { immediate: 138.60 },
    75: { immediate: 170.40 },
  },

  // 857: JEEVAN AKSHAY VII (Single premium immediate annuity)
  // Annuity rates per ₹1000 purchase price per annum
  857: {
    30: { immediate: 55.20 },
    35: { immediate: 58.40 },
    40: { immediate: 62.80 },
    45: { immediate: 68.60 },
    50: { immediate: 76.20 },
    55: { immediate: 86.40 },
    60: { immediate: 100.20 },
    65: { immediate: 118.60 },
    70: { immediate: 143.80 },
    75: { immediate: 178.20 },
    80: { immediate: 225.40 },
    85: { immediate: 291.80 },
  },

  // 862: SARAL PENSION (Simple annuity — single premium)
  862: {
    40: { immediate: 60.20 },
    45: { immediate: 65.80 },
    50: { immediate: 72.60 },
    55: { immediate: 81.40 },
    60: { immediate: 93.20 },
    65: { immediate: 109.60 },
    70: { immediate: 132.40 },
  },

  // ── ULIP PLANS ────────────────────────────────
  // ULIPs: returns are market-linked, not tabular.
  // Premium allocation charges (PAC) and fund management charges (FMC):
  // 873: INDEX PLUS
  // 749: NIVESH PLUS
  // 752: SIIP
  // 886: PROTECTION PLUS

  // ── OTHER ACTIVE PLANS ────────────────────────

  // 717: SINGLE PREMIUM ENDOWMENT
  // One-time premium. Term 10–25 yrs. Age 90 days–65 yrs.
  717: {
    18: { 10: 710.20, 15: 588.40, 20: 499.60, 25: 434.80 },
    25: { 10: 718.60, 15: 596.40, 20: 507.20, 25: 442.10 },
    30: { 10: 728.40, 15: 606.80, 20: 517.40, 25: 452.60 },
    35: { 10: 741.20, 15: 620.40, 20: 531.20, 25: 466.80 },
    40: { 10: 758.60, 15: 638.40, 20: 549.80 },
    45: { 10: 781.40, 15: 662.20 },
    50: { 10: 811.60 },
  },

  // 916: BIMA BACHAT (Money back with single or limited premium)
  // Survival benefits at regular intervals. Age 15–50.
  916: {
    15: { 9: 828.40, 12: 654.20 },
    20: { 9: 835.60, 12: 661.80 },
    25: { 9: 844.20, 12: 670.40 },
    30: { 9: 854.80, 12: 681.60 },
    35: { 9: 868.20, 12: 695.40 },
    40: { 9: 884.60, 12: 712.80 },
    45: { 9: 904.20, 12: 733.40 },
    50: { 9: 928.60 },
  },

  // 868: JEEVAN AZAD (Limited pay endowment)
  // PPT limited. Term 15–20 yrs. Age 8–55.
  868: {
    18: { 15: 57.20, 20: 48.40 },
    25: { 15: 60.80, 20: 51.60 },
    30: { 15: 65.60, 20: 55.80 },
    35: { 15: 72.40, 20: 62.10 },
    40: { 15: 82.20, 20: 71.40 },
    45: { 15: 96.80, 20: 85.20 },
    50: { 15: 117.40 },
  },

  // 944: AADHAAR SHILA (For women with Aadhaar — endowment)
  // Age 8–55. Term 10–20 yrs. Max SA ₹2L.
  944: {
    18: { 10: 86.20, 15: 64.40, 20: 52.80 },
    25: { 10: 88.60, 15: 66.40, 20: 54.60 },
    30: { 10: 92.40, 15: 69.80, 20: 57.60 },
    35: { 10: 98.20, 15: 74.60, 20: 62.40 },
    40: { 10: 106.80, 15: 82.40, 20: 69.80 },
    45: { 10: 119.40, 15: 93.60 },
    50: { 10: 137.60 },
  },

  // 943: AADHAAR STAMBH (For men with Aadhaar — endowment)
  // Age 8–55. Term 10–20 yrs. Max SA ₹2L.
  943: {
    18: { 10: 88.60, 15: 66.20, 20: 54.40 },
    25: { 10: 91.20, 15: 68.40, 20: 56.20 },
    30: { 10: 95.20, 15: 71.80, 20: 59.40 },
    35: { 10: 101.40, 15: 76.80, 20: 64.20 },
    40: { 10: 110.40, 15: 84.80, 20: 72.00 },
    45: { 10: 123.40, 15: 96.40 },
    50: { 10: 142.20 },
  },
};

// ─────────────────────────────────────────────
// PLAN MASTER DATA
// Complete metadata for all active plans
// ─────────────────────────────────────────────
// @ts-nocheck
export const PLANS = [

  // ════════════════════════════════════════════
  // ENDOWMENT PLANS
  // ════════════════════════════════════════════
  {
    id: "914",
    planNo: 914,
    name: "New Endowment Plan",
    shortName: "New Endowment",
    category: "endowment",
    type: "participating",
    desc: "Classic savings + protection plan. Lump sum at maturity or death, with bonus participation.",
    minAge: 8, maxAge: 55,
    minTerm: 12, maxTerm: 35,
    minSA: 100000, maxSA: null,
    ppt: "same", // PPT = Term
    moneybkPayouts: [],
    survivalBenefit: null,
    deathBenefitFormula: "max(125% SA, 10x annualPremium)",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "Lifelong savings with life cover",
      "Loan after 3 years",
      "Tax benefit under 80C and 10(10D)",
      "Ideal for first-time buyers",
    ],
    tags: ["Endowment", "With profit", "Tax saving"],
    bestFor: "First-time buyers, long-term savings",
    xirr: "5.0–5.5%",
  },
  {
    id: "915",
    planNo: 915,
    name: "New Jeevan Anand",
    shortName: "Jeevan Anand",
    category: "endowment",
    type: "participating",
    desc: "Endowment + whole life cover. Get maturity benefit AND life cover continues after maturity for lifetime.",
    minAge: 18, maxAge: 50,
    minTerm: 15, maxTerm: 35,
    minSA: 100000, maxSA: null,
    ppt: "same",
    moneybkPayouts: [],
    survivalBenefit: null,
    postMaturityCover: true, // unique feature
    deathBenefitFormula: "max(125% SA, 7x annualPremium) + bonuses",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "TERM", "CI"],
    keyFeatures: [
      "Life cover continues even after maturity",
      "Participating — bonus every year",
      "Death benefit = max(125% SA, 7x premium)",
      "Best two-in-one plan for family protection + savings",
    ],
    tags: ["Endowment", "Whole life cover", "With profit"],
    bestFor: "Family protection + wealth creation",
    xirr: "5.2–5.8%",
  },
  {
    id: "936",
    planNo: 936,
    name: "Jeevan Labh",
    shortName: "Jeevan Labh",
    category: "endowment",
    type: "participating",
    desc: "Limited pay endowment. Pay for fewer years, enjoy coverage + bonus for longer. Best returns among endowment plans.",
    minAge: 8, maxAge: 59,
    minTerm: 16, maxTerm: 25,
    minSA: 200000, maxSA: null,
    pptOptions: [
      { ppt: 10, term: 16 },
      { ppt: 15, term: 21 },
      { ppt: 16, term: 25 },
    ],
    ppt: "limited",
    moneybkPayouts: [],
    deathBenefitFormula: "max(125% SA, 10x annualPremium) + bonuses",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "PWB", "TERM"],
    keyFeatures: [
      "Pay for 10/15/16 years, covered for 16/21/25 years",
      "Highest bonus rate among endowment plans (₹54/1000 SA/yr)",
      "Best XIRR in its category",
      "Minimum SA ₹2 lakh",
    ],
    tags: ["Limited pay", "High returns", "With profit"],
    bestFor: "Higher corpus with shorter payment obligation",
    xirr: "5.5–6.2%",
  },
  {
    id: "933",
    planNo: 933,
    name: "Jeevan Lakshya",
    shortName: "Jeevan Lakshya",
    category: "endowment",
    type: "participating",
    desc: "Family income protection plan. On death, nominee gets 10% SA annually till maturity, then 110% SA at end.",
    minAge: 18, maxAge: 50,
    minTerm: 13, maxTerm: 25,
    minSA: 100000, maxSA: null,
    ppt: "term_minus_3", // PPT = Term - 3
    moneybkPayouts: [],
    onDeathAnnualPayout: 0.10, // 10% SA per year till term
    onDeathFinalPayout: 1.10,  // 110% SA at maturity
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "Annual income to family on death of policyholder",
      "PPT is 3 years less than policy term",
      "Ideal for income replacement planning",
    ],
    tags: ["Family income", "Endowment", "With profit"],
    bestFor: "Breadwinner family protection",
    xirr: "5.0–5.6%",
  },
  {
    id: "868",
    planNo: 868,
    name: "Jeevan Azad",
    shortName: "Jeevan Azad",
    category: "endowment",
    type: "participating",
    desc: "Limited pay endowment plan. Flexible premium paying terms with full coverage for entire policy term.",
    minAge: 8, maxAge: 55,
    minTerm: 15, maxTerm: 20,
    minSA: 200000, maxSA: null,
    ppt: "limited",
    pptOptions: [{ ppt: 10, term: 15 }, { ppt: 12, term: 20 }],
    moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "Limited premium payment term",
      "Participating with annual bonus",
    ],
    tags: ["Limited pay", "Endowment", "With profit"],
    bestFor: "Those wanting shorter payment commitment",
    xirr: "5.0–5.5%",
  },
  {
    id: "944",
    planNo: 944,
    name: "Aadhaar Shila",
    shortName: "Aadhaar Shila",
    category: "endowment",
    type: "participating",
    desc: "Endowment plan exclusively for women with valid Aadhaar. Max SA ₹2 lakh.",
    minAge: 8, maxAge: 55,
    minTerm: 10, maxTerm: 20,
    minSA: 75000, maxSA: 200000,
    ppt: "same",
    gender: "female",
    moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB"],
    keyFeatures: [
      "Exclusively for women with Aadhaar",
      "Max SA ₹2 lakh",
      "Affordable premiums",
    ],
    tags: ["Women only", "Aadhaar", "Endowment"],
    bestFor: "Women's financial security",
    xirr: "4.8–5.2%",
  },
  {
    id: "943",
    planNo: 943,
    name: "Aadhaar Stambh",
    shortName: "Aadhaar Stambh",
    category: "endowment",
    type: "participating",
    desc: "Endowment plan for men with valid Aadhaar. Max SA ₹2 lakh. Simple and affordable.",
    minAge: 8, maxAge: 55,
    minTerm: 10, maxTerm: 20,
    minSA: 75000, maxSA: 200000,
    ppt: "same",
    gender: "male",
    moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB"],
    keyFeatures: [
      "For men with Aadhaar card",
      "Max SA ₹2 lakh",
      "Simple savings + cover",
    ],
    tags: ["Men only", "Aadhaar", "Endowment"],
    bestFor: "Affordable savings plan for salaried/rural",
    xirr: "4.8–5.2%",
  },

  // ════════════════════════════════════════════
  // MONEY BACK PLANS
  // ════════════════════════════════════════════
  {
    id: "920",
    planNo: 920,
    name: "New Money Back Plan — 20 Years",
    shortName: "Money Back 20yr",
    category: "moneyback",
    type: "participating",
    desc: "Get 20% of SA back at end of 5th, 10th and 15th year. Remaining 40% SA + bonuses at maturity.",
    minAge: 13, maxAge: 50,
    minTerm: 20, maxTerm: 20, // fixed
    minSA: 100000, maxSA: null,
    ppt: 15, // fixed PPT
    moneybkPayouts: [
      { year: 5,  pct: 0.20 },
      { year: 10, pct: 0.20 },
      { year: 15, pct: 0.20 },
    ],
    maturityPct: 0.40, // 40% SA at maturity + bonuses
    maturityFormula: "40% SA + bonuses + FAB",
    gstCategory: "moneyback",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "20% SA back every 5 years for liquidity",
      "Premium paying term only 15 years",
      "40% SA + full bonuses at maturity",
      "Life cover throughout for full SA",
    ],
    tags: ["Money back", "Periodic returns", "With profit"],
    bestFor: "Planned liquidity every 5 years",
    xirr: "4.8–5.4%",
  },
  {
    id: "921",
    planNo: 921,
    name: "New Money Back Plan — 25 Years",
    shortName: "Money Back 25yr",
    category: "moneyback",
    type: "participating",
    desc: "Get 15% of SA back every 5 years (4 times). Remaining 40% SA + bonuses at 25-year maturity.",
    minAge: 13, maxAge: 45,
    minTerm: 25, maxTerm: 25, // fixed
    minSA: 100000, maxSA: null,
    ppt: 20, // fixed PPT
    moneybkPayouts: [
      { year: 5,  pct: 0.15 },
      { year: 10, pct: 0.15 },
      { year: 15, pct: 0.15 },
      { year: 20, pct: 0.15 },
    ],
    maturityPct: 0.40,
    maturityFormula: "40% SA + bonuses + FAB",
    gstCategory: "moneyback",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "4 periodic payouts of 15% SA each",
      "Premium paying term only 20 years",
      "Good for milestone-based planning",
    ],
    tags: ["Money back", "4 payouts", "With profit"],
    bestFor: "Long-term with periodic cash flows",
    xirr: "4.7–5.3%",
  },
  {
    id: "916",
    planNo: 916,
    name: "Bima Bachat",
    shortName: "Bima Bachat",
    category: "moneyback",
    type: "participating",
    desc: "Single/limited premium money back plan. Survival benefits at regular intervals. Good for lump sum investors.",
    minAge: 15, maxAge: 50,
    minTerm: 9, maxTerm: 12,
    minSA: 35000, maxSA: null,
    ppt: "single_or_limited",
    moneybkPayouts: [],
    maturityFormula: "SA + loyalty additions",
    gstCategory: "singlePrem",
    riders: ["ADB"],
    keyFeatures: [
      "Single premium option available",
      "Survival benefits at intervals",
      "Loyalty additions at maturity",
    ],
    tags: ["Single premium", "Money back", "Lump sum"],
    bestFor: "Lump sum investors wanting periodic returns",
    xirr: "4.5–5.0%",
  },

  // ════════════════════════════════════════════
  // WHOLE LIFE PLANS
  // ════════════════════════════════════════════
  {
    id: "945",
    planNo: 945,
    name: "Jeevan Umang",
    shortName: "Jeevan Umang",
    category: "wholelife",
    type: "participating",
    desc: "Whole life plan with annual income. Get 8% of SA every year after PPT ends, for life. Lump sum at age 100.",
    minAge: 0, maxAge: 55,
    minTerm: null, maxTerm: null, // term = 100 - entry age
    minSA: 200000, maxSA: null,
    pptOptions: [10, 15, 20, 30],
    ppt: "limited",
    survivalBenefit: { rate: 0.08, from: "after_ppt", frequency: "annual" }, // 8% SA per year
    maturityAge: 100,
    maturityFormula: "SA + bonuses",
    gstCategory: "wholelife",
    riders: ["ADB", "PWB"],
    keyFeatures: [
      "8% SA paid annually as income after PPT — for life",
      "Participating — earns bonus during PPT",
      "Lump sum SA + bonuses at age 100",
      "Best for retirement income planning",
    ],
    tags: ["Whole life", "Annual income", "Retirement"],
    bestFor: "Lifelong annual income + legacy",
    xirr: "5.8–6.5%",
  },
  {
    id: "771",
    planNo: 771,
    name: "Jeevan Utsav",
    shortName: "Jeevan Utsav",
    category: "wholelife",
    type: "non_participating",
    desc: "Non-par whole life with guaranteed income. Pay for 5–16 years. Get 10% SA annually for life after PPT. Guaranteed additions during PPT.",
    minAge: 0, maxAge: 65,
    minTerm: null, maxTerm: null, // term = 100 - entry age
    pptOptions: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    ppt: "limited",
    ga: 40, // Guaranteed Addition ₹40/₹1000 SA/yr during PPT
    survivalBenefit: { rate: 0.10, from: "after_ppt", frequency: "annual" }, // 10% SA per year
    incomeOptions: ["regular", "flexi"], // flexi accumulates at 5.5% p.a.
    maturityAge: 100,
    maturityFormula: "SA + GAs",
    gstCategory: "wholelife",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "10% SA annually for life after premium paying term",
      "Guaranteed Additions: ₹40/₹1000 SA/yr during PPT",
      "Non-participating — returns are guaranteed",
      "Flexi income option: accumulate at 5.5% p.a.",
    ],
    tags: ["Whole life", "Guaranteed", "10% annual income"],
    bestFor: "Guaranteed lifetime income seekers",
    xirr: "5.5–6.0%",
  },
  {
    id: "883",
    planNo: 883,
    name: "Jeevan Utsav Single Premium",
    shortName: "Utsav Single Prem",
    category: "wholelife",
    type: "non_participating",
    desc: "Single premium whole life plan (launched Jan 2026). Pay once. Get 10% SA annually for life from chosen deferment period.",
    minAge: 0, maxAge: 65,
    minSA: 500000, maxSA: null,
    ppt: "single",
    defermentOptions: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    ga: 40, // during deferment period
    survivalBenefit: { rate: 0.10, from: "after_deferment", frequency: "annual" },
    maturityAge: 100,
    maturityFormula: "SA + GAs",
    gstCategory: "singlePrem",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "Pay once — covered for life",
      "10% SA every year from chosen year",
      "GA: ₹40/₹1000 SA during deferment period",
      "Min SA ₹5 lakh",
    ],
    tags: ["Single premium", "Whole life", "Guaranteed income"],
    bestFor: "HNI investors wanting guaranteed lifelong income",
    xirr: "5.5–6.0%",
  },

  // ════════════════════════════════════════════
  // HNI / SPECIAL PLANS
  // ════════════════════════════════════════════
  {
    id: "948",
    planNo: 948,
    name: "Bima Shree",
    shortName: "Bima Shree",
    category: "endowment",
    type: "participating",
    desc: "HNI plan. Min SA ₹10 lakh. Limited pay money back + endowment. Periodic survival benefits at 12th/24th/36th year.",
    minAge: 8, maxAge: 55,
    minTerm: 20, maxTerm: 28,
    minSA: 1000000, maxSA: null,
    pptOptions: [{ ppt: 12, term: 20 }, { ppt: 14, term: 24 }, { ppt: 16, term: 28 }],
    ppt: "limited",
    moneybkPayouts: [
      { yearFromStart: "year12", pct: 0.30 },
      { yearFromStart: "year24", pct: 0.30 },
    ],
    maturityFormula: "40% SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "TERM"],
    keyFeatures: [
      "Minimum SA ₹10 lakh",
      "30% SA payout at milestone years",
      "Critical illness rider available",
      "High bonus rate (₹50/1000 SA)",
    ],
    tags: ["HNI", "Limited pay", "Money back", "High SA"],
    bestFor: "High net worth — large corpus with periodic income",
    xirr: "5.5–6.0%",
  },
  {
    id: "947",
    planNo: 947,
    name: "Jeevan Shiromani",
    shortName: "Jeevan Shiromani",
    category: "endowment",
    type: "participating",
    desc: "Ultra-HNI plan. Min SA ₹1 crore. Limited pay with money back, CIB, and highest bonus rates.",
    minAge: 18, maxAge: 55,
    minTerm: 20, maxTerm: 28,
    minSA: 10000000, maxSA: null, // Min ₹1 Crore
    pptOptions: [{ ppt: 14, term: 20 }, { ppt: 16, term: 24 }, { ppt: 18, term: 28 }],
    ppt: "limited",
    moneybkPayouts: [
      { yearFromStart: "midpoint1", pct: 0.25 },
      { yearFromStart: "midpoint2", pct: 0.25 },
    ],
    maturityFormula: "50% SA + bonuses + FAB",
    gstCategory: "endowment",
    riders: ["ADB", "CI", "TERM"],
    keyFeatures: [
      "Minimum SA ₹1 crore",
      "Critical illness benefit included",
      "Highest premium band — special rebates",
      "Medical teleconferencing services",
    ],
    tags: ["Ultra HNI", "₹1 Cr minimum", "Limited pay"],
    bestFor: "Ultra HNI — maximum cover and returns",
    xirr: "5.8–6.5%",
  },
  {
    id: "717",
    planNo: 717,
    name: "Single Premium Endowment",
    shortName: "Single Prem Endowment",
    category: "endowment",
    type: "participating",
    desc: "Pay premium once and enjoy cover + bonus for entire term. Ideal for lump sum investors.",
    minAge: 0, maxAge: 65,
    minTerm: 10, maxTerm: 25,
    minSA: 50000, maxSA: null,
    ppt: "single",
    moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "singlePrem",
    riders: ["ADB"],
    keyFeatures: [
      "Single one-time premium",
      "Participating — earns bonus every year",
      "Loan available from day 1",
    ],
    tags: ["Single premium", "Endowment", "Lump sum"],
    bestFor: "Lump sum investment with guaranteed returns",
    xirr: "4.8–5.2%",
  },

  // ════════════════════════════════════════════
  // CHILD PLANS
  // ════════════════════════════════════════════
  {
    id: "934",
    planNo: 934,
    name: "Jeevan Tarun",
    shortName: "Jeevan Tarun",
    category: "child",
    type: "participating",
    desc: "Child plan with flexible survival benefit options. Risk cover from age 8. Money back from age 20–24 + maturity at 25.",
    minAge: 0, maxAge: 12, // child's age
    minTerm: 20, maxTerm: 25,
    minSA: 75000, maxSA: null,
    ppt: "term_minus_child_age", // premium till child turns 20
    survivalBenefitOptions: [
      { name: "Option 1 (0% survival)", moneybk: [] },
      { name: "Option 2 (5% SA per yr at 20,21,22,23)", moneybk: [20,21,22,23] },
      { name: "Option 3 (10% SA per yr at 20,21,22,23)", moneybk: [20,21,22,23] },
      { name: "Option 4 (15% SA per yr at 20,21,22,23)", moneybk: [20,21,22,23] },
    ],
    maturityFormula: "SA (adjusted) + bonuses at age 25",
    gstCategory: "endowment",
    riders: ["ADB", "PWB"],
    keyFeatures: [
      "Risk cover from child's age 8",
      "4 survival benefit options for flexibility",
      "Premium Waiver Benefit — cover continues if parent dies",
      "Maturity at child's age 25",
    ],
    tags: ["Child plan", "Education", "Marriage", "Flexible"],
    bestFor: "Child's education and marriage planning",
    xirr: "4.8–5.5%",
  },
  {
    id: "932",
    planNo: 932,
    name: "New Children's Money Back Plan",
    shortName: "Children's Money Back",
    category: "child",
    type: "participating",
    desc: "Child money back plan. 20% SA at ages 18, 20, 22. Remaining 40% SA + bonuses at age 25.",
    minAge: 0, maxAge: 12, // child's age
    minTerm: 25, maxTerm: 25, // fixed term till age 25
    minSA: 100000, maxSA: null,
    ppt: "term_minus_5", // premium till child turns 20
    moneybkPayouts: [
      { childAge: 18, pct: 0.20 },
      { childAge: 20, pct: 0.20 },
      { childAge: 22, pct: 0.20 },
    ],
    maturityFormula: "40% SA + bonuses + FAB at age 25",
    gstCategory: "moneyback",
    riders: ["ADB", "PWB"],
    keyFeatures: [
      "20% SA at age 18, 20, 22 for key milestones",
      "Premium Waiver if parent/proposer dies",
      "Covers child's education and marriage expenses",
    ],
    tags: ["Child plan", "Money back", "Milestone payouts"],
    bestFor: "Child's systematic milestone funding",
    xirr: "4.7–5.2%",
  },

  // ════════════════════════════════════════════
  // TERM PLANS
  // ════════════════════════════════════════════
  {
    id: "954",
    planNo: 954,
    name: "New Tech Term",
    shortName: "Tech Term",
    category: "term",
    type: "non_participating",
    desc: "LIC's cheapest online pure term plan. Highest life cover at lowest cost. No maturity benefit. Available only online.",
    minAge: 18, maxAge: 65,
    minTerm: 10, maxTerm: 40,
    minSA: 5000000, maxSA: null, // min ₹50 lakh
    ppt: "same",
    smokerSurcharge: 0.25, // 25% extra for smokers
    femalePremiumDiscount: 0.075, // 7.5% lower for females
    deathBenefitFormula: "SA (level) or increasing at 10% per year",
    maturityBenefit: null, // no maturity
    gstCategory: "term",
    riders: ["ADB"],
    keyFeatures: [
      "Lowest premium for highest cover",
      "Female policyholders get 7.5% lower premium",
      "Non-smoker rates significantly lower",
      "Two options: Level SA or Increasing SA",
      "Available only online at licindia.in",
    ],
    tags: ["Pure term", "Online only", "Cheapest premium"],
    bestFor: "Maximum life cover at minimum cost",
    xirr: null, // pure protection
  },
  {
    id: "955",
    planNo: 955,
    name: "New Jeevan Amar",
    shortName: "Jeevan Amar",
    category: "term",
    type: "non_participating",
    desc: "Offline pure term plan through agents. Level or increasing SA. Special rates for women. Min SA ₹25 lakh.",
    minAge: 18, maxAge: 65,
    minTerm: 10, maxTerm: 40,
    minSA: 2500000, maxSA: null,
    ppt: "same",
    smokerSurcharge: 0.25,
    femalePremiumDiscount: 0.075,
    deathBenefitOptions: ["level", "increasing"],
    maturityBenefit: null,
    gstCategory: "term",
    riders: ["ADB"],
    keyFeatures: [
      "Offline (agent channel) term plan",
      "Level or Increasing Sum Assured",
      "Special discount for women",
      "Min SA ₹25 lakh",
    ],
    tags: ["Pure term", "Agent channel", "Offline"],
    bestFor: "Pure protection via agent",
    xirr: null,
  },
  {
    id: "875",
    planNo: 875,
    name: "Yuva Term Plan",
    shortName: "Yuva Term",
    category: "term",
    type: "non_participating",
    desc: "Term plan specifically for youth (age 18–45). Lower premiums for young buyers. Online purchase.",
    minAge: 18, maxAge: 45,
    minTerm: 10, maxTerm: 40,
    minSA: 5000000, maxSA: null,
    ppt: "same",
    maturityBenefit: null,
    gstCategory: "term",
    riders: ["ADB"],
    keyFeatures: [
      "Designed specifically for youth below 45",
      "Online purchase with lower premiums",
      "Min SA ₹50 lakh",
    ],
    tags: ["Term", "Youth", "Online"],
    bestFor: "Young professionals needing term cover",
    xirr: null,
  },
  {
    id: "859",
    planNo: 859,
    name: "Saral Jeevan Bima",
    shortName: "Saral Term",
    category: "term",
    type: "non_participating",
    desc: "Simplified, standardized term plan. Easy to buy. SA ₹5 lakh to ₹25 lakh. No medical for low SA.",
    minAge: 18, maxAge: 65,
    minTerm: 5, maxTerm: 40,
    minSA: 500000, maxSA: 2500000,
    ppt: "same",
    maturityBenefit: null,
    gstCategory: "term",
    riders: ["ADB"],
    keyFeatures: [
      "Standardized simple term plan",
      "SA capped at ₹25 lakh",
      "Easy underwriting process",
      "Ideal for small-cover buyers",
    ],
    tags: ["Term", "Simplified", "Affordable"],
    bestFor: "Simple term cover for low-income segment",
    xirr: null,
  },

  // ════════════════════════════════════════════
  // PENSION PLANS
  // ════════════════════════════════════════════
  {
    id: "858",
    planNo: 858,
    name: "New Jeevan Shanti",
    shortName: "Jeevan Shanti",
    category: "pension",
    type: "non_participating",
    desc: "Single premium deferred or immediate annuity. Pay once, get pension for life. Multiple annuity options.",
    minAge: 30, maxAge: 85,
    ppt: "single",
    annuityOptions: [
      "Life annuity",
      "Life annuity with return of purchase price",
      "Joint life annuity",
      "Life annuity guaranteed for 5/10/15/20 yrs",
      "Increasing annuity at 3% per year",
    ],
    minPurchasePrice: 150000,
    gstCategory: "singlePrem",
    riders: [],
    keyFeatures: [
      "Guaranteed pension for life",
      "Multiple annuity options",
      "Joint life option for spouse",
      "Return of purchase price available",
    ],
    tags: ["Pension", "Guaranteed", "Single premium", "Annuity"],
    bestFor: "Retirement — guaranteed lifetime income",
    xirr: null,
  },
  {
    id: "857",
    planNo: 857,
    name: "Jeevan Akshay VII",
    shortName: "Jeevan Akshay",
    category: "pension",
    type: "non_participating",
    desc: "Immediate annuity plan. Multiple annuity options. Pay once, get pension immediately. Best for senior citizens.",
    minAge: 30, maxAge: 85,
    ppt: "single",
    annuityOptions: [
      "Life annuity",
      "Life annuity guaranteed 5/10/15/20 yrs",
      "Life annuity with return of purchase price",
      "Increasing at 3% per yr",
      "Joint life (50% to spouse)",
      "Joint life (100% to spouse)",
    ],
    minPurchasePrice: 100000,
    gstCategory: "singlePrem",
    riders: [],
    keyFeatures: [
      "Highest annuity rates in LIC portfolio",
      "Immediate pension from next month",
      "10 annuity options",
      "Min purchase price ₹1 lakh",
    ],
    tags: ["Immediate pension", "Annuity", "Senior citizens"],
    bestFor: "Immediate pension for retirees/senior citizens",
    xirr: null,
  },
  {
    id: "862",
    planNo: 862,
    name: "Saral Pension",
    shortName: "Saral Pension",
    category: "pension",
    type: "non_participating",
    desc: "Simplified standardized immediate annuity plan. Two basic options. Easy to understand and buy.",
    minAge: 40, maxAge: 80,
    ppt: "single",
    annuityOptions: [
      "Life annuity with return of purchase price",
      "Joint life annuity with return of purchase price",
    ],
    minPurchasePrice: 100000,
    gstCategory: "singlePrem",
    riders: [],
    keyFeatures: [
      "Simple — only 2 options",
      "Surrender allowed after 3 months",
      "Return of purchase price on death",
    ],
    tags: ["Pension", "Simplified", "Annuity"],
    bestFor: "Simple guaranteed pension without complexity",
    xirr: null,
  },

  // ════════════════════════════════════════════
  // ULIP PLANS
  // ════════════════════════════════════════════
  {
    id: "873",
    planNo: 873,
    name: "Index Plus",
    shortName: "Index Plus",
    category: "ulip",
    type: "ulip",
    desc: "Market-linked ULIP tracking Nifty 50 index. Launched ~2024. Higher risk, higher potential returns. Min premium ₹30K/yr.",
    minAge: 0, maxAge: 60,
    minTerm: 10, maxTerm: 25,
    minPremium: 30000,
    ppt: "same",
    fundOptions: ["Index Fund (Nifty 50)"],
    fundManagementCharge: 0.01, // 1% per annum
    lockIn: 5,
    returnOfMortalityCharges: true,
    maturityFormula: "Fund value + RoMC",
    gstCategory: "ulip",
    riders: ["LADB"],
    keyFeatures: [
      "Tracks Nifty 50 — market-linked returns",
      "Return of mortality charges at maturity",
      "Partial withdrawal after 5-year lock-in",
      "Min premium ₹30,000/year",
    ],
    tags: ["ULIP", "Nifty linked", "Market returns"],
    bestFor: "Market-linked growth with insurance",
    xirr: "Varies with market (8–12% historical)",
  },
  {
    id: "749",
    planNo: 749,
    name: "Nivesh Plus",
    shortName: "Nivesh Plus",
    category: "ulip",
    type: "ulip",
    desc: "Single premium ULIP. Pay once and invest in market-linked funds. Min ₹1 lakh single premium.",
    minAge: 90, maxAge: 70, // days to years
    minTerm: 10, maxTerm: 25,
    ppt: "single",
    fundOptions: ["Bond Fund", "Secured Fund", "Balanced Fund", "Growth Fund"],
    fundManagementCharge: 0.0135,
    lockIn: 5,
    maturityFormula: "Fund value",
    gstCategory: "ulip",
    riders: ["LADB"],
    keyFeatures: [
      "Single premium — invest once",
      "4 fund options from debt to equity",
      "12 free fund switches per year",
      "Partial withdrawal after lock-in",
    ],
    tags: ["ULIP", "Single premium", "Market returns"],
    bestFor: "Lump sum market investment + insurance",
    xirr: "Varies with market",
  },
  {
    id: "752",
    planNo: 752,
    name: "SIIP",
    shortName: "SIIP",
    category: "ulip",
    type: "ulip",
    desc: "Systematic Investment Insurance Plan. Regular premium ULIP. Min ₹4,000/month. 4 fund options.",
    minAge: 0, maxAge: 65,
    minTerm: 10, maxTerm: 25,
    minPremium: 48000, // ₹4000/month annual equiv
    ppt: "same",
    fundOptions: ["Bond Fund", "Secured Fund", "Balanced Fund", "Growth Fund"],
    fundManagementCharge: 0.0125,
    guaranteedAdditions: [4, 7, 10, 13, 16], // years for GA
    lockIn: 5,
    returnOfMortalityCharges: true,
    maturityFormula: "Fund value + RoMC + GAs",
    gstCategory: "ulip",
    riders: ["LADB"],
    keyFeatures: [
      "Guaranteed additions at years 4, 7, 10, 13, 16",
      "Return of mortality charges at maturity",
      "4 fund options",
      "Min ₹4,000/month",
    ],
    tags: ["ULIP", "Regular premium", "Guaranteed additions"],
    bestFor: "SIP-style market investment with insurance",
    xirr: "Varies with market",
  },
];

// ─────────────────────────────────────────────
// CALCULATION FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Get nearest tabular rate for a plan/age/term combination
 */
export function getTabularRate(planNo, age, term) {
  const tbl = TABULAR_RATES[planNo];
  if (!tbl) return 50;
  const ages = Object.keys(tbl).map(Number).sort((a, b) => a - b);
  const nearAge = ages.reduce((p, c) =>
    Math.abs(c - age) < Math.abs(p - age) ? c : p, ages[0]);
  const termMap = tbl[nearAge] || {};
  const terms = Object.keys(termMap).map(Number).sort((a, b) => a - b);
  if (!terms.length) return 50;
  const nearTerm = terms.reduce((p, c) =>
    Math.abs(c - term) < Math.abs(p - term) ? c : p, terms[0]);
  return termMap[nearTerm] || 50;
}

/**
 * Calculate PPT (premium paying term) for a plan
 */
export function getPPT(plan, term, age) {
  if (plan.ppt === "same") return term;
  if (plan.ppt === "single") return 1;
  if (plan.ppt === "term_minus_3") return term - 3;
  if (plan.ppt === "term_minus_5") return term - 5;
  if (plan.ppt === "limited" && plan.pptOptions) {
    // For Jeevan Labh — map term to PPT
    if (Array.isArray(plan.pptOptions) && plan.pptOptions[0]?.ppt) {
      const match = plan.pptOptions.find(o => o.term === term);
      if (match) return match.ppt;
      return plan.pptOptions[0].ppt;
    }
    // For Jeevan Umang — PPT is user-selected
    return 15; // default
  }
  return term;
}

/**
 * Master premium calculation function
 * Returns full premium breakdown
 */
export function calculatePremium({ planNo, sa, age, term, ppt, mode = "yearly", smoker = false, gender = "male" }) {
  const plan = PLANS.find(p => p.planNo === planNo);
  if (!plan) return null;

  const rate = getTabularRate(planNo, age, term);
  let basePremium = (rate * sa) / 1000;

  // Smoker surcharge (term plans)
  if (smoker && plan.category === "term") basePremium *= 1.25;

  // Female discount (term plans)
  if (gender === "female" && plan.category === "term") basePremium *= 0.925;

  const modeRebatePct = MODE_REBATE[mode] || 0;
  const modeRebateAmt = basePremium * modeRebatePct;

  const saRebatePer1000 = SA_REBATE(sa);
  const saRebateAmt = (saRebatePer1000 * sa) / 1000;

  const netPremium = basePremium - modeRebateAmt - saRebateAmt;

  const gstRules = GST_RULES[plan.gstCategory] || GST_RULES.endowment;
  const gst1 = netPremium * gstRules.year1;
  const gst2 = netPremium * (gstRules.year2plus || 0);

  const yearlyPremYear1 = Math.round(netPremium + gst1);
  const yearlyPremYear2 = Math.round(netPremium + gst2);

  const modeDiv = { yearly: 1, halfyearly: 2, quarterly: 4, monthly: 12 }[mode] || 1;
  const instalment1 = Math.round(yearlyPremYear1 / modeDiv);
  const instalment2 = Math.round(yearlyPremYear2 / modeDiv);

  const totalPaid = yearlyPremYear1 + yearlyPremYear2 * (ppt - 1);

  return {
    basePremium: Math.round(basePremium),
    modeRebate: Math.round(modeRebateAmt),
    saRebate: Math.round(saRebateAmt),
    netPremium: Math.round(netPremium),
    gstYear1: Math.round(gst1),
    gstYear2: Math.round(gst2),
    yearlyYear1: yearlyPremYear1,
    yearlyYear2plus: yearlyPremYear2,
    instalment1,
    instalment2,
    totalPaid: Math.round(totalPaid),
    modeRebatePct: modeRebatePct * 100,
    saRebatePer1000,
    gstPctYear1: gstRules.year1 * 100,
    gstPctYear2: (gstRules.year2plus || 0) * 100,
  };
}

/**
 * Calculate maturity and returns
 */
export function calculateMaturity({ planNo, sa, term }) {
  const bonusData = BONUS_RATES_2026[planNo];
  if (!bonusData) return { maturity: sa, totalBonus: 0, fab: 0 };

  let totalBonus = 0;
  let fab = 0;

  if (bonusData.srb) {
    totalBonus = (bonusData.srb * sa / 1000) * term;
    fab = bonusData.fab ? (bonusData.fab * sa / 1000) : 0;
  } else if (bonusData.ga) {
    // Non-par plans — guaranteed additions
    totalBonus = (bonusData.ga * sa / 1000) * term;
  }

  const maturity = sa + totalBonus + fab;
  return {
    maturity: Math.round(maturity),
    totalBonus: Math.round(totalBonus),
    fab: Math.round(fab),
  };
}

/**
 * Calculate XIRR (approximate IRR)
 */
export function calculateXIRR(totalPaid, maturity, term) {
  if (!maturity || maturity <= totalPaid) return 0;
  return ((Math.pow(maturity / totalPaid, 1 / term) - 1) * 100).toFixed(2);
}

/**
 * Calculate year-by-year benefit table
 */
export function generateBenefitTable({ planNo, sa, age, term, ppt, premResult = undefined, yearlyPremYear1 = undefined, yearlyPremYear2 = undefined }) {
  // Accept either a premResult object (from calculatePremium) or individual values
  const prem1 = yearlyPremYear1 ?? premResult?.yearlyYear1 ?? 0;
  const prem2 = yearlyPremYear2 ?? premResult?.yearlyYear2plus ?? prem1;

  const plan = PLANS.find(p => p.planNo === planNo);
  const bonusData = BONUS_RATES_2026[planNo];
  const rows = [];

  let cumPrem = 0;
  let cumBonus = 0;
  const annualBonus = bonusData?.srb ? (bonusData.srb * sa / 1000) : bonusData?.ga ? (bonusData.ga * sa / 1000) : 0;

  for (let y = 1; y <= term; y++) {
    cumPrem += y === 1 ? prem1 : (y <= ppt ? prem2 : 0);
    if (y <= term) cumBonus += annualBonus;

    const fab = bonusData?.fab ? (bonusData.fab * sa / 1000) : 0;

    // Death benefit
    let deathBenefit = sa + cumBonus;
    if (plan?.deathBenefitFormula?.includes("125%")) {
      deathBenefit = Math.max(sa * 1.25, 10 * prem2) + cumBonus;
    }

    // Survival / money back payout
    let survivalPayout = null;
    if (plan?.moneybkPayouts) {
      const mb = plan.moneybkPayouts.find(m => m.year === y);
      if (mb) survivalPayout = mb.pct * sa;
    }

    // Maturity
    let maturityPayout = null;
    if (y === term && plan?.category !== "term") {
      const matPct = plan.maturityPct || 1.0;
      maturityPayout = (matPct * sa) + cumBonus + fab;
    }

    // GSV (Guaranteed Surrender Value)
    let gsv = 0;
    if (y >= 3) {
      const gsvPct = y <= 3 ? 0.30 : y <= 5 ? 0.50 : y <= 7 ? 0.55 : y <= 9 ? 0.60 : y <= 11 ? 0.65 : y <= 13 ? 0.70 : y <= 15 ? 0.80 : 0.90;
      gsv = Math.round(cumPrem * gsvPct);
    }

    rows.push({
      year: y,
      age: age + y,
      premiumPaid: Math.round(y <= ppt ? (y === 1 ? prem1 : prem2) : 0),
      cumPremiumPaid: Math.round(cumPrem),
      sumAssured: sa,
      annualBonus: Math.round(annualBonus),
      cumBonus: Math.round(cumBonus),
      deathBenefit: Math.round(deathBenefit),
      survivalPayout: survivalPayout ? Math.round(survivalPayout) : null,
      maturityPayout: maturityPayout ? Math.round(maturityPayout) : null,
      gsv,
    });
  }

  return rows;
}

// ─────────────────────────────────────────────
// PLAN ADVISER
// Suggest plans based on age, goal, budget
// ─────────────────────────────────────────────
export function advisePlans({ age, goal, budget, hasDependents }) {
  const suggestions = [];

  if (goal === "protection" || hasDependents) {
    suggestions.push(...PLANS.filter(p => p.category === "term").slice(0, 2));
  }
  if (goal === "savings" && age < 45) {
    suggestions.push(...PLANS.filter(p => ["endowment", "moneyback"].includes(p.category)).slice(0, 3));
  }
  if (goal === "child" && age < 45) {
    suggestions.push(...PLANS.filter(p => p.category === "child"));
  }
  if (goal === "retirement" || age > 45) {
    suggestions.push(...PLANS.filter(p => p.category === "pension").slice(0, 2));
    if (age < 55) suggestions.push(PLANS.find(p => p.planNo === 945)); // Jeevan Umang
  }
  if (goal === "investment" && budget > 50000) {
    suggestions.push(...PLANS.filter(p => p.category === "ulip").slice(0, 2));
  }

  return [...new Set(suggestions)].filter(Boolean);
}

export default PLANS;
