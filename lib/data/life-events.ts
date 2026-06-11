export interface LifeEvent {
  slug: string;
  title: string;
  titleHi: string;
  icon: string;
  description: string;
  descriptionHi: string;
  color: string;
  suggestedCovers: string[];
  calculatorLink: string;
  blogSlugs: string[];
  ageRange: string;
  heroText: string;
}

export const LIFE_EVENTS: LifeEvent[] = [
  {
    slug: 'first-job',
    title: 'I Got My First Job',
    titleHi: 'मेरी पहली नौकरी लगी',
    icon: 'Briefcase',
    description: 'Starting your career? Build your financial foundation.',
    descriptionHi: 'करियर की शुरुआत? अपनी आर्थिक नींव मजबूत करें।',
    color: 'blue',
    suggestedCovers: ['term-life', 'health-insurance'],
    calculatorLink: '/calculators/life-insurance',
    blogSlugs: ['term-insurance-kya-hai', 'best-health-insurance-young'],
    ageRange: '22-28',
    heroText: 'Your first salary deserves a plan. Start with ₹500/month.',
  },
  {
    slug: 'just-married',
    title: 'I Just Got Married',
    titleHi: 'मेरी शादी हुई है',
    icon: 'Heart',
    description: 'Protect your partner. Plan your future together.',
    descriptionHi: 'अपने साथी की सुरक्षा करें। साथ मिलकर भविष्य बनाएं।',
    color: 'rose',
    suggestedCovers: ['term-life', 'health-insurance', 'retirement'],
    calculatorLink: '/calculators/policy-health',
    blogSlugs: ['best-insurance-for-newlywed-couples-2026', 'how-much-life-insurance-do-you-need'],
    ageRange: '25-35',
    heroText: 'Two lives, one plan. Make sure both are protected.',
  },
  {
    slug: 'became-parent',
    title: 'I Became a Parent',
    titleHi: 'मैं माता/पिता बना/बनी',
    icon: 'Baby',
    description: 'Your child deserves a secure future.',
    descriptionHi: 'आपके बच्चे को सुरक्षित भविष्य मिलना चाहिए।',
    color: 'amber',
    suggestedCovers: ['child-education', 'term-life', 'health-insurance'],
    calculatorLink: '/calculators/premium',
    blogSlugs: ['lic-jeevan-kishore-childrens-plan', 'lic-new-childrens-money-back-plan'],
    ageRange: '25-40',
    heroText: 'From their first steps to IIT admission. Plan it.',
  },
  {
    slug: 'bought-home',
    title: 'I Bought a Home',
    titleHi: 'मैंने घर खरीदा',
    icon: 'Home',
    description: 'Protect your biggest investment.',
    descriptionHi: 'अपने सबसे बड़े निवेश की सुरक्षा करें।',
    color: 'emerald',
    suggestedCovers: ['term-life', 'home-insurance'],
    calculatorLink: '/calculators/life-insurance',
    blogSlugs: ['how-much-life-insurance-do-you-need', 'lic-endowment-vs-ppf-fd-comparison'],
    ageRange: '28-45',
    heroText: "Your EMI should never become your family's burden.",
  },
  {
    slug: 'planning-retirement',
    title: 'I Want to Retire Peacefully',
    titleHi: 'मैं शांति से रिटायर होना चाहता हूं',
    icon: 'Sunset',
    description: 'Freedom, not dependence. Plan your retirement.',
    descriptionHi: 'आजादी, निर्भरता नहीं। अपनी सेवानिवृत्ति की योजना बनाएं।',
    color: 'violet',
    suggestedCovers: ['pension', 'health-insurance-senior'],
    calculatorLink: '/calculators/retirement',
    blogSlugs: ['lic-jeevan-labh-plan-936-complete-review', 'lic-index-plus-market-linked-plan'],
    ageRange: '40-55',
    heroText: 'Retire with freedom. Not with worry.',
  },
  {
    slug: 'protect-health',
    title: 'I Need Health Coverage',
    titleHi: 'मुझे स्वास्थ्य बीमा चाहिए',
    icon: 'HeartPulse',
    description: "A medical emergency shouldn't become a financial emergency.",
    descriptionHi: 'चिकित्सा आपातकाल आर्थिक आपातकाल नहीं बनना चाहिए।',
    color: 'red',
    suggestedCovers: ['health-insurance', 'critical-illness'],
    calculatorLink: '/calculators/policy-health',
    blogSlugs: ['critical-illness-vs-health-insurance', 'lic-arogya-rakshak-health-review'],
    ageRange: '25-60',
    heroText: 'Cover your family for ₹10-50 lakh. Starting ₹300/month.',
  },
];

export const COVER_LABELS: Record<string, string> = {
  'term-life': 'Term Life Insurance',
  'health-insurance': 'Health Insurance',
  retirement: 'Retirement Plan',
  'child-education': 'Child Education Plan',
  'home-insurance': 'Home Protection',
  pension: 'Pension Plan',
  'health-insurance-senior': 'Senior Health Insurance',
  'critical-illness': 'Critical Illness Cover',
};

export const COVER_HREFS: Record<string, string> = {
  'term-life': '/services/term-life',
  'health-insurance': '/services/health-insurance',
  retirement: '/services/retirement',
  'child-education': '/services/child-planning',
  'home-insurance': '/services/life-insurance',
  pension: '/services/retirement',
  'health-insurance-senior': '/services/health-insurance',
  'critical-illness': '/services/critical-illness',
};
