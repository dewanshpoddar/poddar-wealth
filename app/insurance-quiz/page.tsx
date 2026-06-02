'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { ArrowRight, ArrowLeft, Check, Sparkles, MessageCircle, AlertCircle, Share2, HelpCircle } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import { ADVISOR_PHONE } from '@/lib/constants'

// Recommendation mapping dictionary for all 25 combinations of lifeStage + concern
interface Recommendation {
  planName: string
  why: string
  whyHi: string
  startingPrice: string
  startingPriceHi: string
  link: string
}

const RECOMMENDATIONS: Record<string, Recommendation> = {
  // Career (career)
  'career-protection': {
    planName: 'LIC Tech Term (Plan 854) + Star Health Assured',
    why: 'Secure massive life cover and comprehensive health shield at absolute minimum cost early in life.',
    whyHi: 'जीवन के प्रारंभिक वर्षों में न्यूनतम प्रीमियम पर भारी लाइफ कवर और व्यापक स्वास्थ्य सुरक्षा चक्र सुनिश्चित करें।',
    startingPrice: '₹800/month',
    startingPriceHi: '₹800/माह',
    link: '/services/life-insurance'
  },
  'career-wealth': {
    planName: 'LIC Jeevan Labh (Plan 936) / ULIP Plus',
    why: 'High-growth asset accumulation combined with a highly secure capital guarantee base.',
    whyHi: 'एक अत्यधिक सुरक्षित पूंजी गारंटी आधार के साथ उच्च विकास परिसंपत्ति संचय।',
    startingPrice: '₹1,500/month',
    startingPriceHi: '₹1,500/माह',
    link: '/products'
  },
  'career-education': {
    planName: 'LIC Jeevan Lakshya (Plan 933 — Child Goal)',
    why: 'Start securing future child education funds early to lock in high compounding bonuses.',
    whyHi: 'उच्च चक्रवृद्धि बोनस को लॉक करने के लिए बच्चे की भविष्य की शिक्षा निधि को जल्दी सुरक्षित करना शुरू करें।',
    startingPrice: '₹1,200/month',
    startingPriceHi: '₹1,200/माह',
    link: '/services/child-planning'
  },
  'career-health': {
    planName: 'Star Health Family Health Optima Floater',
    why: 'Protect your hard-earned career savings from sudden high hospitalisation bills.',
    whyHi: 'अचानक आने वाले अस्पताल के बिलों से अपने करियर की गाढ़ी कमाई को बचाएं।',
    startingPrice: '₹500/month',
    startingPriceHi: '₹500/माह',
    link: '/services/health-insurance'
  },
  'career-tax': {
    planName: 'LIC New Jeevan Anand (Plan 915 — 80C Combo)',
    why: 'Enjoy excellent tax-deductible wealth growth while retaining whole life protection.',
    whyHi: 'आजीवन सुरक्षा बनाए रखते हुए उत्कृष्ट कर-कटौती योग्य धन वृद्धि का आनंद लें।',
    startingPrice: '₹1,000/month',
    startingPriceHi: '₹1,000/माह',
    link: '/services/tax-planning'
  },

  // Married (married)
  'married-protection': {
    planName: 'LIC Tech Term + Star Health Assured + Jeevan Anand',
    why: 'Provide your partner complete income replacement protection and a permanent legacy.',
    whyHi: 'अपने साथी को पूर्ण आय प्रतिस्थापन सुरक्षा और एक स्थायी विरासत प्रदान करें।',
    startingPrice: '₹1,800/month',
    startingPriceHi: '₹1,800/माह',
    link: '/services/life-insurance'
  },
  'married-wealth': {
    planName: 'LIC Jeevan Utsav (Plan 871 — Guaranteed Payout)',
    why: 'Get guaranteed 10% of Sum Assured every year after premium paying term for life.',
    whyHi: 'प्रीमियम भुगतान अवधि के बाद जीवन भर हर साल बीमा राशि का 10% गारंटीड भुगतान पाएं।',
    startingPrice: '₹2,500/month',
    startingPriceHi: '₹2,500/माह',
    link: '/products'
  },
  'married-education': {
    planName: 'LIC Jeevan Lakshya Child Milestone Combo',
    why: 'Set up an iron-clad education shield for your prospective children early in marriage.',
    whyHi: 'शादी के शुरुआती दिनों में ही अपने भविष्य के बच्चों के लिए एक ठोस शिक्षा सुरक्षा चक्र स्थापित करें।',
    startingPrice: '₹1,500/month',
    startingPriceHi: '₹1,500/माह',
    link: '/services/child-planning'
  },
  'married-health': {
    planName: 'Star Health Family Health Optima (Husband + Wife)',
    why: 'Protects both of you with robust modern day care benefits and maternity covers.',
    whyHi: 'मजबूत डे-केयर लाभों और मैटरनिटी कवर के साथ आप दोनों को सुरक्षा प्रदान करता है।',
    startingPrice: '₹900/month',
    startingPriceHi: '₹900/माह',
    link: '/services/health-insurance'
  },
  'married-tax': {
    planName: 'LIC Jeevan Anand High Saving (Sec 80C & 10(10D))',
    why: 'Optimize standard deductions while securing a dual-life protection shield.',
    whyHi: 'दोहरे जीवन सुरक्षा कवच को सुरक्षित करते हुए मानक टैक्स कटौती का पूरा लाभ उठाएं।',
    startingPrice: '₹1,500/month',
    startingPriceHi: '₹1,500/माह',
    link: '/services/tax-planning'
  },

  // Parent (parent)
  'parent-protection': {
    planName: 'LIC Jeevan Anand + Family Health Floater Cover',
    why: 'Ensures absolute medical and financial protection for your children in your absence.',
    whyHi: 'आपकी अनुपस्थिति में भी आपके बच्चों के लिए पूर्ण चिकित्सा और वित्तीय सुरक्षा सुनिश्चित करता है।',
    startingPrice: '₹2,000/month',
    startingPriceHi: '₹2,000/माह',
    link: '/services/life-insurance'
  },
  'parent-wealth': {
    planName: 'LIC Jeevan Labh (High Bonus Saving Plan)',
    why: 'Build a massive financial corpus for major child marriage or business goals.',
    whyHi: 'बच्चों की शादी या व्यावसायिक लक्ष्यों के लिए एक विशाल वित्तीय कोष का निर्माण करें।',
    startingPrice: '₹2,000/month',
    startingPriceHi: '₹2,000/माह',
    link: '/products'
  },
  'parent-education': {
    planName: 'LIC Jeevan Lakshya (Plan 933 — Parent Premium Waiver)',
    why: 'Provides a Premium Waiver Benefit. If anything happens to parent, all future premiums are waived and policy pays 10% SA every year for child education.',
    whyHi: 'प्रीमियम वेवर लाभ प्रदान करता है। यदि माता-पिता को कुछ होता है, तो भविष्य के सभी प्रीमियम माफ कर दिए जाते हैं और पॉलिसी हर साल 10% भुगतान करती है।',
    startingPrice: '₹1,800/month',
    startingPriceHi: '₹1,800/माह',
    link: '/services/child-planning'
  },
  'parent-health': {
    planName: 'Star Health Family Health Optima (2 Adults + Children)',
    why: 'Cashless access across 14,000+ top hospitals with child critical care coverage.',
    whyHi: 'बच्चों की क्रिटिकल केयर कवरेज के साथ 14,000+ शीर्ष अस्पतालों में कैशलेस सुविधा।',
    startingPrice: '₹1,200/month',
    startingPriceHi: '₹1,200/माह',
    link: '/services/health-insurance'
  },
  'parent-tax': {
    planName: 'LIC Jeevan Anand Child Future Combo',
    why: 'Save tax under 80C while building a completely tax-free fund for milestones under 10(10D).',
    whyHi: '80C के तहत टैक्स बचाएं और साथ ही 10(10D) के तहत भविष्य के लक्ष्यों के लिए पूरी तरह से टैक्स-फ्री फंड बनाएं।',
    startingPrice: '₹1,800/month',
    startingPriceHi: '₹1,800/माह',
    link: '/services/tax-planning'
  },

  // Midcareer (midcareer)
  'midcareer-protection': {
    planName: 'LIC Tech Term + Active Liability Cover Combo',
    why: 'Higher coverage bracket supporting active home loans, business liabilities and family security.',
    whyHi: 'सक्रिय गृह ऋण, व्यावसायिक देनदारियों और पारिवारिक सुरक्षा का समर्थन करने वाला उच्च कवरेज ब्रैकेट।',
    startingPrice: '₹2,500/month',
    startingPriceHi: '₹2,500/माह',
    link: '/services/life-insurance'
  },
  'midcareer-wealth': {
    planName: 'LIC Jeevan Labh (25 Years Term) / ULIP Growth Option',
    why: 'Optimize high savings rate with secured returns and market growth combo.',
    whyHi: 'सुरक्षित रिटर्न और बाजार विकास संयोजन के साथ उच्च बचत दर का अनुकूलन करें।',
    startingPrice: '₹3,000/month',
    startingPriceHi: '₹3,000/माह',
    link: '/products'
  },
  'midcareer-education': {
    planName: 'LIC Jeevan Lakshya Premium Target Fund',
    why: 'Guaranteed massive fund ready for premium college education in India or abroad.',
    whyHi: 'भारत या विदेश में प्रीमियम कॉलेज शिक्षा के लिए तैयार गारंटीकृत विशाल फंड।',
    startingPrice: '₹2,500/month',
    startingPriceHi: '₹2,500/माह',
    link: '/services/child-planning'
  },
  'midcareer-health': {
    planName: 'Star Health Assured Premium (High Sum Assured)',
    why: 'Advanced health protection covering modern procedures, cardiac care, and robotic surgery.',
    whyHi: 'आधुनिक चिकित्सा प्रक्रियाओं, कार्डियक केयर और रोबोटिक सर्जरी को कवर करने वाला उन्नत स्वास्थ्य सुरक्षा कवच।',
    startingPrice: '₹1,500/month',
    startingPriceHi: '₹1,500/माह',
    link: '/services/health-insurance'
  },
  'midcareer-tax': {
    planName: 'LIC New Jeevan Anand Max Saver Combo',
    why: 'Maximize annual tax savings and build a heavy tax-exempt payout legacy.',
    whyHi: 'वार्षिक टैक्स बचत को अधिकतम करें और एक भारी कर-मुक्त भुगतान विरासत का निर्माण करें।',
    startingPrice: '₹2,000/month',
    startingPriceHi: '₹2,000/माह',
    link: '/services/tax-planning'
  },

  // Retirement (retirement)
  'retirement-protection': {
    planName: 'LIC New Jeevan Anand Whole Life Legacy Combo',
    why: 'Ensures lifelong coverage support so your hard-earned legacy is passed down securely.',
    whyHi: 'आजीवन कवरेज सहायता सुनिश्चित करता है ताकि आपकी गाढ़ी कमाई की विरासत सुरक्षित रूप से आगे बढ़े।',
    startingPrice: '₹3,000/month',
    startingPriceHi: '₹3,000/माह',
    link: '/services/life-insurance'
  },
  'retirement-wealth': {
    planName: 'LIC New Jeevan Shanti (Guaranteed Deferred Annuity Plan)',
    why: 'Ensure guaranteed lifelong regular pension payouts for total self-reliance during retirement.',
    whyHi: 'सेवानिवृत्ति के दौरान कुल आत्मनिर्भरता के लिए गारंटीकृत आजीवन नियमित पेंशन भुगतान सुनिश्चित करें।',
    startingPrice: '₹4,000/month',
    startingPriceHi: '₹4,000/माह',
    link: '/services/retirement'
  },
  'retirement-education': {
    planName: 'LIC Jeevan Lakshya Grandchild Milestone Saver',
    why: 'Leave a guaranteed educational funding legacy directly in the name of your grandchildren.',
    whyHi: 'सीधे अपने पोते-पोतियों के नाम पर एक गारंटीकृत शैक्षणिक वित्तपोषण विरासत छोड़ें।',
    startingPrice: '₹3,000/month',
    startingPriceHi: '₹3,000/माह',
    link: '/services/child-planning'
  },
  'retirement-health': {
    planName: 'Star Health Senior Citizen Red Carpet Cover',
    why: 'Specialized diagnostic and hospitalisation cover for seniors with zero pre-screening requirements.',
    whyHi: 'बिना किसी प्री-स्क्रीनिंग आवश्यकताओं के वरिष्ठ नागरिकों के लिए विशेष नैदानिक ​​और अस्पताल में भर्ती कवर।',
    startingPrice: '₹2,000/month',
    startingPriceHi: '₹2,000/माह',
    link: '/services/health-insurance'
  },
  'retirement-tax': {
    planName: 'LIC Deferred Pension Tax-Saver Basket',
    why: 'Safeguard your retirement wealth from heavy late-career tax brackets.',
    whyHi: 'देर से करियर के भारी कर स्लैब से अपनी सेवानिवृत्ति संपत्ति की रक्षा करें।',
    startingPrice: '₹3,000/month',
    startingPriceHi: '₹3,000/माह',
    link: '/services/tax-planning'
  }
}

