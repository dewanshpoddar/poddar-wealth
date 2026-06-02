'use client'

import { useLang } from '@/lib/LangContext'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { User, Phone, MessageSquare, Shield, HelpCircle, Info, Sparkles, MessageCircle } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function NavJeevanShreePage() {
  const { lang } = useLang()

  const fields = [
    { name: 'name' as const, label: lang === 'en' ? 'Full Name' : 'पूरा नाम', icon: <User size={12} />, placeholder: lang === 'en' ? 'Ramesh Sharma' : 'रमेश शर्मा', required: true },
    { name: 'mobile' as const, label: lang === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर', icon: <Phone size={12} />, placeholder: '10-digit number', required: true, type: 'tel' },
    { name: 'message' as const, label: lang === 'en' ? 'Your Question' : 'आपका सवाल', icon: <MessageSquare size={12} />, type: 'textarea', placeholder: lang === 'en' ? 'Tell us what you want to know...' : 'बताएं कि आप क्या जानना चाहते हैं...' }
  ]

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": lang === 'en' ? "What is LIC Nav Jeevan Shree Plan?" : "एलआईसी नव जीवन श्री प्लान क्या है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "LIC Nav Jeevan Shree is a brand new savings-oriented life insurance plan launched by LIC in 2026. It offers regular and single premium modes, combined with a built-in option for the new Critical Illness Health Rider."
            : "एलआईसी नव जीवन श्री 2026 में एलआईसी द्वारा शुरू किया गया एक बिल्कुल नया बचत-उन्मुख जीवन बीमा प्लान है। यह नियमित और एकल प्रीमियम मोड प्रदान करता है, साथ ही नए क्रिटिकल इलनेस हेल्थ राइडर का विकल्प भी शामिल करता है।"
        }
      },
      {
        "@type": "Question",
        "name": lang === 'en' ? "Who is eligible to purchase Nav Jeevan Shree?" : "नव जीवन श्री खरीदने के लिए कौन पात्र है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "This plan is ideal for risk-averse investors seeking guaranteed returns, savings combined with insurance, and lump-sum investment options. Eligible entry age, term, and sum assured depend on standard LIC guidelines."
            : "यह प्लान उन जोखिम-रहित निवेशकों के लिए आदर्श है जो गारंटीकृत रिटर्न, बीमा के साथ बचत, और एकमुश्त निवेश के विकल्प की तलाश में हैं। पात्र प्रवेश आयु, अवधि और बीमा राशि एलआईसी के मानक दिशानिर्देशों पर निर्भर करती है।"
        }
      },
      {
        "@type": "Question",
        "name": lang === 'en' ? "Does this plan include a critical illness cover?" : "क्या इस प्लान में गंभीर बीमारी का कवर शामिल है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "Yes, you can opt for LIC's new Critical Illness Health Rider with Nav Jeevan Shree to cover major illnesses like cancer, heart attack, stroke, and kidney failure."
            : "हाँ, कैंसर, दिल का दौरा, स्ट्रोक और किडनी फेलियर जैसी गंभीर बीमारियों को कवर करने के लिए आप नव जीवन श्री के साथ एलआईसी का नया क्रिटिकल इलनेस हेल्थ राइडर चुन सकते हैं।"
        }
      }
    ]
  }

  const isHi = lang === 'hi'

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-navy text-white py-14 px-6 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] mb-12">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            <Shield size={12} className="text-gold" /> {isHi ? 'नया एलआईसी प्लान 2026' : 'New LIC Plan 2026'}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {isHi
              ? 'एलआईसी नव जीवन श्री प्लान — सम्पूर्ण जानकारी 2026'
              : 'LIC Nav Jeevan Shree Plan — Complete Details 2026'}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'एलआईसी के नए बचत एवं सुरक्षा प्लान नव जीवन श्री के बारे में जानें। नियम, लाभ, क्रिटिकल इलनेस राइडर और संपूर्ण विवरण।'
              : 'Learn about LIC\'s new savings and protection plan: Nav Jeevan Shree. Rules, features, critical illness rider, and full details.'}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SEO First Paragraph */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-8 border-l-4 border-gold pl-4 italic">
          {isHi ? (
            <>भारतीय जीवन बीमा निगम ने वर्ष 2026 में अपना नया क्रांतिकारी बचत उत्पाद <strong>LIC Nav Jeevan Shree</strong> लॉन्च किया है। यदि आप सुरक्षा और बचत का एक मजबूत मिश्रण ढूंढ रहे हैं, तो यह प्लान आपके लिए बिल्कुल सही है। गोरखपुर के प्रमुख बीमा और वित्तीय विशेषज्ञ अजय कुमार पोद्दार (MDRT, USA) द्वारा नवजीवन श्री के प्रीमियम, राइडर्स और परिपक्वता (maturity) का सम्पूर्ण विश्लेषण नीचे दिया गया है।</>
          ) : (
            <>Life Insurance Corporation of India has launched its brand new savings-oriented product, <strong>LIC Nav Jeevan Shree</strong>, in 2026. If you are looking for a powerful blend of financial protection and guaranteed growth, this plan serves as an excellent option. A complete breakdown of Nav Jeevan Shree rules, riders, premiums, and maturity has been compiled by MDRT Gorakhpur advisor Ajay Kumar Poddar below.</>
          )}
        </p>

        {/* Section 1: What is Nav Jeevan Shree? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">01.</span> {isHi ? 'नव जीवन श्री प्लान क्या है?' : 'What is Nav Jeevan Shree?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <><strong>एलआईसी नव जीवन श्री (LIC Nav Jeevan Shree)</strong> एक गैर-लिंक्ड (Non-linked), व्यक्तिगत, जीवन बीमा बचत योजना है। यह योजना परिवारों को एक सुरक्षित भविष्य के साथ-साथ उत्कृष्ट बचत रिटर्न प्रदान करने के उद्देश्य से डिज़ाइन की गई है। इस योजना की सबसे बड़ी विशेषता यह है कि यह <strong>नियमित प्रीमियम (Regular Premium)</strong> और <strong>एकल प्रीमियम (Single Premium)</strong> दोनों विकल्पों में उपलब्ध है, जिससे एकमुश्त निवेश करने वाले ग्राहकों को भी बेहतरीन लचीलापन मिलता है।</>
              ) : (
                <><strong>LIC Nav Jeevan Shree</strong> is a non-linked, individual, life insurance savings plan designed by LIC in 2026. It serves the dual purpose of protecting your family in the event of an unfortunate incident while systematically building secure wealth for your future goals. A key attraction of this plan is its flexibility, offering both **Regular Premium** paying modes and a **Single Premium** (one-time lump sum) payment option.</>
              )}
            </p>
            <p>
              {isHi ? (
                <>इसके साथ ही, एलआईसी ने इस प्लान के साथ एक विशेष स्वास्थ्य संरक्षण राइडर — <strong>Critical Illness Health Rider</strong> पेश किया है, जो गंभीर बीमारियों की स्थिति में एक बड़ा वित्तीय सहारा बनता है।</>
              ) : (
                <>Additionally, the plan features a highly comprehensive **Critical Illness Health Rider**, which serves as an essential safety net by providing lump-sum financial support upon the diagnosis of major critical illnesses.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 2: Key Features */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">02.</span> {isHi ? 'मुख्य विशेषताएं और लाभ' : 'Key Features & Benefits'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>नव जीवन श्री योजना पारंपरिक बंदोबस्ती (Endowment) संरचना पर काम करती है, जिसमें निम्नलिखित बड़े लाभ शामिल हैं:</>
              ) : (
                <>The Nav Jeevan Shree plan operates on a secure endowment structure, incorporating the following solid benefits:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2.5">
              {isHi ? (
                <>
                  <li><strong>परिपक्वता लाभ (Maturity Benefit):</strong> पॉलिसी अवधि पूरी होने पर, जीवित रहने पर बीमा राशि (Sum Assured) के साथ घोषित एलआईसी बोनस का एकमुश्त भुगतान मिलता है।</li>
                  <li><strong>मृत्यु लाभ (Death Benefit):</strong> पॉलिसी के दौरान दुर्भाग्यपूर्ण मृत्यु होने पर, नामांकित व्यक्ति (Nominee) को एक भारी वित्तीय सुरक्षा राशि प्रदान की जाती है।</li>
                  <li><strong>घोषित बोनस (Declared Bonus):</strong> योजना में एलआईसी के मुनाफे का एक हिस्सा वार्षिक बोनस के रूप में जुड़ता है, जिससे परिपक्वता कोष बड़ा हो जाता है।</li>
                  <li><strong>लोन सुविधा (Loan Facility):</strong> पॉलिसी के सक्रिय होने के 2 वर्ष बाद (नियमित) या तुरंत (एकल प्रीमियम पर) ऋण सुविधा का लाभ उठाया जा सकता है।</li>
                  <li><strong>टैक्स बचत (Tax Benefit):</strong> आयकर अधिनियम की धारा 80C के तहत प्रीमियम पर छूट और धारा 10(10D) के तहत परिपक्वता राशि पूरी तरह कर-मुक्त है।</li>
                </>
              ) : (
                <>
                  <li><strong>Maturity Benefit:</strong> On survival to the end of the policy term, the policyholder receives the full Basic Sum Assured along with accrued bonuses in a lump sum.</li>
                  <li><strong>Death Benefit:</strong> In case of an unfortunate demise during the term, a substantial sum assured is paid to the nominee to secure their lifestyle.</li>
                  <li><strong>Compounding Bonus:</strong> The plan participates in LIC's annual profits by accumulating reversionary bonuses, enhancing the maturity fund value.</li>
                  <li><strong>Loan Facility:</strong> Access liquidity during emergencies through policy loans after 2 years for regular plans, or almost instantly for single premium modes.</li>
                  <li><strong>Tax Savings:</strong> Under Section 80C, premiums paid qualify for tax deductions, and the maturity payout is tax-exempt under Section 10(10D).</li>
                </>
              )}
            </ul>
            <p className="text-slate-500 text-xs md:text-sm mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2">
              <Info size={16} className="text-gold flex-shrink-0 mt-0.5" />
              {isHi ? (
                <><strong>महत्वपूर्ण नोट:</strong> इस प्लान का वास्तविक प्रीमियम आपकी उम्र, बीमा राशि और पॉलिसी अवधि पर निर्भर करता है। कृपया अपने वास्तविक प्रीमियम की गणना के लिए हमारे प्रीमियम कैलकुलेटर का उपयोग करें या व्यक्तिगत कोटेशन के लिए सीधे अजय सर से संपर्क करें।</>
              ) : (
                <><strong>Important Note:</strong> Exact premium rates depend on entry age, chosen sum assured, and policy term. Please utilize our custom premium calculator or contact Ajay sir directly for an accurate personalized quotation.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 3: Who Should Buy This Plan? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">03.</span> {isHi ? 'यह प्लान किसके लिए सबसे उपयुक्त है?' : 'Who Should Buy This Plan?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>नव जीवन श्री विशेष रूप से उन लोगों के लिए डिज़ाइन किया गया है जो:</>
              ) : (
                <>The Nav Jeevan Shree plan is highly recommended for:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {isHi ? (
                <>
                  <li><strong>जोखिम-मुक्त निवेशक:</strong> जो शेयर बाजार के उतार-चढ़ाव से दूर रहकर सरकारी गारंटीड रिटर्न चाहते हैं।</li>
                  <li><strong>सुरक्षा + बचत चाहने वाले:</strong> जो एक ही योजना में अपने परिवार की जीवन सुरक्षा और भविष्य के वित्तीय लक्ष्यों (बच्चों की शिक्षा, शादी) को पूरा करना चाहते हैं।</li>
                  <li><strong>एकमुश्त निवेशक (Lump sum):</strong> जो एकल प्रीमियम विकल्प के जरिए अपना अतिरिक्त पैसा सुरक्षित रूप से पार्क कर टैक्स बचाना चाहते हैं।</li>
                </>
              ) : (
                <>
                  <li><strong>Risk-Averse Investors:</strong> Individuals seeking stable, sovereign-backed returns without exposing their hard-earned capital to stock market volatility.</li>
                  <li><strong>Dual Goal Seekers:</strong> Families wanting to combine essential life protection with systematic wealth building for future milestones like children's higher education.</li>
                  <li><strong>Lump Sum Investors:</strong> Wealthy individuals wanting to securely park a lump sum in the Single Premium option while securing immediate tax advantages.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 4: Critical Illness Rider (New) */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">04.</span> {isHi ? 'नया क्रिटिकल इलनेस हेल्थ राइडर' : 'Critical Illness Rider (New)'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>एलआईसी का यह नया <strong>Critical Illness Health Rider</strong> एक बहुत बड़ा गेम-चेंजर है। आज के समय में कैंसर, दिल का दौरा, ब्रेन स्ट्रोक या किडनी फेलियर जैसी बीमारियाँ न केवल शारीरिक बल्कि गंभीर वित्तीय संकट भी लाती हैं।</>
              ) : (
                <>LIC's new **Critical Illness Health Rider** launched in 2026 is a massive game-changer. Severe health issues like cancer, stroke, cardiac arrests, or kidney failure often bring severe emotional and extreme financial strains on the entire household.</>
              )}
            </p>
            <p>
              {isHi ? (
                <>इस राइडर को नव जीवन श्री के साथ जोड़ने पर, यदि पॉलिसीधारक को इनमें से किसी भी गंभीर बीमारी का पता चलता है, तो एलआईसी तुरंत पूरी राइडर बीमा राशि का एकमुश्त भुगतान करती है, जिससे इलाज का भारी खर्च बिना किसी वित्तीय तनाव के वहन किया जा सके।</>
              ) : (
                <>By adding this rider to your Nav Jeevan Shree plan, you ensure that if the insured is diagnosed with any covered major critical illness, LIC immediately releases the full rider sum assured as an upfront lump sum, enabling premium treatment without depleting savings.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 5: FAQ Section */}
        <section className="mb-12 border-t border-gray-100 pt-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-6 flex items-center gap-2">
            <HelpCircle className="text-gold" /> {isHi ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: isHi ? 'क्या नव जीवन श्री में मैच्योरिटी राशि कर-मुक्त है?' : 'Is the maturity payout under Nav Jeevan Shree tax-free?',
                a: isHi
                  ? 'हाँ, भारतीय आयकर अधिनियम की धारा 10(10D) के तहत पॉलिसी की मैच्योरिटी राशि पूरी तरह से कर-मुक्त (tax-free) होती है।'
                  : 'Yes, the full maturity amount, including all accrued reversionary bonuses, is completely tax-free under Section 10(10D) of the Income Tax Act.'
              },
              {
                q: isHi ? 'नियमित और एकल प्रीमियम में क्या अंतर है?' : 'What is the difference between regular and single premium options?',
                a: isHi
                  ? 'नियमित प्रीमियम में आपको चुने गए वर्षों (वार्षिक/मासिक) तक लगातार भुगतान करना होता है, जबकि एकल प्रीमियम में आपको पॉलिसी की शुरुआत में केवल एक बार भुगतान करना होता है।'
                  : 'Regular premium requires you to pay annually or monthly throughout the premium paying term, while Single premium requires only a one-time lump-sum payment at the inception of the policy.'
              },
              {
                q: isHi ? 'क्या मैं पॉलिसी के खिलाफ लोन ले सकता हूँ?' : 'Can I take a loan against my policy?',
                a: isHi
                  ? 'हाँ, नियमित प्रीमियम के तहत 2 वर्ष पूरे होने के बाद और एकल प्रीमियम योजना के तहत पॉलिसी शुरू होने के तुरंत बाद लोन लिया जा सकता है।'
                  : 'Yes, you can secure liquid loans against the policy after completing 2 years for regular payment modes, or almost immediately under the single premium option.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50">
                <h3 className="font-bold text-navy text-sm md:text-base mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Capture Form Section */}
        <section className="bg-gradient-to-br from-amber-50/50 to-white border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-gold" size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-navy mb-1.5">
              {isHi ? 'क्या नव जीवन श्री आपके लिए सही है?' : 'Interested in Nav Jeevan Shree?'}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              {isHi
                ? 'अजय सर आपको यह समझने में मदद करेंगे कि यह प्लान आपके वित्तीय लक्ष्यों में कैसे फिट बैठता है।'
                : 'Ajay sir will personally explain if Nav Jeevan Shree matches your long-term goals and premium budget.'}
            </p>
          </div>

          <BaseLeadForm
            fields={fields}
            intent="LIC Nav Jeevan Shree"
            submitText={isHi ? 'अजय सर से परामर्श लें →' : 'Request Advice from Ajay Sir →'}
            successTitle={isHi ? 'अनुरोध प्राप्त हुआ! 🎉' : 'Request Received! 🎉'}
            successMessage={isHi
              ? 'अजय सर 24 घंटे के भीतर आपको फोन या व्हाट्सएप पर संपर्क करेंगे।'
              : 'Ajay sir will contact you within 24 hours to provide customized estimates.'}
            grid={true}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-100">
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20ji,%20I%20have%20questions%20about%20the%20new%20LIC%20Nav%20Jeevan%20Shree%20plan.`}
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
              📞 {isHi ? 'कॉल करें' : 'Call Ajay Sir'}
            </a>
          </div>

          {/* Share Block */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {isHi ? 'इसे दोस्तों के साथ साझा करें' : 'Share this plan guide with friends'}
            </p>
            <WhatsAppShare
              text={isHi ? 'एलआईसी नव जीवन श्री प्लान सम्पूर्ण विवरण 2026:' : 'LIC Nav Jeevan Shree savings plan 2026 complete guide:'}
              url="https://www.poddarwealth.com/plans/nav-jeevan-shree"
              className="w-full justify-center"
            />
          </div>
        </section>

      </div>
    </div>
  )
}
