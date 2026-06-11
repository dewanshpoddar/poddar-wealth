export interface TopPlan {
  id: string;
  name: string;
  tag: string;
  tagHi: string;
  type: string;
  typeHi: string;
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
    id: 'jeevan-utsav',
    name: 'LIC Jeevan Utsav',
    tag: 'Lifetime Income',
    tagHi: 'आजीवन आय',
    type: 'Whole Life Plan',
    typeHi: 'होल लाइफ प्लान',
    link: '/products',
    highlight: 'Guaranteed lifetime regular income after premium payment term.',
    highlightHi: 'प्रीमियम भुगतान अवधि के बाद गारंटीकृत आजीवन नियमित आय।',
    minPremium: '₹2,500/month',
    minPremiumHi: '₹2,500/माह',
    icon: 'TrendingUp',
    color: 'amber',
  },
  {
    id: 'star-gold-health',
    name: 'Star Gold Health',
    tag: 'Cashless Hospitalization',
    tagHi: 'कैशलेस अस्पताल',
    type: 'Health Floater',
    typeHi: 'हेल्थ फ्लोटर',
    link: '/services/health-insurance',
    highlight: 'Cashless treatment at major hospitals and diagnostic clinics.',
    highlightHi: 'प्रमुख अस्पतालों और डायग्नोस्टिक क्लीनिकों में कैशलेस इलाज।',
    minPremium: '₹900/month',
    minPremiumHi: '₹900/माह',
    icon: 'Shield',
    color: 'blue',
  },
  {
    id: 'tech-term',
    name: 'LIC Tech-Term',
    tag: 'High Sum Assured',
    tagHi: 'बड़ा लाइफ कवर',
    type: 'Pure Term Insurance',
    typeHi: 'शुद्ध टर्म इंश्योरेंस',
    link: '/services/term-life',
    highlight: 'High life cover at very low premium rates for young earners.',
    highlightHi: 'युवा कमाने वालों के लिए बेहद कम प्रीमियम पर बड़ा लाइफ कवर।',
    minPremium: '₹800/month',
    minPremiumHi: '₹800/माह',
    icon: 'Award',
    color: 'emerald',
  },
  {
    id: 'jeevan-umang',
    name: 'LIC Jeevan Umang',
    tag: '8% Lifetime Return',
    tagHi: '8% आजीवन रिटर्न',
    type: 'Whole Life Endowment',
    typeHi: 'होल लाइफ एंडोमेंट',
    link: '/products',
    highlight: 'Tax-free survival benefits every year for life.',
    highlightHi: 'जीवन भर हर साल टैक्स-फ्री सर्वाइवल बेनिफिट्स।',
    minPremium: '₹3,000/month',
    minPremiumHi: '₹3,000/माह',
    icon: 'Zap',
    color: 'purple',
  },
  {
    id: 'star-senior-red-carpet',
    name: 'Star Senior Citizen',
    tag: 'No Medical Screening',
    tagHi: 'कोई मेडिकल टेस्ट नहीं',
    type: 'Senior Health Cover',
    typeHi: 'सीनियर हेल्थ कवर',
    link: '/services/health-insurance',
    highlight: 'Medical cover for parents up to 75 years without pre-policy check.',
    highlightHi: 'बिना किसी प्री-पॉलिसी चेक के 75 वर्ष तक के माता-पिता के लिए मेडिकल कवर।',
    minPremium: '₹1,500/month',
    minPremiumHi: '₹1,500/माह',
    icon: 'Heart',
    color: 'rose',
  },
  {
    id: 'children-money-back',
    name: "LIC New Children's Money Back",
    tag: 'Education Milestone',
    tagHi: 'शिक्षा मील के पत्थर',
    type: 'Child Savings Plan',
    typeHi: 'चाइल्ड सेविंग्स प्लान',
    link: '/services/child-planning',
    highlight: 'Guaranteed payouts at ages 18, 20 & 22 for higher education.',
    highlightHi: 'उच्च शिक्षा के लिए 18, 20 और 22 वर्ष की आयु में गारंटीकृत भुगतान।',
    minPremium: '₹2,000/month',
    minPremiumHi: '₹2,000/माह',
    icon: 'GraduationCap',
    color: 'sky',
  },
];
