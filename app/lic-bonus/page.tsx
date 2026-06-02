'use client'

import { useLang } from '@/lib/LangContext'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { User, Phone, MessageSquare, Shield, HelpCircle, Info, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import Link from 'next/link'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function LicBonusPage() {
  const { lang } = useLang()

  const fields = [
    { name: 'name' as const, label: lang === 'en' ? 'Full Name' : 'पूरा नाम', icon: <User size={12} />, placeholder: lang === 'en' ? 'Ramesh Sharma' : 'रमेश शर्मा', required: true },
    { name: 'mobile' as const, label: lang === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर', icon: <Phone size={12} />, placeholder: '10-digit number', required: true, type: 'tel' },
    { name: 'message' as const, label: lang === 'en' ? 'LIC Plan Name / Policy Number' : 'LIC प्लान का नाम / पॉलिसी नंबर', icon: <MessageSquare size={12} />, type: 'textarea', placeholder: lang === 'en' ? 'Which plan bonus do you want to calculate?' : 'आप किस प्लान का बोनस जानना चाहते हैं?' }
  ]

  const isHi = lang === 'hi'

  const bonusPlans = [
    { nameEn: "LIC's New Jeevan Anand", nameHi: "एलआईसी न्यू जीवन आनंद", no: "915", rate: "₹50 / 1000", typeEn: "Reversionary", typeHi: "प्रत्यावर्ती" },
    { nameEn: "LIC's Jeevan Labh", nameHi: "एलआईसी जीवन लाभ", no: "936", rate: "₹54 / 1000", typeEn: "Reversionary", typeHi: "प्रत्यावर्ती" },
    { nameEn: "LIC's Jeevan Lakshya", nameHi: "एलआईसी जीवन लक्ष्य", no: "733", rate: "₹46 / 1000", typeEn: "Reversionary", typeHi: "प्रत्यावर्ती" },
    { nameEn: "LIC's Jeevan Umang", nameHi: "एलआईसी जीवन उमंग", no: "745", rate: "₹48 / 1000", typeEn: "Reversionary", typeHi: "प्रत्यावर्ती" },
    { nameEn: "LIC's New Endowment Plan", nameHi: "एलआईसी न्यू एंडोमेंट प्लान", no: "714", rate: "₹44 / 1000", typeEn: "Reversionary", typeHi: "प्रत्यावर्ती" },
    { nameEn: "LIC's Bima Jyoti", nameHi: "एलआईसी बीमा ज्योति", no: "860", rate: "₹52 / 1000", typeEn: "Guaranteed Addition", typeHi: "गारंटीड एडिशन" }
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      
      {/* Hero Header */}
      <section className="bg-navy text-white py-14 px-6 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] mb-12">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            🏆 {isHi ? 'एलआईसी बोनस दरें 2026' : 'LIC Bonus Rates 2026'}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {isHi 
              ? 'एलआईसी बोनस दरें 2026 — सभी प्लान्स की सूची' 
              : 'LIC Bonus Rates 2026 — All Plans'}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'जीवन आनंद, जीवन लाभ, जीवन उमंग और अन्य सभी पॉलिसियों की 2026 की नवीनतम बोनस दरों की जांच करें और अपनी मैच्योरिटी की गणना करें।'
              : 'Check the latest 2026 bonus rates for Jeevan Anand, Jeevan Labh, Jeevan Umang, and all other policies to estimate your maturity.'}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SEO First Paragraph */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-8 border-l-4 border-gold pl-4 italic">
          {isHi ? (
            <>एलआईसी प्रत्येक वित्तीय वर्ष में अपने पॉलिसीधारकों के लिए लाभांश घोषित करता है। यदि आप भी <strong>LIC bonus rate 2026</strong> की तलाश में हैं या विशेष रूप से अपनी लोकप्रिय <strong>LIC Jeevan Anand bonus</strong> राशि की गणना करना चाहते हैं, तो यह मार्गदर्शिका आपके लिए है। यहाँ गोरखपुर के विख्यात वित्तीय सलाहकार अजय कुमार पोद्दार ने सभी सक्रिय प्लान्स की बोनस दरों और मैच्योरिटी निकालने का आसान सूत्र साझा किया है।</>
          ) : (
            <>LIC declares reversionary and final additional bonuses for policyholders annually. If you are searching for the verified <strong>LIC bonus rate 2026</strong> details or want to calculate your exact <strong>LIC Jeevan Anand bonus</strong> maturity values, this comprehensive guide offers the latest figures. Compiled by Gorakhpur-based MDRT wealth manager Ajay Kumar Poddar.</>
          )}
        </p>

        {/* Section 1: What are LIC Bonuses? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">01.</span> {isHi ? 'एलआईसी बोनस क्या है और यह कैसे काम करता है?' : 'What are LIC Bonuses & How Do They Work?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>एलआईसी पॉलिसियों में मिलने वाला बोनस कंपनी के मुनाफे का एक हिस्सा होता है जो पॉलिसीधारकों के साथ साझा किया जाता है। अधिकांश जीवन बीमा योजनाएं &apos;विद प्रॉफिट्स&apos; (With Profits) होती हैं, जिनमें दो प्रकार के मुख्य बोनस मिलते हैं:</>
              ) : (
                <>LIC bonuses are a share of the life insurance corporation&apos;s annual valuation profits distributed among policyholders. Most savings and endowment plans are &apos;With Profit&apos; policies, meaning they accumulate two primary bonus types over their term:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {isHi ? (
                <>
                  <li><strong>साधारण प्रत्यावर्ती बोनस (Simple Reversionary Bonus):</strong> यह बोनस प्रति वर्ष घोषित किया जाता है और आपकी पॉलिसी में जमा होता रहता है। यह राशि सीधे तौर पर मैच्योरिटी या मृत्यु के समय देय होती है।</li>
                  <li><strong>अंतिम अतिरिक्त बोनस (Final Additional Bonus - FAB):</strong> यह एकमुश्त बोनस है जो लंबी अवधि (आमतौर पर 15 वर्ष से अधिक) की पॉलिसियों के पूरा होने पर मैच्योरिटी या क्लेम के समय दिया जाता है।</li>
                </>
              ) : (
                <>
                  <li><strong>Simple Reversionary Bonus (SRB):</strong> Declared yearly per ₹1,000 of Sum Assured. It accumulates within your active policy and is paid to you at the time of maturity or as a death claim.</li>
                  <li><strong>Final Additional Bonus (FAB):</strong> A one-time lump-sum bonus paid on long-term policies (typically 15 years or more) upon successful maturity or death claim.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 2: Prominent Disclaimer */}
        <div className="bg-red-50/50 border border-red-200/50 rounded-2xl p-5 mb-10">
          <div className="flex gap-3">
            <Info className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-slate-700 text-xs md:text-sm leading-relaxed">
              <span className="font-extrabold text-red-700 block mb-1">
                {isHi ? '⚠️ महत्वपूर्ण घोषणा (Indicative Disclaimer)' : '⚠️ Indicative Rates Disclaimer'}
              </span>
              {isHi ? (
                <>यहाँ दी गई बोनस दरें एलआईसी द्वारा हाल ही में घोषित दरों पर आधारित <strong>सांकेतिक (indicative)</strong> हैं। वास्तविक बोनस दरें हर साल एलआईसी के आधिकारिक मूल्यांकन के बाद घोषित की जाती हैं और यह भिन्न हो सकती हैं। नवीनतम प्रमाणित दरों और अपने प्लान की सटीक बोनस रिपोर्ट के लिए आप हमारी टीम से संपर्क कर सकते हैं।</>
              ) : (
                <>The bonus rates displayed below are **indicative and based on recent official declarations** by LIC. Actual annual bonuses are declared dynamically by LIC after statutory valuations and may fluctuate. Contact us directly to confirm the latest verified rates for your policy numbers.</>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Table - LIC Bonus Rates by Plan */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-6 flex items-center gap-2">
            <span className="text-gold">02.</span> {isHi ? 'विभिन्न प्लान्स की बोनस दरें' : 'LIC Bonus Rates by Plan'}
          </h2>

          {/* Grid Table */}
          <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="bg-navy text-white grid grid-cols-4 gap-2 px-4 py-3 text-xs md:text-sm font-bold uppercase tracking-wider">
              <div>{isHi ? 'प्लान का नाम' : 'Plan Name'}</div>
              <div className="text-center">{isHi ? 'प्लान नंबर' : 'Plan No'}</div>
              <div className="text-center">{isHi ? 'बोनस दर (प्रति 1K)' : 'Bonus Rate (per 1K)'}</div>
              <div className="text-right">{isHi ? 'प्रकार' : 'Bonus Type'}</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-slate-100">
              {bonusPlans.map((plan, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 px-4 py-3.5 text-xs md:text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-navy leading-tight">
                    {isHi ? plan.nameHi : plan.nameEn}
                  </div>
                  <div className="text-center font-mono">{plan.no}</div>
                  <div className="text-center font-bold text-gold">{plan.rate}</div>
                  <div className="text-right text-slate-500 font-medium">
                    {isHi ? plan.typeHi : plan.typeEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: How to Calculate Maturity */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">03.</span> {isHi ? 'बोनस के साथ मैच्योरिटी की गणना कैसे करें?' : 'How to Calculate Maturity with Bonus'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>मैच्योरिटी राशि निकालने का एक बेहद आसान गणितीय सूत्र है:</>
              ) : (
                <>You can calculate your estimated policy maturity value using this standard formula:</>
              )}
            </p>
            
            {/* Formula Block */}
            <div className="bg-navy text-white rounded-2xl p-5 font-mono text-xs md:text-sm text-center leading-relaxed">
              <span className="text-gold block font-bold text-sm md:text-base mb-1.5 uppercase tracking-wider">
                {isHi ? 'मैच्योरिटी सूत्र' : 'Maturity Formula'}
              </span>
              Maturity = Sum Assured + (Bonus Rate × SA / 1000 × Term) + FAB
            </div>

            <p className="font-bold text-navy mt-4">
              {isHi ? 'उदाहरण गणना (न्यू जीवन आनंद - प्लान 915):' : 'Example Calculation (New Jeevan Anand - Plan 915):'}
            </p>
            <ul className="list-disc pl-5 space-y-2 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              {isHi ? (
                <>
                  <li><strong>उम्र:</strong> 30 वर्ष | <strong>पॉलिसी अवधि (Term):</strong> 20 वर्ष</li>
                  <li><strong>बीमा राशि (Sum Assured):</strong> ₹5,00,000</li>
                  <li><strong>सांकेतिक बोनस दर:</strong> ₹50 प्रति ₹1000 बीमा राशि</li>
                  <li><strong>वार्षिक बोनस राशि:</strong> 50 × (5,00,000 / 1000) = ₹25,000 प्रति वर्ष</li>
                  <li><strong>कुल जमा बोनस (20 वर्ष के लिए):</strong> 25,000 × 20 = ₹5,00,000</li>
                  <li><strong>अनुमानित अंतिम अतिरिक्त बोनस (FAB):</strong> ₹10,000 (सांकेतिक)</li>
                  <li><strong>कुल मैच्योरिटी भुगतान:</strong> ₹5,00,000 (SA) + ₹5,00,000 (बोनस) + ₹10,000 (FAB) = <strong className="text-gold">₹10,10,000</strong></li>
                </>
              ) : (
                <>
                  <li><strong>Age:</strong> 30 Years | **Policy Term:** 20 Years</li>
                  <li><strong>Sum Assured (SA):</strong> ₹5,00,000</li>
                  <li><strong>Indicative Bonus Rate:</strong> ₹50 per ₹1,000 Sum Assured</li>
                  <li><strong>Yearly Accumulated Bonus:</strong> 50 × (5,00,000 / 1000) = ₹25,000 / year</li>
                  <li><strong>Total Bonus for 20 years:</strong> 25,000 × 20 = ₹5,00,000</li>
                  <li><strong>Indicative Final Additional Bonus (FAB):</strong> ₹10,000</li>
                  <li><strong>Total Estimated Maturity Payout:</strong> ₹5,00,000 (SA) + ₹5,00,000 (Bonus) + ₹10,000 (FAB) = <strong className="text-gold">₹10,10,000</strong></li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 5: Exact Maturity Calculation CTA */}
        <section className="bg-gradient-to-br from-amber-50/50 to-white border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-gold" size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-navy mb-1.5">
              {isHi ? 'अपनी पॉलिसी की सटीक मैच्योरिटी जानना चाहते हैं?' : 'Want Your Exact Maturity Calculation?'}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              {isHi
                ? 'अजय सर आपकी पॉलिसी अवधि, उम्र और एलआईसी बोनस के आधार पर आपकी सटीक मैच्योरिटी वैल्यू की गणना करके देंगे।'
                : 'Get a personalized maturity calculation report mapping actual bonuses and FAB values directly from Ajay sir.'}
            </p>
          </div>

          <div className="text-center mb-6">
            <Link
              href="/calculators/premium"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all group"
            >
              📊 {isHi ? 'प्रीमियम एवं मैच्योरिटी कैलकुलेटर का उपयोग करें' : 'Open Premium & Maturity Calculator'}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <BaseLeadForm
            fields={fields}
            intent="LIC Bonus Rates 2026"
            submitText={isHi ? 'बोनस रिपोर्ट प्राप्त करें →' : 'Request Free Bonus Report →'}
            successTitle={isHi ? 'अनुरोध प्राप्त हुआ! 🎉' : 'Report Request Received! 🎉'}
            successMessage={isHi
              ? 'अजय सर जल्द ही आपको व्हाट्सएप पर आपकी पॉलिसी की बोनस और मैच्योरिटी रिपोर्ट भेजेंगे।'
              : 'Ajay sir will WhatsApp your customized bonus and maturity calculation breakdown within 24 hours.'}
            grid={true}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-100">
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20ji,%20I%20want%20to%20calculate%20my%20LIC%20policy%20bonus%20and%20maturity.`}
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
              {isHi ? 'इसे दोस्तों के साथ साझा करें' : 'Share this bonus guide with friends'}
            </p>
            <WhatsAppShare
              text={isHi ? 'एलआईसी बोनस दरें 2026 संपूर्ण विवरण:' : 'Latest LIC bonus rates 2026 list for all plans:'}
              url="https://www.poddarwealth.com/lic-bonus"
              className="w-full justify-center"
            />
          </div>
        </section>

      </div>
    </div>
  )
}