export default function InsuranceQuizPage() {
  const { t, lang } = useLang()
  const q = t.insuranceQuiz || {}

  const [step, setStep] = useState(1) // 1 to 5: Quiz Steps, 6: Results
  const [answers, setAnswers] = useState({
    lifeStage: '',
    concern: '',
    income: '',
    insuranceStatus: '',
  })

  // Lead capture state
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [hasSharedDetails, setHasSharedDetails] = useState(false)

  // Options lists bilingual
  const lifeStages = [
    { key: 'career', icon: '🎓', en: 'Just started career (22-28)', hi: 'करियर की शुरुआत (22-28)' },
    { key: 'married', icon: '💑', en: 'Newly married (25-35)', hi: 'नवविवाहित (25-35)' },
    { key: 'parent', icon: '👶', en: 'Parent with young kids (28-45)', hi: 'छोटे बच्चों के माता-पिता (28-45)' },
    { key: 'midcareer', icon: '🏠', en: 'Mid-career building wealth (35-50)', hi: 'मिड-करियर धन निर्माण (35-50)' },
    { key: 'retirement', icon: '🧓', en: 'Planning retirement (45-60)', hi: 'रिटायरमेंट की योजना (45-60)' },
  ]

  const concerns = [
    { key: 'protection', icon: '🛡️', en: 'Family protection if something happens to me', hi: 'मेरे बाद परिवार की वित्तीय सुरक्षा' },
    { key: 'wealth', icon: '💰', en: 'Building wealth for the future', hi: 'भविष्य के लिए धन का निर्माण' },
    { key: 'education', icon: '🎓', en: "Children's education savings", hi: 'बच्चों की उच्च शिक्षा के लिए बचत' },
    { key: 'health', icon: '🏥', en: 'Medical emergency coverage', hi: 'मेडिकल इमरजेंसी/इलाज का खर्च' },
    { key: 'tax', icon: '📈', en: 'Tax saving under Sec 80C', hi: 'धारा 80C के तहत टैक्स बचत' },
  ]

  const incomes = [
    { key: 'low', label: '₹15,000 - ₹30,000' },
    { key: 'medium', label: '₹30,000 - ₹60,000' },
    { key: 'high', label: '₹60,000 - ₹1,00,000' },
    { key: 'premium', label: '₹1,00,000+' },
  ]

  const insuranceStatuses = [
    { key: 'none', icon: '❌', en: 'No insurance', hi: 'कोई बीमा नहीं है' },
    { key: 'group', icon: '📄', en: 'Only employer group insurance', hi: 'केवल कंपनी का ग्रुप बीमा' },
    { key: 'life', icon: '✅', en: 'Have LIC or other life insurance', hi: 'LIC या अन्य जीवन बीमा है' },
    { key: 'both', icon: '✅✅', en: 'Have both life and health insurance', hi: 'जीवन बीमा और स्वास्थ्य बीमा दोनों हैं' },
  ]

  const handleSelectOption = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }))
    // Automatically transition to next step with pure CSS feel
    setTimeout(() => {
      setStep(prev => prev + 1)
    }, 200)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!leadName.trim() || leadName.trim().length < 2) {
      setFormError(lang === 'en' ? 'Please enter your full name.' : 'कृपया अपना पूरा नाम दर्ज करें।')
      return
    }

    if (!/^\d{10}$/.test(leadPhone)) {
      setFormError(lang === 'en' ? 'Please enter a valid 10-digit mobile number.' : 'कृपया एक वैध 10-अंकों का मोबाइल नंबर दर्ज करें।')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          mobile: leadPhone,
          intent: 'insurance-quiz',
          source: 'insurance-quiz',
          message: JSON.stringify({
            answers,
            language: lang,
          }),
        }),
      })

      if (!res.ok) {
        throw new Error('Submission failed')
      }

      setHasSharedDetails(true)
      setStep(6) // Transition to results
    } catch (err) {
      console.error(err)
      setFormError(lang === 'en' ? 'Failed to submit details. Try skipping.' : 'विवरण जमा करने में विफल। बिना साझा किए देखें।')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get mapped recommendation based on lifeStage and concern keys
  const mappingKey = `${answers.lifeStage}-${answers.concern}`
  const rec: Recommendation = RECOMMENDATIONS[mappingKey] || RECOMMENDATIONS['career-protection']

  const isHi = lang === 'hi'
  const planTitleText = isHi ? rec.planName : rec.planName
  const whyText = isHi ? rec.whyHi : rec.why
  const priceText = isHi ? rec.startingPriceHi : rec.startingPrice
  const whatsappUrl = `https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
    `${q.whatsappQuery || 'Hi Ajay ji, I took your Insurance Quiz and got matched with'} ${rec.planName}.`
  )}`

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-lg w-full px-4 md:px-6">
        
        {/* PROGRESS BAR & NAVIGATION (STEPS 1-4) */}
        {step >= 1 && step <= 4 && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-navy hover:shadow-sm transition-all flex items-center justify-center cursor-pointer ${
                step === 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex-1 mx-4">
              {/* Progress track */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mt-1.5">
                {lang === 'en' ? `Question ${step} of 4` : `प्रश्न ${step} का 4`}
              </p>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-navy text-white text-xs font-bold font-display shadow-sm">
              {step}/4
            </div>
          </div>
        )}

        {/* CONTAINER FOR QUIZ SCREENS WITH CSS ANIMATIONS */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 relative overflow-hidden transition-all duration-300">
          
          {/* STEP 1: LIFE STAGE */}
          {step === 1 && (
            <div className="animate-[slideIn_0.3s_ease-out_forwards]">
              <h1 className="font-display font-bold text-2xl text-navy mb-2 leading-tight">
                {q.step1Title}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                If you want to know <strong className="text-gold">which insurance do I need</strong>, let&apos;s start by identifying your current life stage. This helps in tailoring the perfect <strong className="text-gold">insurance recommendation</strong> and finding the <strong className="text-gold">best insurance for me</strong>.
              </p>
              
              <div className="space-y-2.5">
                {lifeStages.map(stage => (
                  <button
                    key={stage.key}
                    onClick={() => handleSelectOption('lifeStage', stage.key)}
                    className="w-full min-h-[56px] flex items-center gap-4 px-4 py-3 rounded-2xl border-2 border-gray-100 hover:border-gold/50 bg-white hover:bg-gold/5 text-left transition-all duration-200 group active:scale-[0.99] cursor-pointer"
                  >
                    <span className="text-2xl w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                      {stage.icon}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-navy transition-colors">
                      {isHi ? stage.hi : stage.en}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PRIMARY CONCERN */}
          {step === 2 && (
            <div className="animate-[slideIn_0.3s_ease-out_forwards]">
              <h2 className="font-display font-bold text-2xl text-navy mb-2 leading-tight">
                {q.step2Title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Every family prioritizes their wealth differently. Select your absolute primary financial goal.
              </p>

              <div className="space-y-2.5">
                {concerns.map(concern => (
                  <button
                    key={concern.key}
                    onClick={() => handleSelectOption('concern', concern.key)}
                    className="w-full min-h-[56px] flex items-center gap-4 px-4 py-3 rounded-2xl border-2 border-gray-100 hover:border-gold/50 bg-white hover:bg-gold/5 text-left transition-all duration-200 group active:scale-[0.99] cursor-pointer"
                  >
                    <span className="text-2xl w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                      {concern.icon}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-navy transition-colors">
                      {isHi ? concern.hi : concern.en}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MONTHLY INCOME */}
          {step === 3 && (
            <div className="animate-[slideIn_0.3s_ease-out_forwards]">
              <h2 className="font-display font-bold text-2xl text-navy mb-2 leading-tight">
                {q.step3Title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                This helps us recommend plans that fit easily within your budget. Let&apos;s map your income range.
              </p>

              <div className="space-y-2.5">
                {incomes.map(income => (
                  <button
                    key={income.key}
                    onClick={() => handleSelectOption('income', income.key)}
                    className="w-full min-h-[56px] flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-gray-100 hover:border-gold/50 bg-white hover:bg-gold/5 text-left transition-all duration-200 group active:scale-[0.99] cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gold flex items-center justify-center flex-shrink-0 transition-colors">
                      <span className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-gold transition-colors" />
                    </div>
                    <span className="flex-1 text-sm font-bold text-gray-800 group-hover:text-navy transition-colors">
                      {income.label}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: INSURANCE STATUS */}
          {step === 4 && (
            <div className="animate-[slideIn_0.3s_ease-out_forwards]">
              <h2 className="font-display font-bold text-2xl text-navy mb-2 leading-tight">
                {q.step4Title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Tell us about your current coverage to check if you have any protective gaps.
              </p>

              <div className="space-y-2.5">
                {insuranceStatuses.map(status => (
                  <button
                    key={status.key}
                    onClick={() => handleSelectOption('insuranceStatus', status.key)}
                    className="w-full min-h-[56px] flex items-center gap-4 px-4 py-3 rounded-2xl border-2 border-gray-100 hover:border-gold/50 bg-white hover:bg-gold/5 text-left transition-all duration-200 group active:scale-[0.99] cursor-pointer"
                  >
                    <span className="text-xl w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                      {status.icon}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-navy transition-colors">
                      {isHi ? status.hi : status.en}
                    </span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: LEAD CAPTURE FORM */}
          {step === 5 && (
            <div className="animate-[slideIn_0.3s_ease-out_forwards]">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold/10 border-2 border-gold/25 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Sparkles size={28} className="text-gold" />
                </div>
                <h2 className="font-display font-bold text-2xl text-navy mb-2 leading-tight">
                  {q.step5Title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                  {q.step5Subtitle}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="quiz-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {lang === 'en' ? 'Your Name *' : 'आपका नाम *'}
                  </label>
                  <input
                    id="quiz-name"
                    type="text"
                    required
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/40 bg-white"
                    placeholder="Ramesh Sharma"
                  />
                </div>

                <div>
                  <label htmlFor="quiz-phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {lang === 'en' ? 'WhatsApp Number *' : 'व्हाट्सएप नंबर *'}
                  </label>
                  <input
                    id="quiz-phone"
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-navy/40 bg-white"
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>

                {formError && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? 'Generating...' : q.ctaShow}
                  <ArrowRight size={14} />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(6) }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline cursor-pointer"
                  >
                    {q.skipLink}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 6: RESULTS SCREEN */}
          {step === 6 && (
            <div className="animate-[slideIn_0.3s_ease-out_forwards]">
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  <Check size={10} /> {lang === 'en' ? 'Matched' : 'मैच मिला'}
                </span>
                <h2 className="font-display font-bold text-2xl text-navy mb-2 leading-tight">
                  {q.resultsTitle}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                  {q.resultsSubtitle}
                </p>
              </div>

              {/* Recommendation Card */}
              <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-gold/15 rounded-2xl p-5 mb-6">
                <div className="text-[10px] font-extrabold text-gold tracking-widest uppercase mb-1">
                  {q.recommendedPlan}
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl text-navy leading-snug mb-2">
                  {planTitleText}
                </h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                  {whyText}
                </p>
                <div className="flex items-baseline justify-between border-t border-gold/10 pt-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block leading-none">
                      {q.startingFrom}
                    </span>
                    <span className="font-display font-extrabold text-base text-navy mt-1 block leading-none">
                      {priceText}
                    </span>
                  </div>
                  <Link
                    href={rec.link}
                    className="inline-flex items-center gap-1.5 bg-navy text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-navy/90 transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'Explore Plan' : 'प्लान देखें'}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Next Steps / Consultation Call */}
              <div className="space-y-3 mb-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={16} className="fill-current" />
                  {lang === 'en' ? 'Talk to Ajay Sir on WhatsApp' : 'व्हाट्सएप पर अजय सर से बात करें'}
                </a>
                <a
                  href={`tel:${ADVISOR_PHONE}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-navy font-bold py-3 px-4 rounded-xl text-xs md:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  📞 {lang === 'en' ? 'Call Ajay Sir Directly' : 'अजय सर को सीधे कॉल करें'}
                </a>
              </div>

              {/* Share Component */}
              <div className="border-t border-gray-100 pt-5 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {lang === 'en' ? 'Share this quiz with friends' : 'इस क्विज़ को दोस्तों के साथ साझा करें'}
                </p>
                <WhatsAppShare 
                  text={`${q.shareText || 'Check your insurance needs (2 min):'}`}
                  url="https://www.poddarwealth.com/insurance-quiz"
                  className="w-full justify-center py-3 text-xs md:text-sm"
                />
              </div>

              {/* Retake Button */}
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setStep(1)
                    setAnswers({ lifeStage: '', concern: '', income: '', insuranceStatus: '' })
                    setLeadName('')
                    setLeadPhone('')
                    setHasSharedDetails(false)
                    setFormError('')
                  }}
                  className="text-xs text-navy/60 hover:text-navy underline transition-colors cursor-pointer"
                >
                  ← {lang === 'en' ? 'Retake Quiz' : 'क्विज़ दोबारा लें'}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Global Keyframe CSS transitions */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        ` }} />

      </div>
    </div>
  )
}
