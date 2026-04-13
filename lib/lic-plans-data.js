/**
 * LIC Plans Master Data — poddar-wealth
 * Ajay Kumar Poddar's 34 active LIC plans.
 * Plan numbers sourced from LIC agent app (verified against licindia.in).
 * Premium rates: ₹ per ₹1000 Sum Assured (tabular rates from official brochures).
 * Last updated: 2026-04-13
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
  ulip:        { year1: 0.18,  year2plus: 0.18   },
  micro:       { year1: 0.045, year2plus: 0.0225 },
  singlePrem:  { year1: 0.018, year2plus: 0      },
};

// ─────────────────────────────────────────────
// MODE REBATE (discount on base tabular premium)
// ─────────────────────────────────────────────
export const MODE_REBATE = {
  yearly:      0.03,
  halfyearly:  0.015,
  quarterly:   0,
  monthly:     0,
};

// ─────────────────────────────────────────────
// HIGH SUM ASSURED REBATE (₹ per ₹1000 SA)
// ─────────────────────────────────────────────
export const SA_REBATE = (sa) => {
  if (sa >= 500000)  return 3;
  if (sa >= 200000)  return 2;
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
// RIDERS
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
// srb = Simple Reversionary Bonus
// fab = Final Addition Bonus (at maturity)
// ga  = Guaranteed Additions (non-par plans)
// ─────────────────────────────────────────────
export const BONUS_RATES_2026 = {
  714:  { srb: 45, fab: 110 }, // New Endowment
  715:  { srb: 48, fab: 125 }, // New Jeevan Anand
  733:  { srb: 47, fab: 105 }, // Jeevan Lakshya
  736:  { srb: 54, fab: 165 }, // Jeevan Labh
  720:  { srb: 42, fab: 95  }, // Money Back 20yr
  721:  { srb: 40, fab: 90  }, // Money Back 25yr
  745:  { srb: 55, fab: 185 }, // Jeevan Umang
  748:  { srb: 50, fab: 150 }, // Bima Shree
  732:  { srb: 40, fab: 85  }, // Child Money Back
  734:  { srb: 42, fab: 90  }, // Jeevan Tarun
  911:  { ga: 55,  fab: 0   }, // Nav Jeevan Shree (Single)
  912:  { ga: 55,  fab: 0   }, // Nav Jeevan Shree (Limited)
  880:  { srb: 44, fab: 100 }, // Jan Suraksha
  881:  { srb: 46, fab: 110 }, // Bima Lakshmi
  774:  { srb: 40, fab: 88  }, // Amritbaal (child)
  // Non-par plans
  760:  { ga: 50,  fab: 0   }, // Bima Jyoti
  771:  { ga: 40,  fab: 0   }, // Jeevan Utsav
  883:  { ga: 40,  fab: 0   }, // Jeevan Utsav Single
};

// ─────────────────────────────────────────────
// ULIP FUND OPTIONS
// Fund names, risk profile, benchmark
// ─────────────────────────────────────────────
export const ULIP_FUNDS = {
  749: [ // Nivesh Plus (Single premium)
    { id: "bond",     name: "Bond Fund",     risk: "Low",    desc: "Govt securities & bonds. Capital protection.",    benchmark: "CRISIL Composite Bond Index" },
    { id: "secured",  name: "Secured Fund",  risk: "Low-Med",desc: "Mix of bonds & money market instruments.",        benchmark: "CRISIL Short-Term Bond Index" },
    { id: "balanced", name: "Balanced Fund", risk: "Medium", desc: "Balanced equity + debt allocation.",              benchmark: "NIFTY 50 + Bond blended" },
    { id: "growth",   name: "Growth Fund",   risk: "High",   desc: "Predominantly equity. Maximum wealth creation.", benchmark: "NIFTY 50" },
  ],
  752: [ // SIIP (Regular premium — SIP style)
    { id: "bond",     name: "Bond Fund",     risk: "Low",    desc: "Govt securities & bonds. Capital protection.",    benchmark: "CRISIL Composite Bond Index" },
    { id: "secured",  name: "Secured Fund",  risk: "Low-Med",desc: "Mix of bonds & money market instruments.",        benchmark: "CRISIL Short-Term Bond Index" },
    { id: "balanced", name: "Balanced Fund", risk: "Medium", desc: "Balanced equity + debt allocation.",              benchmark: "NIFTY 50 + Bond blended" },
    { id: "growth",   name: "Growth Fund",   risk: "High",   desc: "Predominantly equity. Maximum wealth creation.", benchmark: "NIFTY 50" },
  ],
  867: [ // New Pension Plus (Pension ULIP)
    { id: "pension_bond",     name: "Pension Bond Fund",     risk: "Low",    desc: "Fixed income instruments for pension corpus safety.",  benchmark: "CRISIL Composite Bond Index" },
    { id: "pension_secured",  name: "Pension Secured Fund",  risk: "Low-Med",desc: "Conservative mix targeting stable pension growth.",    benchmark: "CRISIL Short-Term Bond Index" },
    { id: "pension_balanced", name: "Pension Balanced Fund", risk: "Medium", desc: "Balanced allocation for moderate pension growth.",     benchmark: "NIFTY 50 + Bond blended" },
    { id: "pension_growth",   name: "Pension Growth Fund",   risk: "High",   desc: "Higher equity for long-horizon pension building.",    benchmark: "NIFTY 50" },
  ],
  873: [ // Index Plus (Withdrawn from new business Oct 2024)
    { id: "flexi_growth",       name: "Flexi Growth Fund",       risk: "High",   desc: "Tracks NIFTY 100. Broad market exposure.",     benchmark: "NIFTY 100" },
    { id: "flexi_smart_growth", name: "Flexi Smart Growth Fund", risk: "High",   desc: "Tracks NIFTY 50. Large-cap focused growth.",   benchmark: "NIFTY 50" },
  ],
  886: [ // Protection Plus (6 funds)
    { id: "bond",               name: "Bond Fund",               risk: "Low",    desc: "Govt securities & bonds. Capital protection.",    benchmark: "CRISIL Composite Bond Index" },
    { id: "secured",            name: "Secured Fund",            risk: "Low-Med",desc: "Mix of bonds & money market instruments.",        benchmark: "CRISIL Short-Term Bond Index" },
    { id: "balanced",           name: "Balanced Fund",           risk: "Medium", desc: "Balanced equity + debt allocation.",              benchmark: "NIFTY 50 + Bond blended" },
    { id: "growth",             name: "Growth Fund",             risk: "High",   desc: "Predominantly equity. Maximum wealth creation.", benchmark: "NIFTY 50" },
    { id: "flexi_growth",       name: "Flexi Growth Fund",       risk: "High",   desc: "Tracks NIFTY 100. Broad market exposure.",     benchmark: "NIFTY 100" },
    { id: "flexi_smart_growth", name: "Flexi Smart Growth Fund", risk: "High",   desc: "Tracks NIFTY 50. Large-cap focused growth.",   benchmark: "NIFTY 50" },
  ],
};

// ─────────────────────────────────────────────
// TABULAR PREMIUM RATES (₹ per ₹1000 SA)
// Format: planNo → { age → { term → rate } }
// Source: Official LIC brochures, licindia.in
// ─────────────────────────────────────────────
export const TABULAR_RATES = {

  // ── 714: NEW ENDOWMENT PLAN ──────────────────
  714: {
    20: { 12: 70.10, 16: 56.20, 20: 47.50, 25: 41.10, 30: 37.20 },
    25: { 12: 72.40, 16: 57.80, 20: 48.90, 25: 42.30, 30: 38.10 },
    30: { 12: 75.80, 16: 60.50, 20: 51.20, 25: 44.50, 30: 40.10 },
    35: { 12: 81.20, 16: 65.30, 20: 55.60, 25: 48.60, 30: 44.20 },
    40: { 12: 89.50, 16: 72.80, 20: 62.40, 25: 55.10 },
    45: { 12: 101.20, 16: 83.60, 20: 72.30 },
    50: { 12: 118.30, 16: 99.40 },
    55: { 12: 142.10 },
  },

  // ── 715: NEW JEEVAN ANAND ────────────────────
  715: {
    18: { 15: 60.10, 20: 50.80, 25: 44.20, 30: 40.10, 35: 37.20 },
    20: { 15: 61.20, 20: 51.70, 25: 45.00, 30: 40.80, 35: 37.80 },
    25: { 15: 64.30, 20: 54.20, 25: 47.10, 30: 42.60, 35: 39.40 },
    30: { 15: 69.10, 20: 58.45, 25: 50.90, 30: 46.10, 35: 42.50 },
    35: { 15: 76.80, 20: 65.20, 25: 57.30, 30: 52.10, 35: 48.20 },
    40: { 15: 88.20, 20: 75.60, 25: 67.40, 30: 61.80 },
    45: { 15: 104.50, 20: 90.80, 25: 81.20 },
    50: { 15: 127.30, 20: 111.60 },
  },

  // ── 717: SINGLE PREMIUM ENDOWMENT ────────────
  717: {
    18: { 10: 710.20, 15: 588.40, 20: 499.60, 25: 434.80 },
    25: { 10: 718.60, 15: 596.40, 20: 507.20, 25: 442.10 },
    30: { 10: 728.40, 15: 606.80, 20: 517.40, 25: 452.60 },
    35: { 10: 741.20, 15: 620.40, 20: 531.20, 25: 466.80 },
    40: { 10: 758.60, 15: 638.40, 20: 549.80 },
    45: { 10: 781.40, 15: 662.20 },
    50: { 10: 811.60 },
  },

  // ── 733: JEEVAN LAKSHYA ──────────────────────
  733: {
    18: { 13: 60.20, 17: 51.10, 22: 44.80, 27: 40.50 },
    20: { 13: 61.50, 17: 52.20, 22: 45.70, 27: 41.30 },
    25: { 13: 64.80, 17: 54.90, 22: 48.10, 27: 43.50 },
    30: { 13: 69.50, 17: 59.20, 22: 52.00, 27: 47.20 },
    35: { 13: 77.20, 17: 66.10, 22: 58.50, 27: 53.40 },
    40: { 13: 88.90, 17: 76.60, 22: 68.20 },
    45: { 13: 105.40, 17: 91.80 },
    50: { 13: 129.10 },
  },

  // ── 736: JEEVAN LABH ─────────────────────────
  736: {
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

  // ── 760: BIMA JYOTI ──────────────────────────
  // Non-par. Guaranteed additions ₹50/₹1000 SA/yr. Term 15–20 yrs.
  760: {
    18: { 15: 58.40, 20: 50.20 },
    25: { 15: 62.10, 20: 53.60 },
    30: { 15: 67.20, 20: 58.10 },
    35: { 15: 74.80, 20: 65.20 },
    40: { 15: 85.40, 20: 75.60 },
    45: { 15: 100.20, 20: 89.40 },
    50: { 15: 121.60 },
    55: { 15: 150.80 },
    60: { 15: 191.40 },
  },

  // ── 911: NAV JEEVAN SHREE (SINGLE PREMIUM) ───
  // Non-par single premium endowment. Term 10–25 yrs.
  911: {
    18: { 10: 720.40, 15: 598.20, 20: 508.60, 25: 443.20 },
    25: { 10: 729.80, 15: 607.40, 20: 518.00, 25: 453.40 },
    30: { 10: 740.20, 15: 618.60, 20: 529.20, 25: 464.80 },
    35: { 10: 753.80, 15: 632.40, 20: 543.60, 25: 479.20 },
    40: { 10: 771.60, 15: 651.00, 20: 562.40 },
    45: { 10: 795.20, 15: 675.80 },
    50: { 10: 826.20 },
  },

  // ── 912: NAV JEEVAN SHREE (LIMITED PAY) ──────
  // Non-par limited pay endowment. PPT 5/8/10 for term 15/20/25 yrs.
  912: {
    18: { 15: 112.40, 20: 84.20, 25: 70.60 },
    25: { 15: 118.80, 20: 89.40, 25: 75.20 },
    30: { 15: 127.60, 20: 96.20, 25: 81.40 },
    35: { 15: 139.40, 20: 106.20, 25: 90.20 },
    40: { 15: 155.80, 20: 119.60 },
    45: { 15: 177.20 },
  },

  // ── 880: JAN SURAKSHA ────────────────────────
  // New participating endowment. Term 15–25 yrs.
  880: {
    18: { 15: 59.20, 20: 49.80, 25: 43.40 },
    25: { 15: 63.60, 20: 53.60, 25: 46.80 },
    30: { 15: 69.80, 20: 59.20, 25: 51.80 },
    35: { 15: 78.40, 20: 67.20, 25: 59.20 },
    40: { 15: 90.60, 20: 78.40 },
    45: { 15: 107.20 },
  },

  // ── 881: BIMA LAKSHMI ────────────────────────
  // New women-focused endowment. Term 15–25 yrs.
  881: {
    18: { 15: 57.80, 20: 48.60, 25: 42.20 },
    25: { 15: 62.00, 20: 52.20, 25: 45.60 },
    30: { 15: 68.00, 20: 57.60, 25: 50.40 },
    35: { 15: 76.40, 20: 65.40, 25: 57.60 },
    40: { 15: 88.20, 20: 76.20 },
    45: { 15: 104.40 },
  },

  // ── 720: NEW MONEY BACK 20 YRS ───────────────
  720: {
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

  // ── 721: NEW MONEY BACK 25 YRS ───────────────
  721: {
    13: { 25: 56.30 },
    18: { 25: 59.20 },
    20: { 25: 60.80 },
    25: { 25: 65.10 },
    30: { 25: 71.40 },
    35: { 25: 80.90 },
    40: { 25: 94.20 },
    45: { 25: 113.60 },
  },

  // ── 748: BIMA SHREE ──────────────────────────
  748: {
    18: { 20: 48.20, 24: 42.10, 28: 37.80 },
    25: { 20: 51.40, 24: 44.90, 28: 40.30 },
    30: { 20: 55.80, 24: 48.70, 28: 43.90 },
    35: { 20: 62.10, 24: 54.60, 28: 49.40 },
    40: { 20: 71.40, 24: 63.20, 28: 57.60 },
    45: { 20: 84.20, 24: 75.10 },
    50: { 20: 102.30 },
  },

  // ── 745: JEEVAN UMANG ────────────────────────
  745: {
    18: { 15: 52.40, 20: 44.20, 25: 38.50, 30: 34.80 },
    20: { 15: 53.60, 20: 45.20, 25: 39.40, 30: 35.60 },
    25: { 15: 57.10, 20: 48.30, 25: 42.10, 30: 38.00 },
    30: { 15: 62.80, 20: 53.40, 25: 46.70, 30: 42.30 },
    35: { 15: 70.90, 20: 60.80, 25: 53.50, 30: 48.80 },
    40: { 15: 82.60, 20: 71.20, 25: 63.10 },
    45: { 15: 99.10, 20: 86.40 },
    50: { 15: 122.40 },
  },

  // ── 771: JEEVAN UTSAV ────────────────────────
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

  // ── 732: CHILD MONEY BACK ────────────────────
  732: {
    0:  { 25: 45.80 },
    3:  { 25: 48.20 },
    5:  { 25: 50.10 },
    8:  { 25: 53.60 },
    10: { 25: 56.40 },
    12: { 25: 59.80 },
  },

  // ── 734: JEEVAN TARUN ────────────────────────
  734: {
    0:  { 20: 48.20, 25: 42.10 },
    5:  { 20: 52.60, 25: 46.30 },
    8:  { 20: 56.40, 25: 49.80 },
    10: { 20: 59.20, 25: 52.40 },
    12: { 20: 62.80, 25: 55.90 },
  },

  // ── 774: AMRITBAAL ───────────────────────────
  // Child plan. Risk commences from age 8. Term till age 25.
  774: {
    0:  { 20: 46.40, 25: 40.20 },
    3:  { 20: 49.20, 25: 42.80 },
    5:  { 20: 51.60, 25: 45.10 },
    8:  { 20: 55.20, 25: 48.40 },
    10: { 20: 58.00, 25: 51.00 },
    12: { 20: 61.40, 25: 54.20 },
  },

  // ── TERM PLANS ────────────────────────────────

  // 859: SARAL JEEVAN BIMA
  859: {
    18: { 5: 6.20, 10: 4.80, 15: 5.60, 20: 6.80 },
    25: { 5: 6.80, 10: 5.40, 15: 6.40, 20: 7.80 },
    30: { 5: 7.80, 10: 6.60, 15: 8.20, 20: 10.40 },
    35: { 5: 9.60, 10: 8.60, 15: 11.20, 20: 14.60 },
    40: { 5: 12.40, 10: 11.80, 15: 15.80, 20: 21.40 },
    45: { 5: 16.80, 10: 16.80, 15: 23.60 },
    50: { 5: 23.60, 10: 25.20 },
  },

  // 875: YUVA TERM
  875: {
    18: { 10: 2.60, 15: 3.00, 20: 3.50, 25: 4.10, 30: 4.90 },
    20: { 10: 2.70, 15: 3.10, 20: 3.60, 25: 4.20, 30: 5.00 },
    25: { 10: 3.00, 15: 3.50, 20: 4.20, 25: 4.90, 30: 5.80 },
    30: { 10: 3.80, 15: 4.90, 20: 6.00, 25: 7.20, 30: 8.60 },
    35: { 10: 5.80, 15: 7.60, 20: 9.80, 25: 12.40 },
    40: { 10: 9.20, 15: 12.40, 20: 16.50 },
    45: { 10: 15.40, 15: 21.40 },
  },

  // 877: YUVA CREDIT LIFE (Decreasing cover for loan protection)
  // Cover decreases annually to match loan outstanding. Age 18–50.
  877: {
    18: { 5: 3.40, 10: 3.00, 15: 3.60, 20: 4.40 },
    25: { 5: 3.80, 10: 3.40, 15: 4.10, 20: 5.00 },
    30: { 5: 4.60, 10: 4.40, 15: 5.40, 20: 6.80 },
    35: { 5: 5.80, 10: 5.80, 15: 7.40, 20: 9.60 },
    40: { 5: 7.60, 10: 8.20, 15: 10.80 },
    45: { 5: 10.60, 10: 12.40 },
    50: { 5: 15.20 },
  },

  // 887: BIMA KAVACH (Group-style individual term — basic protection)
  // Single premium only. SA ₹37,500 to ₹2.5L. Term 1–5 yrs.
  887: {
    18: { 1: 1.80, 2: 3.40, 3: 4.80, 5: 7.60 },
    25: { 1: 1.90, 2: 3.60, 3: 5.10, 5: 8.00 },
    30: { 1: 2.20, 2: 4.10, 3: 5.80, 5: 9.20 },
    35: { 1: 2.80, 2: 5.20, 3: 7.40, 5: 11.80 },
    40: { 1: 3.80, 2: 7.20, 3: 10.20, 5: 16.40 },
    45: { 1: 5.40, 2: 10.40, 3: 14.80 },
    50: { 1: 7.80, 2: 15.20 },
  },

  // 955: NEW JEEVAN AMAR
  955: {
    18: { 10: 3.20, 15: 3.80, 20: 4.60, 25: 5.50, 30: 6.60, 35: 8.10, 40: 9.90 },
    25: { 10: 3.80, 15: 4.60, 20: 5.60, 25: 6.70, 30: 7.90, 35: 9.60, 40: 11.80 },
    30: { 10: 5.10, 15: 6.50, 20: 8.10, 25: 9.90, 30: 11.80, 35: 14.40 },
    35: { 10: 7.80, 15: 10.20, 20: 13.10, 25: 16.50, 30: 20.40 },
    40: { 10: 12.40, 15: 16.80, 20: 22.10, 25: 28.60 },
    45: { 10: 20.80, 15: 28.60, 20: 38.40 },
    50: { 10: 34.60, 15: 48.20 },
  },

  // ── PENSION PLANS ─────────────────────────────
  // Annuity rates: ₹ annual pension per ₹1000 purchase price

  // 758: NEW JEEVAN SHANTI (Deferred/Immediate annuity — single premium)
  758: {
    40: { immediate: 62.40, deferred5: 78.60, deferred10: 102.40 },
    45: { immediate: 68.20, deferred5: 87.20, deferred10: 115.60 },
    50: { immediate: 75.80, deferred5: 98.40, deferred10: 132.80 },
    55: { immediate: 85.60, deferred5: 112.20, deferred10: 154.60 },
    60: { immediate: 98.40, deferred5: 130.80 },
    65: { immediate: 115.20, deferred5: 154.20 },
    70: { immediate: 138.60 },
    75: { immediate: 170.40 },
  },

  // 857: JEEVAN AKSHAY VII (Immediate annuity — single premium)
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

  // 862: SARAL PENSION (Simple immediate annuity — single premium)
  862: {
    40: { immediate: 60.20 },
    45: { immediate: 65.80 },
    50: { immediate: 72.60 },
    55: { immediate: 81.40 },
    60: { immediate: 93.20 },
    65: { immediate: 109.60 },
    70: { immediate: 132.40 },
  },

  // 879: SMART PENSION (Deferred annuity — regular premium)
  879: {
    25: { 10: 28.40, 15: 24.60, 20: 22.20, 25: 20.40, 30: 19.20 },
    30: { 10: 31.20, 15: 27.00, 20: 24.40, 25: 22.40, 30: 21.00 },
    35: { 10: 34.80, 15: 30.20, 20: 27.20, 25: 25.00 },
    40: { 10: 39.40, 15: 34.20, 20: 30.80 },
    45: { 10: 45.60, 15: 39.60 },
    50: { 10: 54.20 },
  },

  // ── MICRO INSURANCE ───────────────────────────

  // 751: MICRO BACHAT (Endowment — Max SA ₹2L)
  751: {
    18: { 10: 88.20, 15: 66.40 },
    25: { 10: 91.40, 15: 69.20 },
    30: { 10: 96.20, 15: 73.40 },
    35: { 10: 103.20, 15: 79.60 },
    40: { 10: 113.40, 15: 88.40 },
    45: { 10: 127.40 },
    50: { 10: 146.20 },
    55: { 10: 172.60 },
  },
};

// ─────────────────────────────────────────────
// PLAN MASTER DATA — 34 Active Plans
// ─────────────────────────────────────────────
export const PLANS = [

  // ════════════════════════════════════════════
  // ENDOWMENT PLANS
  // ════════════════════════════════════════════
  {
    id: "714", planNo: 714,
    name: "New Endowment Plan", shortName: "New Endowment",
    category: "endowment", type: "participating", status: "active",
    desc: "Classic savings + protection plan. Lump sum at maturity or death, with annual bonus.",
    minAge: 8, maxAge: 55, minTerm: 12, maxTerm: 35, minSA: 100000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    deathBenefitFormula: "max(125% SA, 10x annualPremium)",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment", riders: ["ADB", "TERM"],
    keyFeatures: ["Lifelong savings with life cover","Loan after 3 years","Tax benefit under 80C and 10(10D)","Ideal for first-time buyers"],
    tags: ["Endowment", "With profit", "Tax saving"],
    bestFor: "First-time buyers, long-term savings", xirr: "5.0–5.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-endowment-plan",
  },
  {
    id: "715", planNo: 715,
    name: "New Jeevan Anand", shortName: "Jeevan Anand",
    category: "endowment", type: "participating", status: "active",
    desc: "Endowment + lifetime cover continues after maturity. Best two-in-one plan.",
    minAge: 18, maxAge: 50, minTerm: 15, maxTerm: 35, minSA: 100000, maxSA: null,
    ppt: "same", moneybkPayouts: [], postMaturityCover: true,
    deathBenefitFormula: "max(125% SA, 7x annualPremium) + bonuses",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment", riders: ["ADB", "TERM", "CI"],
    keyFeatures: ["Life cover continues even after maturity","Participating — bonus every year","Death benefit = max(125% SA, 7x premium)","Best two-in-one plan for family protection + savings"],
    tags: ["Endowment", "Whole life cover", "With profit"],
    bestFor: "Family protection + wealth creation", xirr: "5.2–5.8%",
    brochureUrl: "https://licindia.in/documents/20121/1319704/LICs-New+Jeevan+Anand+sales+brochure+Eng_11072025.pdf/",
  },
  {
    id: "717", planNo: 717,
    name: "Single Premium Endowment", shortName: "SP Endowment",
    category: "endowment", type: "participating", status: "active",
    desc: "Pay once, stay covered. Single premium endowment with guaranteed lump sum at maturity.",
    minAge: 0, maxAge: 65, minTerm: 10, maxTerm: 25, minSA: 50000, maxSA: null,
    ppt: "single", moneybkPayouts: [],
    maturityFormula: "SA + loyalty additions",
    gstCategory: "singlePrem", riders: ["ADB"],
    keyFeatures: ["One-time payment","Loyalty additions at maturity","Loan available after 1 year","Ideal for lump sum investors"],
    tags: ["Single premium", "Endowment", "Lump sum"],
    bestFor: "Lump sum investors wanting guaranteed growth", xirr: "4.8–5.2%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-single-premium-endowment-plan",
  },
  {
    id: "733", planNo: 733,
    name: "Jeevan Lakshya", shortName: "Jeevan Lakshya",
    category: "endowment", type: "participating", status: "active",
    desc: "Family income protection. On death, family gets 10% SA annually till maturity, then 110% SA.",
    minAge: 18, maxAge: 50, minTerm: 13, maxTerm: 25, minSA: 100000, maxSA: null,
    ppt: "term_minus_3", moneybkPayouts: [],
    onDeathAnnualPayout: 0.10, onDeathFinalPayout: 1.10,
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment", riders: ["ADB", "TERM"],
    keyFeatures: ["Annual income to family on death","PPT 3 years less than policy term","Ideal for income replacement"],
    tags: ["Family income", "Endowment", "With profit"],
    bestFor: "Breadwinner family protection", xirr: "5.0–5.6%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jeevan-lakshya",
  },
  {
    id: "736", planNo: 736,
    name: "Jeevan Labh", shortName: "Jeevan Labh",
    category: "endowment", type: "participating", status: "active",
    desc: "Limited pay endowment. Pay for fewer years, enjoy highest bonus + coverage for longer.",
    minAge: 8, maxAge: 59, minTerm: 16, maxTerm: 25, minSA: 200000, maxSA: null,
    pptOptions: [{ ppt: 10, term: 16 }, { ppt: 15, term: 21 }, { ppt: 16, term: 25 }],
    ppt: "limited", moneybkPayouts: [],
    deathBenefitFormula: "max(125% SA, 10x annualPremium) + bonuses",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment", riders: ["ADB", "PWB", "TERM"],
    keyFeatures: ["Pay for 10/15/16 yrs, covered for 16/21/25 yrs","Highest bonus rate (₹54/1000 SA/yr)","Best XIRR in endowment category","Min SA ₹2 lakh"],
    tags: ["Limited pay", "High returns", "With profit"],
    bestFor: "Higher corpus with shorter payment obligation", xirr: "5.5–6.2%",
    brochureUrl: "https://licindia.in/documents/20121/1319704/LIC_Jeevan+labh_Sales+Brochure_Eng.pdf/",
  },
  {
    id: "760", planNo: 760,
    name: "Bima Jyoti", shortName: "Bima Jyoti",
    category: "endowment", type: "non-participating", status: "active",
    desc: "Non-par plan with guaranteed additions of ₹50 per ₹1000 SA per year. Predictable maturity.",
    minAge: 0, maxAge: 60, minTerm: 15, maxTerm: 20, minSA: 100000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "SA + Guaranteed Additions",
    gstCategory: "endowment", riders: ["ADB"],
    keyFeatures: ["₹50 guaranteed additions per ₹1000 SA per year","Zero market risk","Predictable maturity amount","Tax benefit under 80C"],
    tags: ["Non-par", "Guaranteed additions", "Predictable"],
    bestFor: "Risk-averse investors wanting guaranteed returns", xirr: "5.0–5.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-bima-jyoti",
  },
  {
    id: "911", planNo: 911,
    name: "Nav Jeevan Shree (Single)", shortName: "NJS Single",
    category: "endowment", type: "non-participating", status: "active",
    desc: "New non-par single premium endowment with guaranteed additions. One-time payment.",
    minAge: 3, maxAge: 55, minTerm: 10, maxTerm: 25, minSA: 100000, maxSA: null,
    ppt: "single", moneybkPayouts: [],
    maturityFormula: "SA + Guaranteed Additions",
    gstCategory: "singlePrem", riders: ["ADB"],
    keyFeatures: ["Single premium — pay once","Guaranteed additions accumulate throughout term","Risk-free predictable maturity","Loan available after 1 year"],
    tags: ["Single premium", "Non-par", "Guaranteed"],
    bestFor: "One-time investment with guaranteed growth", xirr: "4.8–5.3%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-nav-jeevan-shree",
  },
  {
    id: "912", planNo: 912,
    name: "Nav Jeevan Shree (Limited)", shortName: "NJS Limited",
    category: "endowment", type: "non-participating", status: "active",
    desc: "Non-par limited pay endowment. Pay for shorter term (5/8/10 yrs), covered for 15/20/25 yrs.",
    minAge: 3, maxAge: 55, minTerm: 15, maxTerm: 25, minSA: 100000, maxSA: null,
    pptOptions: [{ ppt: 5, term: 15 }, { ppt: 8, term: 20 }, { ppt: 10, term: 25 }],
    ppt: "limited", moneybkPayouts: [],
    maturityFormula: "SA + Guaranteed Additions",
    gstCategory: "endowment", riders: ["ADB"],
    keyFeatures: ["Limited premium paying term (5/8/10 yrs)","Guaranteed additions throughout policy term","Non-participating — no market risk","Good for short income window"],
    tags: ["Limited pay", "Non-par", "Guaranteed"],
    bestFor: "Short earning window, want long-term cover", xirr: "5.0–5.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-nav-jeevan-shree",
  },

  // ════════════════════════════════════════════
  // NEW PLANS
  // ════════════════════════════════════════════
  {
    id: "880", planNo: 880,
    name: "Jan Suraksha", shortName: "Jan Suraksha",
    category: "endowment", type: "participating", status: "active",
    desc: "New participating endowment plan. Flexible terms with death + maturity benefit and annual bonus.",
    minAge: 18, maxAge: 55, minTerm: 15, maxTerm: 25, minSA: 100000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment", riders: ["ADB", "TERM"],
    keyFeatures: ["New plan with enhanced death benefit","Annual bonus participation","Tax benefit under 80C","Flexible term 15–25 years"],
    tags: ["New plan", "Endowment", "With profit"],
    bestFor: "Protection-first savings", xirr: "5.0–5.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jan-suraksha",
  },
  {
    id: "881", planNo: 881,
    name: "Bima Lakshmi", shortName: "Bima Lakshmi",
    category: "endowment", type: "participating", status: "active",
    desc: "New women-focused endowment with enhanced features for financial security of women.",
    minAge: 18, maxAge: 55, minTerm: 15, maxTerm: 25, minSA: 100000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "endowment", riders: ["ADB", "TERM"],
    keyFeatures: ["Designed for women's financial needs","Annual bonus participation","Flexible premium mode","Tax benefit under 80C and 10(10D)"],
    tags: ["New plan", "Women", "Endowment"],
    bestFor: "Women's long-term financial security", xirr: "5.0–5.6%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-bima-lakshmi",
  },

  // ════════════════════════════════════════════
  // MONEY BACK PLANS
  // ════════════════════════════════════════════
  {
    id: "720", planNo: 720,
    name: "New Money Back Plan — 20 Years", shortName: "Money Back 20yr",
    category: "moneyback", type: "participating", status: "active",
    desc: "Get 20% SA back every 5 years (3 times). Remaining 40% SA + full bonuses at 20-yr maturity.",
    minAge: 13, maxAge: 50, minTerm: 20, maxTerm: 20, minSA: 100000, maxSA: null,
    ppt: 15,
    moneybkPayouts: [{ year: 5, pct: 0.20 }, { year: 10, pct: 0.20 }, { year: 15, pct: 0.20 }],
    maturityPct: 0.40, maturityFormula: "40% SA + bonuses + FAB",
    gstCategory: "moneyback", riders: ["ADB", "TERM"],
    keyFeatures: ["20% SA back every 5 years for liquidity","Premium paying term only 15 years","40% SA + full bonuses at maturity","Life cover throughout for full SA"],
    tags: ["Money back", "Periodic returns", "With profit"],
    bestFor: "Planned liquidity every 5 years", xirr: "4.8–5.4%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-money-back-plan-20-years",
  },
  {
    id: "721", planNo: 721,
    name: "New Money Back Plan — 25 Years", shortName: "Money Back 25yr",
    category: "moneyback", type: "participating", status: "active",
    desc: "Get 15% SA back every 5 years (4 times). Remaining 40% SA + bonuses at 25-yr maturity.",
    minAge: 13, maxAge: 45, minTerm: 25, maxTerm: 25, minSA: 100000, maxSA: null,
    ppt: 20,
    moneybkPayouts: [{ year: 5, pct: 0.15 }, { year: 10, pct: 0.15 }, { year: 15, pct: 0.15 }, { year: 20, pct: 0.15 }],
    maturityPct: 0.40, maturityFormula: "40% SA + bonuses + FAB",
    gstCategory: "moneyback", riders: ["ADB", "TERM"],
    keyFeatures: ["4 periodic payouts of 15% SA each","Premium paying term only 20 years","Good for milestone-based planning"],
    tags: ["Money back", "4 payouts", "With profit"],
    bestFor: "Long-term with periodic cash flows", xirr: "4.7–5.3%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-money-back-plan-25-years",
  },
  {
    id: "748", planNo: 748,
    name: "Bima Shree", shortName: "Bima Shree",
    category: "moneyback", type: "participating", status: "active",
    desc: "HNI money back plan. Limited pay. Min SA ₹10 lakh. Survival benefits + high bonuses.",
    minAge: 8, maxAge: 55, minTerm: 20, maxTerm: 28, minSA: 1000000, maxSA: null,
    pptOptions: [{ ppt: 12, term: 20 }, { ppt: 14, term: 24 }, { ppt: 16, term: 28 }],
    ppt: "limited", moneybkPayouts: [],
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "moneyback", riders: ["ADB", "CI"],
    keyFeatures: ["Min SA ₹10 lakh — HNI plan","Limited pay 12/14/16 yrs","Survival benefits at intervals","Critical illness rider available"],
    tags: ["HNI", "Limited pay", "High cover"],
    bestFor: "High income earners wanting large cover + returns", xirr: "5.5–6.0%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-bima-shree",
  },

  // ════════════════════════════════════════════
  // WHOLE LIFE PLANS
  // ════════════════════════════════════════════
  {
    id: "745", planNo: 745,
    name: "Jeevan Umang", shortName: "Jeevan Umang",
    category: "wholelife", type: "participating", status: "active",
    desc: "Whole life plan. 8% SA income every year after PPT ends, for life. Full SA + bonuses at age 100.",
    minAge: 0, maxAge: 55, minTerm: 100, maxTerm: 100, minSA: 200000, maxSA: null,
    pptOptions: [15, 20, 25, 30], ppt: "limited",
    survivalBenefit: "8% SA per year after PPT completion",
    maturityFormula: "SA + accumulated bonuses + FAB (at age 100)",
    gstCategory: "wholelife", riders: ["ADB", "TERM", "CI"],
    keyFeatures: ["8% SA as annual income after PPT — for life","Highest bonus rate in LIC portfolio (₹55/1000)","Full SA + all bonuses at maturity (age 100)","Loan available after 3 years"],
    tags: ["Whole life", "Regular income", "High bonus"],
    bestFor: "Retirement income planning + legacy creation", xirr: "5.8–6.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jeevan-umang",
  },
  {
    id: "771", planNo: 771,
    name: "Jeevan Utsav", shortName: "Jeevan Utsav",
    category: "wholelife", type: "non-participating", status: "active",
    desc: "Non-par whole life. Guaranteed additions during PPT. 10% SA income per year for life after PPT.",
    minAge: 0, maxAge: 65, minTerm: 100, maxTerm: 100, minSA: 500000, maxSA: null,
    pptOptions: [5, 8, 10, 12, 15, 16], ppt: "limited",
    guaranteedAdditions: "₹40/₹1000 SA/yr during PPT",
    survivalBenefit: "10% SA per year for life after PPT",
    maturityFormula: "SA + GA at age 100",
    gstCategory: "wholelife", riders: ["ADB"],
    keyFeatures: ["₹40 guaranteed additions per ₹1000 SA/yr during PPT","10% SA annual income for life after PPT","Flexi income option at 5.5% interest","Min SA ₹5 lakh"],
    tags: ["Non-par", "Whole life", "Guaranteed income"],
    bestFor: "Long-term income with guaranteed additions", xirr: "5.5–6.0%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jeevan-utsav",
  },
  {
    id: "883", planNo: 883,
    name: "Jeevan Utsav (Single Premium)", shortName: "Jeevan Utsav SP",
    category: "wholelife", type: "non-participating", status: "active",
    desc: "Single premium version of Jeevan Utsav. Pay once, get lifetime income from day one.",
    minAge: 0, maxAge: 65, minTerm: 100, maxTerm: 100, minSA: 500000, maxSA: null,
    ppt: "single",
    guaranteedAdditions: "₹40/₹1000 SA/yr (first 5 yrs)",
    survivalBenefit: "10% SA per year for life immediately",
    maturityFormula: "SA + GA at age 100",
    gstCategory: "singlePrem", riders: ["ADB"],
    keyFeatures: ["Pay once — income starts immediately","10% SA annual income for lifetime","Ideal for windfall/inheritance investment","Min SA ₹5 lakh"],
    tags: ["Single premium", "Whole life", "Immediate income"],
    bestFor: "Lump sum → immediate lifetime income", xirr: "5.5–6.0%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jeevan-utsav",
  },

  // ════════════════════════════════════════════
  // CHILD PLANS
  // ════════════════════════════════════════════
  {
    id: "732", planNo: 732,
    name: "Child Money Back Plan", shortName: "Child Money Back",
    category: "child", type: "participating", status: "active",
    desc: "Survival benefits at child's age 18, 20, 22 (20% SA each). Maturity at 25: 40% SA + bonuses.",
    minAge: 0, maxAge: 12, minTerm: 25, maxTerm: 25, minSA: 100000, maxSA: null,
    ppt: "term_minus_3",
    moneybkPayouts: [{ year: 18, pct: 0.20, ageAt: 18 }, { year: 20, pct: 0.20, ageAt: 20 }, { year: 22, pct: 0.20, ageAt: 22 }],
    maturityPct: 0.40, maturityFormula: "40% SA + bonuses + FAB",
    gstCategory: "child", riders: ["ADB", "PWB"],
    keyFeatures: ["Money back at age 18, 20, 22 for education/marriage","Full cover continues even if parent dies","Premium Waiver on parent's death","Maturity at age 25"],
    tags: ["Child", "Education", "Money back"],
    bestFor: "Child's education + career milestones", xirr: "4.8–5.4%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-children-s-money-back-plan",
  },
  {
    id: "734", planNo: 734,
    name: "Jeevan Tarun", shortName: "Jeevan Tarun",
    category: "child", type: "participating", status: "active",
    desc: "Flexible child plan. 4 options for survival benefits from age 20–24. Choose % payout that suits.",
    minAge: 0, maxAge: 12, minTerm: 20, maxTerm: 25, minSA: 75000, maxSA: null,
    ppt: "same",
    survivalBenefitOptions: ["5%/yr ages 20–24", "10%/yr ages 20–24", "15%/yr ages 20–24", "20%/yr ages 20–24"],
    maturityFormula: "Remaining SA % + bonuses + FAB",
    gstCategory: "child", riders: ["ADB", "PWB"],
    keyFeatures: ["4 flexible survival benefit options","Risk commences at age 7","Annual survival payments age 20–24","Premium Waiver Benefit available"],
    tags: ["Child", "Flexible", "Survival benefits"],
    bestFor: "Flexible child savings with customizable payouts", xirr: "4.8–5.4%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jeevan-tarun",
  },
  {
    id: "774", planNo: 774,
    name: "Amritbaal", shortName: "Amritbaal",
    category: "child", type: "participating", status: "active",
    desc: "Latest LIC child plan. Enhanced death benefit, survival benefits, and extended coverage up to age 25.",
    minAge: 0, maxAge: 13, minTerm: 20, maxTerm: 25, minSA: 200000, maxSA: null,
    ppt: "same",
    maturityFormula: "SA + bonuses + FAB",
    gstCategory: "child", riders: ["ADB", "PWB"],
    keyFeatures: ["Latest child plan with enhanced benefits","Risk commencement from age 8","Premium waiver on parent's death","Loan facility available"],
    tags: ["Child", "Latest plan", "Enhanced benefits"],
    bestFor: "Parents wanting comprehensive child financial planning", xirr: "5.0–5.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-amritbaal",
  },

  // ════════════════════════════════════════════
  // TERM PLANS
  // ════════════════════════════════════════════
  {
    id: "859", planNo: 859,
    name: "Saral Jeevan Bima", shortName: "Saral Jeevan Bima",
    category: "term", type: "non-participating", status: "active",
    desc: "Standardized simple term plan. SA ₹5L–₹25L. Minimal paperwork. Available to all.",
    minAge: 18, maxAge: 65, minTerm: 5, maxTerm: 40, minSA: 500000, maxSA: 2500000,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "No maturity — pure protection",
    gstCategory: "term", riders: [],
    keyFeatures: ["Standardized IRDAI-mandated plan","Simple eligibility — minimal documentation","SA capped at ₹25 lakh","No medical for small SA"],
    tags: ["Term", "Simple", "Low cost"],
    bestFor: "First-time term insurance buyers", xirr: "N/A (pure protection)",
    brochureUrl: "https://licindia.in/web/guest/saral-jeevan-bima",
  },
  {
    id: "875", planNo: 875,
    name: "Yuva Term", shortName: "Yuva Term",
    category: "term", type: "non-participating", status: "active",
    desc: "Term plan for youth (18–45). Min SA ₹50 lakh. Cheapest premiums for young buyers.",
    minAge: 18, maxAge: 45, minTerm: 10, maxTerm: 40, minSA: 5000000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "No maturity — pure protection",
    gstCategory: "term", riders: ["ADB"],
    keyFeatures: ["Lowest premiums for young policyholders","High SA from ₹50 lakh","Online & offline available","Smoker/non-smoker differential"],
    tags: ["Term", "Youth", "High cover"],
    bestFor: "Young earners wanting maximum life cover", xirr: "N/A",
    brochureUrl: "https://licindia.in/web/guest/lic-s-yuva-term",
  },
  {
    id: "877", planNo: 877,
    name: "Yuva Credit Life", shortName: "Yuva Credit Life",
    category: "term", type: "non-participating", status: "active",
    desc: "Decreasing term plan for loan protection. Cover reduces with loan outstanding. Ideal for home/car loans.",
    minAge: 18, maxAge: 50, minTerm: 5, maxTerm: 30, minSA: 500000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "No maturity — pure protection",
    gstCategory: "term", riders: [],
    keyFeatures: ["Decreasing SA matches loan outstanding","Designed for home loan / auto loan protection","Low premiums due to reducing cover","Joint life option available"],
    tags: ["Term", "Loan protection", "Decreasing cover"],
    bestFor: "Home/car/personal loan borrowers", xirr: "N/A",
    brochureUrl: "https://licindia.in/web/guest/lic-s-yuva-credit-life",
  },
  {
    id: "887", planNo: 887,
    name: "Bima Kavach", shortName: "Bima Kavach",
    category: "term", type: "non-participating", status: "active",
    desc: "Micro-size term plan. SA ₹37,500–₹2.5L. Single premium. Short term 1–5 years. For all income groups.",
    minAge: 18, maxAge: 55, minTerm: 1, maxTerm: 5, minSA: 37500, maxSA: 250000,
    ppt: "single", moneybkPayouts: [],
    maturityFormula: "No maturity — pure protection",
    gstCategory: "singlePrem", riders: [],
    keyFeatures: ["Single premium — pay once","Very small SA for low-income families","Short 1–5 year terms","IRDAI rural/social sector plan"],
    tags: ["Micro term", "Single premium", "Rural"],
    bestFor: "Low-income families wanting basic cover", xirr: "N/A",
    brochureUrl: "https://licindia.in/web/guest/lic-s-bima-kavach",
  },
  {
    id: "955", planNo: 955,
    name: "New Jeevan Amar", shortName: "Jeevan Amar",
    category: "term", type: "non-participating", status: "active",
    desc: "Flagship offline term plan. Level or increasing SA. High cover up to ₹25 crore. Agent channel.",
    minAge: 18, maxAge: 65, minTerm: 10, maxTerm: 40, minSA: 2500000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "No maturity — pure protection",
    gstCategory: "term", riders: ["ADB"],
    keyFeatures: ["Level or increasing SA option","Very high SA available (up to ₹25 crore)","Accidental death & disability rider","Smoker/non-smoker rates"],
    tags: ["Term", "Flagship", "High cover"],
    bestFor: "High income earners needing very large life cover", xirr: "N/A",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-jeevan-amar",
  },

  // ════════════════════════════════════════════
  // PENSION PLANS
  // ════════════════════════════════════════════
  {
    id: "758", planNo: 758,
    name: "New Jeevan Shanti", shortName: "New Jeevan Shanti",
    category: "pension", type: "non-participating", status: "active",
    desc: "Single premium annuity. Choose immediate or deferred annuity (up to 12 years deferral). 10 annuity options.",
    minAge: 30, maxAge: 79, minTerm: 0, maxTerm: 12, minSA: 150000, maxSA: null,
    ppt: "single", moneybkPayouts: [],
    annuityOptions: ["Life Annuity", "Joint Life Annuity", "Return of Purchase Price", "Life Annuity with ROP on Death"],
    maturityFormula: "Annual pension for life",
    gstCategory: "singlePrem", riders: [],
    keyFeatures: ["Immediate or deferred annuity","10 flexible annuity options","Return of purchase price on death","Joint life option for couples"],
    tags: ["Pension", "Annuity", "Single premium"],
    bestFor: "Retirement corpus → guaranteed monthly income", xirr: "6.0–7.0%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-jeevan-shanti",
  },
  {
    id: "857", planNo: 857,
    name: "Jeevan Akshay — VII", shortName: "Jeevan Akshay VII",
    category: "pension", type: "non-participating", status: "active",
    desc: "Immediate annuity plan. Multiple annuity options including joint life and return of purchase price.",
    minAge: 30, maxAge: 85, minTerm: 0, maxTerm: 0, minSA: 100000, maxSA: null,
    ppt: "single", moneybkPayouts: [],
    annuityOptions: ["Life Annuity", "Life with 5/10/15/20 yr Guaranteed","Joint Life Last Survivor","Life Annuity with ROP on Death","Joint Life with ROP"],
    maturityFormula: "Annual pension for life",
    gstCategory: "singlePrem", riders: [],
    keyFeatures: ["Immediate pension from next month","7 annuity options","Joint life & return of purchase price","Highest annuity rate in immediate annuity category"],
    tags: ["Pension", "Immediate annuity", "Multiple options"],
    bestFor: "Retirement lump sum → immediate pension", xirr: "6.0–7.2%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-jeevan-akshay-vii",
  },
  {
    id: "862", planNo: 862,
    name: "Saral Pension", shortName: "Saral Pension",
    category: "pension", type: "non-participating", status: "active",
    desc: "Simple standardized immediate annuity. 2 options: Life Annuity with ROP or Joint Life with ROP.",
    minAge: 40, maxAge: 80, minTerm: 0, maxTerm: 0, minSA: 100000, maxSA: null,
    ppt: "single", moneybkPayouts: [],
    annuityOptions: ["Life Annuity with Return of Purchase Price", "Joint Life Last Survivor with ROP"],
    maturityFormula: "Annual pension for life",
    gstCategory: "singlePrem", riders: [],
    keyFeatures: ["Standardized IRDAI-mandated annuity","Return of purchase price to nominee","Simple 2 options only","Minimum documentation"],
    tags: ["Pension", "Simple", "Standardized"],
    bestFor: "Simple guaranteed pension with return of corpus", xirr: "5.8–6.5%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-saral-pension",
  },
  {
    id: "879", planNo: 879,
    name: "Smart Pension", shortName: "Smart Pension",
    category: "pension", type: "participating", status: "active",
    desc: "Regular premium deferred annuity. Build pension corpus with annual premiums. Vesting age 40–75.",
    minAge: 18, maxAge: 65, minTerm: 10, maxTerm: 42, minSA: 100000, maxSA: null,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "Accumulated corpus + bonuses → annuity",
    gstCategory: "pension", riders: [],
    keyFeatures: ["Regular premium pension building","Participating — bonus on vesting","Flexible vesting age 40–75","Surrender available after 3 years"],
    tags: ["Pension", "Regular premium", "Deferred"],
    bestFor: "Young earners building pension corpus monthly", xirr: "5.5–6.2%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-smart-pension",
  },

  // ════════════════════════════════════════════
  // ULIP PLANS
  // ════════════════════════════════════════════
  {
    id: "749", planNo: 749,
    name: "Nivesh Plus", shortName: "Nivesh Plus",
    category: "ulip", type: "ulip", status: "active",
    desc: "Single premium ULIP. Invest once in 4 fund options. Min ₹1 lakh. Lock-in 5 years.",
    minAge: 0, maxAge: 65, minTerm: 10, maxTerm: 25, minPremium: 100000,
    ppt: "single", fundOptions: ULIP_FUNDS[749],
    fundManagementCharge: 0.0125,
    lockIn: 5,
    maturityFormula: "Fund value at maturity",
    gstCategory: "ulip", riders: ["LADB"],
    keyFeatures: ["Single premium investment","4 fund options (Bond to Growth)","4 free fund switches per year","Life cover = 125% of single premium"],
    tags: ["ULIP", "Single premium", "Market-linked"],
    bestFor: "Lump sum market investment with insurance", xirr: "Market dependent",
    brochureUrl: "https://licindia.in/documents/20121/103490/LIC_Nivesh-Plus_Brochure_9-inch-x-8-inch_Eng_Single-pages-(2).pdf/",
  },
  {
    id: "752", planNo: 752,
    name: "SIIP", shortName: "SIIP",
    category: "ulip", type: "ulip", status: "active",
    desc: "SIP-style regular premium ULIP. Min ₹4,000/month. Guaranteed additions at years 4, 7, 10, 13, 16.",
    minAge: 0, maxAge: 65, minTerm: 10, maxTerm: 25, minPremium: 48000,
    ppt: "same", fundOptions: ULIP_FUNDS[752],
    fundManagementCharge: 0.0125,
    guaranteedAdditions: [4, 7, 10, 13, 16],
    lockIn: 5,
    returnOfMortalityCharges: true,
    maturityFormula: "Fund value + RoMC + Guaranteed Additions",
    gstCategory: "ulip", riders: ["LADB"],
    keyFeatures: ["Guaranteed additions at years 4,7,10,13,16","Return of mortality charges at maturity","SIP-style regular investment","4 fund options"],
    tags: ["ULIP", "Regular premium", "Guaranteed additions"],
    bestFor: "SIP-style market investment with insurance", xirr: "Market dependent",
    brochureUrl: "https://licindia.in/documents/20121/1319704/SIIP+Sales+Brochure.pdf/",
  },
  {
    id: "867", planNo: 867,
    name: "New Pension Plus", shortName: "New Pension Plus",
    category: "ulip", type: "ulip", status: "active",
    desc: "Pension ULIP. Build retirement corpus in market-linked pension funds. 4 dedicated pension fund options.",
    minAge: 25, maxAge: 65, minTerm: 10, maxTerm: 42, minPremium: 30000,
    ppt: "same", fundOptions: ULIP_FUNDS[867],
    fundManagementCharge: 0.0125,
    lockIn: 5,
    maturityFormula: "Pension fund value → annuity on vesting",
    gstCategory: "ulip", riders: [],
    keyFeatures: ["4 pension-specific fund options","Market-linked pension building","Convert to annuity on vesting","Tax deduction under 80CCC"],
    tags: ["ULIP", "Pension", "Market-linked"],
    bestFor: "Market-linked retirement corpus building", xirr: "Market dependent",
    brochureUrl: "https://licindia.in/web/guest/lic-s-new-pension-plus-plan-no.867-uin-no.-512l347v01-",
  },
  {
    id: "873", planNo: 873,
    name: "Index Plus", shortName: "Index Plus",
    category: "ulip", type: "ulip", status: "withdrawn",
    desc: "Index-linked ULIP tracking NIFTY 100 and NIFTY 50. Withdrawn from new business Oct 1, 2024. Existing policies continue.",
    minAge: 0, maxAge: 65, minTerm: 10, maxTerm: 25, minPremium: 30000,
    ppt: "same", fundOptions: ULIP_FUNDS[873],
    fundManagementCharge: 0.0050, // lower FMC for index funds
    lockIn: 5,
    maturityFormula: "Fund value at maturity (index-linked)",
    gstCategory: "ulip", riders: ["LADB"],
    keyFeatures: ["Tracks NIFTY 100 and NIFTY 50 indices","Lowest fund management charge (0.50%)","Transparent index-based returns","Withdrawn from new business Oct 2024"],
    tags: ["ULIP", "Index fund", "Withdrawn"],
    bestFor: "Existing policyholders only (closed to new)", xirr: "Market dependent",
    brochureUrl: "https://licindia.in/documents/20121/987437/101941+LIC_Index+Plus+Sales+Brochure_FEB+24-WEB.pdf/",
  },
  {
    id: "886", planNo: 886,
    name: "Protection Plus", shortName: "Protection Plus",
    category: "ulip", type: "ulip", status: "active",
    desc: "ULIP with enhanced protection. 6 fund options including index funds. High life cover + market investment.",
    minAge: 0, maxAge: 65, minTerm: 10, maxTerm: 25, minPremium: 30000,
    ppt: "same", fundOptions: ULIP_FUNDS[886],
    fundManagementCharge: 0.0125,
    lockIn: 5,
    maturityFormula: "Fund value at maturity",
    gstCategory: "ulip", riders: ["LADB"],
    keyFeatures: ["6 fund options — most in LIC ULIP range","Includes NIFTY 100 and NIFTY 50 index funds","4 free fund switches per year","Enhanced life cover component"],
    tags: ["ULIP", "6 funds", "Protection + growth"],
    bestFor: "Market investment with maximum fund choice", xirr: "Market dependent",
    brochureUrl: "https://licindia.in/documents/20121/1319704/LIC+Protection+plus+sales+brochure+Eng_03122025.pdf/",
  },

  // ════════════════════════════════════════════
  // MICRO INSURANCE
  // ════════════════════════════════════════════
  {
    id: "751", planNo: 751,
    name: "Micro Bachat", shortName: "Micro Bachat",
    category: "micro", type: "participating", status: "active",
    desc: "Micro insurance endowment. Max SA ₹2 lakh. Simple savings + life cover for low-income families.",
    minAge: 18, maxAge: 55, minTerm: 10, maxTerm: 15, minSA: 50000, maxSA: 200000,
    ppt: "same", moneybkPayouts: [],
    maturityFormula: "SA + bonuses",
    gstCategory: "micro", riders: [],
    keyFeatures: ["Max SA ₹2 lakh — micro insurance","Simple documentation","Affordable premiums","Ideal for rural / low-income segments"],
    tags: ["Micro", "Simple", "Affordable"],
    bestFor: "Rural families wanting affordable savings + cover", xirr: "4.5–5.0%",
    brochureUrl: "https://licindia.in/web/guest/lic-s-micro-bachat",
  },
];

// ─────────────────────────────────────────────
// CALCULATION FUNCTIONS
// ─────────────────────────────────────────────

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

export function getPPT(plan, term, _age) {
  if (typeof plan.ppt === 'number') return plan.ppt;
  if (plan.ppt === "same") return term;
  if (plan.ppt === "single") return 1;
  if (plan.ppt === "term_minus_3") return term - 3;
  if (plan.ppt === "term_minus_5") return term - 5;
  if (plan.ppt === "limited" && plan.pptOptions) {
    if (Array.isArray(plan.pptOptions) && plan.pptOptions[0]?.ppt) {
      const match = plan.pptOptions.find(o => o.term === term);
      if (match) return match.ppt;
      return plan.pptOptions[0].ppt;
    }
    return 15;
  }
  return term;
}

export function calculatePremium({ planNo, sa, age, term, ppt, mode = "yearly", smoker = false, gender = "male" }) {
  const plan = PLANS.find(p => p.planNo === planNo);
  if (!plan) return null;

  // ULIPs don't use tabular rates
  if (plan.category === "ulip") {
    const yearly = plan.minPremium || 30000;
    return {
      basePremium: yearly,
      modeRebate: 0, saRebate: 0, netPremium: yearly,
      gstYear1: yearly * 0.18, gstYear2: yearly * 0.18,
      yearlyYear1: Math.round(yearly * 1.18),
      yearlyYear2plus: Math.round(yearly * 1.18),
      instalment1: Math.round(yearly * 1.18),
      instalment2: Math.round(yearly * 1.18),
      totalPaid: Math.round(yearly * 1.18) * (ppt || term),
      isUlip: true,
    };
  }

  const rate = getTabularRate(planNo, age, term);
  let basePremium = (rate * sa) / 1000;

  if (smoker && plan.category === "term") basePremium *= 1.25;
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
  const totalPaid = yearlyPremYear1 + yearlyPremYear2 * ((ppt || term) - 1);

  return {
    basePremium: Math.round(basePremium),
    modeRebate: Math.round(modeRebateAmt),
    saRebate: Math.round(saRebateAmt),
    netPremium: Math.round(netPremium),
    gstYear1: Math.round(gst1),
    gstYear2: Math.round(gst2),
    yearlyYear1: yearlyPremYear1,
    yearlyYear2plus: yearlyPremYear2,
    instalment1, instalment2,
    totalPaid: Math.round(totalPaid),
    modeRebatePct: modeRebatePct * 100,
    saRebatePer1000,
    gstPctYear1: gstRules.year1 * 100,
    gstPctYear2: (gstRules.year2plus || 0) * 100,
  };
}

export function calculateMaturity({ planNo, sa, term }) {
  const bonusData = BONUS_RATES_2026[planNo];
  if (!bonusData) return { maturity: sa, totalBonus: 0, fab: 0 };

  let totalBonus = 0;
  let fab = 0;

  if (bonusData.srb) {
    totalBonus = (bonusData.srb * sa / 1000) * term;
    fab = bonusData.fab ? (bonusData.fab * sa / 1000) : 0;
  } else if (bonusData.ga) {
    totalBonus = (bonusData.ga * sa / 1000) * term;
  }

  return {
    maturity: Math.round(sa + totalBonus + fab),
    totalBonus: Math.round(totalBonus),
    fab: Math.round(fab),
  };
}

export function calculateXIRR(totalPaid, maturity, term) {
  if (!maturity || maturity <= totalPaid) return 0;
  return ((Math.pow(maturity / totalPaid, 1 / term) - 1) * 100).toFixed(2);
}

export function generateBenefitTable({ planNo, sa, age, term, ppt, premResult = undefined, yearlyPremYear1 = undefined, yearlyPremYear2 = undefined }) {
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

    let deathBenefit = sa + cumBonus;
    if (plan?.deathBenefitFormula?.includes("125%")) {
      deathBenefit = Math.max(sa * 1.25, 10 * prem2) + cumBonus;
    }

    let survivalPayout = null;
    if (plan?.moneybkPayouts) {
      const mb = plan.moneybkPayouts.find(m => m.year === y);
      if (mb) survivalPayout = mb.pct * sa;
    }

    let maturityPayout = null;
    if (y === term && plan?.category !== "term" && plan?.category !== "pension") {
      const matPct = plan.maturityPct || 1.0;
      maturityPayout = (matPct * sa) + cumBonus + fab;
    }

    let gsv = 0;
    if (y >= 3) {
      const gsvPct = y <= 3 ? 0.30 : y <= 5 ? 0.50 : y <= 7 ? 0.55 : y <= 9 ? 0.60 : y <= 11 ? 0.65 : y <= 13 ? 0.70 : y <= 15 ? 0.80 : 0.90;
      gsv = Math.round(cumPrem * gsvPct);
    }

    rows.push({
      year: y, age: age + y,
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

export function advisePlans({ age, goal, budget, hasDependents }) {
  const active = PLANS.filter(p => p.status !== 'withdrawn');
  const suggestions = [];

  if (goal === "protection" || hasDependents) {
    suggestions.push(...active.filter(p => p.category === "term").slice(0, 2));
  }
  if (goal === "savings" && age < 45) {
    suggestions.push(...active.filter(p => ["endowment", "moneyback"].includes(p.category)).slice(0, 3));
  }
  if (goal === "child" && age < 45) {
    suggestions.push(...active.filter(p => p.category === "child"));
  }
  if (goal === "retirement" || age > 45) {
    suggestions.push(...active.filter(p => p.category === "pension").slice(0, 2));
    if (age < 55) suggestions.push(active.find(p => p.planNo === 745));
  }
  if (goal === "investment" && budget > 50000) {
    suggestions.push(...active.filter(p => p.category === "ulip").slice(0, 2));
  }

  return [...new Set(suggestions)].filter(Boolean);
}

export default PLANS;
