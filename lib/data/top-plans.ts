export interface TopPlan {
  id: string;
  name: string;
  nameHi: string;
  type: string;
  typeHi: string;
  tag: string;
  tagHi: string;
  link: string;
  highlight: string;
  highlightHi: string;
  minPremium: string;
  minPremiumHi: string;
  icon: string;
  color: string;
}

export const TOP_PLANS: TopPlan[] = [
  {
    id: 'jeevan-anand',
    name: 'LIC Jeevan Anand',
    nameHi: 'LIC जीवन आनंद',
    type: 'Endowment Plan',
    typeHi: 'एंडोमेंट प्लान',
    tag: 'Most Popular',
    tagHi: 'सबसे लोकप्रिय',
    link: '/blog/lic-jeevan-anand-complete-guide',
    highlight: 'Maturity + lifetime cover',
    highlightHi: 'मैच्योरिटी + आजीवन कवर',
    minPremium: '₹5,000/yr',
    minPremiumHi: '₹5,000/वर्ष',
    icon: 'Shield',
    color: 'blue',
  },
  {
    id: 'tech-term',
    name: 'LIC Tech Term',
    nameHi: 'LIC टेक टर्म',
    type: 'Online Term Plan',
    typeHi: 'ऑनलाइन टर्म प्लान',
    tag: 'Best Value',
    tagHi: 'बेस्ट वैल्यू',
    link: '/blog/lic-tech-term-vs-jeevan-amar',
    highlight: '₹1Cr cover from ₹500/mo',
    highlightHi: '₹500/महीना से ₹1Cr कवर',
    minPremium: '₹6,000/yr',
    minPremiumHi: '₹6,000/वर्ष',
    icon: 'ShieldCheck',
    color: 'emerald',
  },
  {
    id: 'jeevan-umang',
    name: 'LIC Jeevan Umang',
    nameHi: 'LIC जीवन उमंग',
    type: 'Whole Life Plan',
    typeHi: 'होल लाइफ प्लान',
    tag: 'Lifetime Income',
    tagHi: 'आजीवन आय',
    link: '/blog/lic-jeevan-umang-945-guide',
    highlight: '8% SA paid yearly after maturity',
    highlightHi: 'मैच्योरिटी के बाद हर साल 8% SA',
    minPremium: '₹8,000/yr',
    minPremiumHi: '₹8,000/वर्ष',
    icon: 'Infinity',
    color: 'violet',
  },
  {
    id: 'star-comprehensive',
    name: 'Star Health Comprehensive',
    nameHi: 'स्टार हेल्थ कॉम्प्रिहेंसिव',
    type: 'Health Insurance',
    typeHi: 'स्वास्थ्य बीमा',
    tag: 'Health Cover',
    tagHi: 'हेल्थ कवर',
    link: '/services/health-insurance',
    highlight: '₹5L-1Cr cashless cover',
    highlightHi: '₹5L-1Cr कैशलेस कवर',
    minPremium: '₹4,000/yr',
    minPremiumHi: '₹4,000/वर्ष',
    icon: 'HeartPulse',
    color: 'red',
  },
  {
    id: 'jeevan-lakshya',
    name: 'LIC Jeevan Lakshya',
    nameHi: 'LIC जीवन लक्ष्य',
    type: 'Child Plan',
    typeHi: 'बच्चों का प्लान',
    tag: 'For Children',
    tagHi: 'बच्चों के लिए',
    link: '/services/child-planning',
    highlight: 'Annual payout + maturity bonus',
    highlightHi: 'वार्षिक भुगतान + मैच्योरिटी बोनस',
    minPremium: '₹6,000/yr',
    minPremiumHi: '₹6,000/वर्ष',
    icon: 'GraduationCap',
    color: 'amber',
  },
  {
    id: 'money-back',
    name: 'LIC New Money Back',
    nameHi: 'LIC न्यू मनी बैक',
    type: 'Money Back Plan',
    typeHi: 'मनी बैक प्लान',
    tag: 'Regular Income',
    tagHi: 'नियमित आय',
    link: '/blog/money-back-vs-endowment',
    highlight: 'Survival benefits every 5 years',
    highlightHi: 'हर 5 साल पर सर्वाइवल बेनिफिट',
    minPremium: '₹7,000/yr',
    minPremiumHi: '₹7,000/वर्ष',
    icon: 'Banknote',
    color: 'teal',
  },
];
