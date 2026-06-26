export const CALCULATOR_INSIGHTS = {
  premium: {
    template:
      'For ₹{daily}/day, your family gets ₹{sa} protection. That\'s less than {comparison}.',
    comparisons: [
      { maxDaily: 30, text: 'a samosa' },
      { maxDaily: 60, text: 'your daily chai' },
      { maxDaily: 150, text: 'a movie ticket' },
      { maxDaily: 500, text: 'a meal at a restaurant' },
    ],
    action: 'Talk to Ajay ji to finalize your plan →',
  },
  surrender: {
    template:
      'Surrendering costs ₹{loss}. A policy loan gives ₹{loanAmount} NOW while keeping your ₹{sa} cover.',
    action: 'Compare loan option →',
  },
  maturity: {
    template:
      'Your ₹{sa} policy grows to ₹{maturity} — {returnPct}% effective return, plus life cover for {term} years.',
    action: "Check if this covers your family's needs →",
  },
  coverage: {
    gapTemplate:
      'Your family needs ₹{need}. You have ₹{existing} — gap of ₹{gap}. Term cover for the gap costs ~₹{termEstimate}/month.',
    adequateTemplate:
      'Your ₹{existing} cover looks strong at {multiple}× your income. You\'re better prepared than most families.',
    action: 'Find plans for this coverage →',
  },
  retirement: {
    template:
      'Today\'s ₹{expense}/month becomes ₹{futureExpense}/month in {years} years. Start with ₹{sip}/month — earlier is cheaper.',
    action: 'Explore pension plans →',
  },
  loan: {
    template:
      'Get ₹{loan} today while keeping your ₹{sa} cover and ₹{maturityEstimate} maturity intact.',
    action: 'Compare: surrendering gives ₹{svAmount} less →',
  },
  healthScore: {
    template:
      'Your biggest gap: {weakestArea}. Fixing this lifts your score from {current} to ~{projected}.',
    action: 'Improve your weakest area →',
  },
} as const

export const SOCIAL_PROOF = [
  '4,500+ families have used this calculator this month',
  'Most popular in Gorakhpur, Lucknow, and Patna',
  'Trusted by 5,000+ families across Eastern UP',
] as const
