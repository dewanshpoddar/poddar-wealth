'use client'

import { useLang } from '@/lib/LangContext'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { User, Phone, MessageSquare, Shield, Info, Sparkles, MessageCircle, FileText } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function PolicyRevivalPage() {
  const { lang } = useLang()

  const fields = [
    { name: 'name' as const, label: lang === 'en' ? 'Full Name' : 'पूरा नाम', icon: <User size={12} />, placeholder: lang === 'en' ? 'Ramesh Sharma' : 'रमेश शर्मा', required: true },
    { name: 'mobile' as const, label: lang === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर', icon: <Phone size={12} />, placeholder: '10-digit number', required: true, type: 'tel' },
    { name: 'message' as const, label: lang === 'en' ? 'Policy Number & Lapse Duration' : 'पॉलिसी नंबर और बंद होने की अवधि', icon: <MessageSquare size={12} />, type: 'textarea', placeholder: lang === 'en' ? 'Provide policy details if available...' : 'उपलब्ध हो तो पॉलिसी का विवरण प्रदान करें...' }
  ]

  const isHi = lang === 'hi'

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      
      {/* Hero Header */}
      <section className="bg-navy text-white py-14 px-6 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] mb-12">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            {isHi ? 'एलआईसी पॉलिसी पुनरुद्धार' : 'LIC Policy Revival'}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {isHi 
              ? 'बंद एलआईसी पॉलिसी को कैसे शुरू करें - सम्पूर्ण गाइड 2026' 
              : 'How to Revive a Lapsed LIC Policy - Complete Guide 2026'}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'अपनी बंद हो चुकी एलआईसी पॉलिसी को दोबारा सक्रिय करने के नियम, आवश्यक दस्तावेज, लगने वाला ब्याज और पूरी प्रक्रिया को समझें।'
              : 'Understand the rules, required documents, interest costs, and step-by-step process to successfully reinstate your lapsed LIC policy.'}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SEO First Paragraph */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-8 border-l-4 border-gold pl-4 italic">
          {isHi ? (
            <>क्या आपकी कोई एलआईसी पॉलिसी समय पर प्रीमियम न भरने के कारण बंद हो गई है? यदि आप सोच रहे हैं कि <strong>LIC policy revival</strong> कैसे किया जाता है या <strong>how to revive lapsed LIC policy</strong> की क्या नियम व प्रक्रिया है, तो यह लेख आपके लिए बेहद मददगार साबित होगा। गोरखपुर में पिछले 31 वर्षों से 5000+ परिवारों को बीमा सेवाएं दे रहे वरिष्ठ एमडीआरटी सलाहकार अजय कुमार पोद्दार की मदद से आप अपनी पॉलिसी को तुरंत बहाल कर सकते हैं।</>
          ) : (
            <>Has your active LIC policy lapsed due to unpaid premiums beyond the grace period? If you are looking to understand the core steps for a **LIC policy revival** or searching for a clear guide on **how to revive lapsed LIC policy** without losing benefits, you have landed in the right place. Prepared by Gorakhpur&apos;s senior MDRT advisor Mr. Ajay Kumar Poddar.</>
          )}
        </p>

        {/* Section 1: When Does a LIC Policy Lapse? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">01.</span> {isHi ? 'एलआईसी पॉलिसी कब लैप्स (बंद) होती है?' : 'When Does a LIC Policy Lapse?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>जब आप अपनी पॉलिसी की प्रीमियम देय तिथि (Due Date) के बाद भी <strong>ग्रेस पीरियड (Grace Period)</strong> के भीतर भुगतान नहीं करते हैं, तो आपकी पॉलिसी &apos;लैप्स&apos; यानी बंद हो जाती है। एलआईसी ग्रेस पीरियड निम्नलिखित तरीके से प्रदान करता है:</>
              ) : (
                <>If you fail to pay your premium within the designated **Grace Period** after the official due date, your insurance policy status changes to &apos;Lapsed&apos;. LIC provides the following standard grace periods:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {isHi ? (
                <>
                  <li><strong>वार्षिक/अर्धवार्षिक/त्रैमासिक भुगतान:</strong> देय तिथि के बाद 30 दिन का ग्रेस पीरियड।</li>
                  <li><strong>मासिक भुगतान:</strong> देय तिथि के बाद केवल 15 दिन का ग्रेस पीरियड।</li>
                </>
              ) : (
                <>
                  <li><strong>Yearly, Half-yearly, or Quarterly Modes:</strong> 30 calendar days from the due date.</li>
                  <li><strong>Monthly Modes:</strong> 15 calendar days from the due date.</li>
                </>
              )}
            </ul>
            <p className="bg-red-50 text-red-800 rounded-2xl p-4 text-xs md:text-sm border border-red-200 mt-2">
              {isHi ? (
                <><strong>सावधान:</strong> पॉलिसी लैप्स होने के बाद, आपका बीमा कवर बंद हो जाता है। यदि पॉलिसी बंद होने के दौरान कोई अप्रिय घटना होती है, तो नामांकित व्यक्ति को मृत्यु लाभ (Death Benefit) का भुगतान नहीं किया जाता है।</>
              ) : (
                <><strong>Warning:</strong> Once a policy lapses, your active life risk cover is suspended. If any unfortunate event occurs while the policy is in a lapsed status, the nominee will not receive any death claim benefits.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 2: Can You Revive a Lapsed Policy? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">02.</span> {isHi ? 'क्या बंद पॉलिसी को दोबारा शुरू किया जा सकता है?' : 'Can You Revive a Lapsed Policy?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <><strong>हाँ, बिल्कुल!</strong> एलआईसी अपने ग्राहकों को बंद हो चुकी पॉलिसियों को पुनर्जीवित (Revive) करने का बेहतरीन अवसर प्रदान करता है। सामान्य नियमों के अनुसार, आप अपनी पहली बिना भुगतान की गई प्रीमियम (FUP) की तारीख से **5 वर्षों के भीतर** पॉलिसी को कभी भी पुनर्जीवित करा सकते हैं।</>
              ) : (
                <><strong>Yes, absolutely!</strong> LIC allows policyholders to reinstate their lapsed plans. Under standard terms, you can revive your lapsed policy anytime **within 5 consecutive years** from the date of the First Unpaid Premium (FUP).</>
              )}
            </p>
            <p>
              {isHi ? (
                <>इसके अतिरिक्त, एलआईसी समय-समय पर विशेष पुनरुद्धार अभियान (Special Revival Campaigns) भी चलाता है, जिसमें ग्राहकों को विलंब शुल्क (late fee) में भारी छूट दी जाती है।</>
              ) : (
                <>In addition, LIC periodically launches Special Revival Campaigns where they offer significant concessions on late fees and interest penalties to make reinstatement affordable.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 3: Documents Required for Revival */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <FileText className="text-gold" size={20} /> {isHi ? 'पुनरुद्धार के लिए आवश्यक दस्तावेज' : 'Documents Required for Revival'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-3 leading-relaxed">
            <p>
              {isHi ? (
                <>अपनी पॉलिसी को दोबारा शुरू करने के लिए आपको निम्नलिखित बुनियादी चीजों की आवश्यकता होगी:</>
              ) : (
                <>To initiate the policy revival process, you generally need to organize the following documentation:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {isHi ? (
                <>
                  <li><strong>मूल पॉलिसी बॉण्ड (Original Policy Bond):</strong> आपकी मूल बीमा पॉलिसी की प्रति (यदि खो गया हो तो डुप्लीकेट)।</li>
                  <li><strong>पुनरुद्धार आवेदन पत्र (Revival Application Form):</strong> एलआईसी का आधिकारिक फॉर्म (उदा. Form 680 या 512)।</li>
                  <li><strong>स्वास्थ्य का व्यक्तिगत विवरण (Personal Statement of Health):</strong> यदि पॉलिसी 6 महीने से अधिक समय से बंद है, तो अच्छे स्वास्थ्य की स्व-घोषणा देनी होगी।</li>
                  <li><strong>मेडिकल रिपोर्ट (Medical Reports):</strong> यदि पॉलिसी 2 साल से अधिक समय से बंद है या बीमा राशि (Sum Assured) बहुत अधिक है, तो एलआईसी अधिकृत डॉक्टर से मेडिकल चेकअप की मांग कर सकती है।</li>
                  <li><strong>बकाया प्रीमियम और ब्याज राशि:</strong> सभी लंबित प्रीमियमों का एकमुश्त भुगतान ब्याज सहित करना होगा।</li>
                </>
              ) : (
                <>
                  <li><strong>Original Policy Bond:</strong> The official contract document (or a certified duplicate copy if lost).</li>
                  <li><strong>Revival Application Form:</strong> The appropriate LIC declaration form (e.g., Form 680 or Form 512).</li>
                  <li><strong>Personal Statement of Health (DGH):</strong> If the policy has been lapsed for over 6 months, a signed declaration of good health is mandatory.</li>
                  <li><strong>Medical Examination Reports:</strong> Required if the lapse duration exceeds 2 years or if the Sum Assured falls under high-risk parameters.</li>
                  <li><strong>Accumulated Premium & Late Fees:</strong> The total sum of unpaid premiums along with interest charges must be paid upfront.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 4: Step-by-Step Revival Process */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">03.</span> {isHi ? 'चरण-दर-चरण पुनरुद्धार प्रक्रिया' : 'Step-by-Step Revival Process'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 my-6">
            {[
              { step: "01", titleEn: "Consult Agent", titleHi: "सलाह लें", descEn: "Contact Ajay sir with your policy number.", descHi: "अजय सर से संपर्क कर पॉलिसी स्टेटस जानें।" },
              { step: "02", titleEn: "Fill Forms", titleHi: "फॉर्म भरें", descEn: "Complete health declaration & forms.", descHi: "स्वास्थ्य स्व-घोषणा फॉर्म भरें।" },
              { step: "03", titleEn: "Pay Due", titleHi: "भुगतान करें", descEn: "Pay all pending premiums with late fees.", descHi: "ब्याज और प्रीमियम का भुगतान करें।" },
              { step: "04", titleEn: "Underwriting", titleHi: "सत्यापन", descEn: "LIC reviews documents & health reports.", descHi: "एलआईसी फॉर्म का सत्यापन करेगी।" },
              { step: "05", titleEn: "Restored", titleHi: "पॉलिसी बहाल", descEn: "Coverage is active & benefits resume.", descHi: "पॉलिसी दोबारा शुरू और कवर सक्रिय।" }
            ].map((p, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center flex flex-col justify-between hover:shadow-sm transition-shadow">
                <span className="font-mono font-extrabold text-lg text-gold block mb-1">Step {p.step}</span>
                <h3 className="font-bold text-navy text-sm mb-1.5">{isHi ? p.titleHi : p.titleEn}</h3>
                <p className="text-slate-500 text-[10.5px] leading-relaxed">{isHi ? p.descHi : p.descEn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: How Much Will Revival Cost? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">04.</span> {isHi ? 'पुनरुद्धार में कितना खर्च आएगा?' : 'How Much Will Revival Cost?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>पॉलिसी को दोबारा शुरू करने की कुल लागत में **सभी लंबित प्रीमियम** और उन पर लगने वाला **वार्षिक ब्याज** शामिल होता है। एलआईसी वर्तमान में विलंबित प्रीमियम पर लगभग **9% से 10% प्रति वर्ष** की दर से चक्रवृद्धि ब्याज चार्ज करता है।</>
              ) : (
                <>The final cost to revive your policy is the sum of **all pending premiums** plus **compound interest** applied by LIC. The standard interest rate ranges between **9% to 10% per annum**, calculated daily on the outstanding amount.</>
              )}
            </p>
            
            {/* Calculation Example Box */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-gold/15 rounded-2xl p-5">
              <span className="font-extrabold text-navy text-sm md:text-base block mb-2">
                {isHi ? 'उदाहरण लागत गणना:' : 'Example Revival Cost Calculation:'}
              </span>
              {isHi ? (
                <div className="text-xs md:text-sm space-y-1 font-medium">
                  <p>• <strong>वार्षिक प्रीमियम:</strong> ₹20,000</p>
                  <p>• <strong>बंद होने की अवधि (Lapsed Duration):</strong> 2 वर्ष</p>
                  <p>• <strong>बकाया प्रीमियम (2 वर्ष):</strong> ₹20,000 × 2 = ₹40,000</p>
                  <p>• <strong>अनुमानित ब्याज (9.5% p.a. पर):</strong> ~₹3,500</p>
                  <p>• <strong>कुल अनुमानित भुगतान:</strong> <strong className="text-gold">~₹43,500</strong></p>
                </div>
              ) : (
                <div className="text-xs md:text-sm space-y-1 font-medium">
                  <p>• **Annual Premium:** ₹20,000</p>
                  <p>• **Lapsed Duration:** 2 Years</p>
                  <p>• **Principal Due Premium:** ₹20,000 × 2 = ₹40,000</p>
                  <p>• **Estimated Interest Penalty (at 9.5%):** ~₹3,500</p>
                  <p>• **Total Approximate Cost to Revive:** <strong className="text-gold">~₹43,500</strong></p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 6: Ajay Sir Can Handle Your Revival */}
        <section className="bg-gradient-to-br from-amber-50/50 to-white border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-gold" size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-navy mb-1.5">
              {isHi ? 'पॉलिसी पुनरुद्धार को लेकर उलझन में हैं?' : 'Need Help Reviving Your Policy?'}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              {isHi
                ? 'एलआईसी की कागजी कार्रवाई जटिल हो सकती है। अजय सर ने सैकड़ों बंद हो चुकी पॉलिसियों को बहाल कराया है, वे पूरी कागजी कार्रवाई खुद संभालेंगे।'
                : 'The paperwork and underwriting clearances can be complex. Ajay sir has reinstated hundreds of lapsed policies for Gorakhpur families.'}
            </p>
          </div>

          <BaseLeadForm
            fields={fields}
            intent="LIC Policy Revival"
            submitText={isHi ? 'अजय सर की सहायता लें →' : 'Request Revival Support from Ajay Sir →'}
            successTitle={isHi ? 'अनुरोध प्राप्त हुआ!' : 'Support Request Received!'}
            successMessage={isHi
              ? 'अजय सर जल्द ही आपसे संपर्क कर आपकी पॉलिसी को बहाल कराने की प्रक्रिया शुरू करेंगे।'
              : 'Ajay sir will contact you within 24 hours to help calculate pending dues and prepare documents.'}
            grid={true}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-100">
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20ji,%20I%20need%20help%20reviving%20my%20lapsed%20LIC%20policy.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircle size={15} className="fill-current" />
              {isHi ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
            </a>
            <a
              href={`tel:${ADVISOR_PHONE}`}
              className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {isHi ? 'कॉल करें' : 'Call Ajay Sir'}
            </a>
          </div>

          {/* Share Block */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {isHi ? 'इसे दोस्तों के साथ साझा करें' : 'Share this revival guide with friends'}
            </p>
            <WhatsAppShare
              text={isHi ? 'बंद हो चुकी एलआईसी पॉलिसी शुरू करने की संपूर्ण गाइड:' : 'Step-by-step guide to revive a lapsed LIC policy:'}
              url="https://www.poddarwealth.com/policy-revival"
              className="w-full justify-center"
            />
          </div>

          {/* Related links */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
              {isHi ? 'संबंधित गाइड' : 'Related Guides'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="/bima-sugam" className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-amber-300 transition-colors">
                <Shield size={14} className="text-amber-500 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-navy block">{isHi ? 'बीमा सुगम पोर्टल' : 'Bima Sugam Portal'}</span>
                  <span className="text-[10px] text-gray-500">{isHi ? 'IRDAI का नया डिजिटल मंच' : 'IRDAI\'s new digital insurance marketplace'}</span>
                </div>
              </a>
              <a href="/lic-bonus" className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-amber-300 transition-colors">
                <Info size={14} className="text-amber-500 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-navy block">{isHi ? 'LIC बोनस दरें 2026' : 'LIC Bonus Rates 2026'}</span>
                  <span className="text-[10px] text-gray-500">{isHi ? 'पुनर्जीवित पॉलिसी पर बोनस जानें' : 'Check bonus on your revived policy'}</span>
                </div>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
