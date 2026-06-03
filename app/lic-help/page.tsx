'use client'

import { useLang } from '@/lib/LangContext'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { User, Phone, MessageSquare, Download, CheckCircle2, Shield, Info, Sparkles, MessageCircle, Bot, Smartphone } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function LicHelpPage() {
  const { lang } = useLang()

  const fields = [
    { name: 'name' as const, label: lang === 'en' ? 'Full Name' : 'पूरा नाम', icon: <User size={12} />, placeholder: lang === 'en' ? 'Ramesh Sharma' : 'रमेश शर्मा', required: true },
    { name: 'mobile' as const, label: lang === 'en' ? 'WhatsApp Number' : 'व्हाट्सएप नंबर', icon: <Phone size={12} />, placeholder: '10-digit number', required: true, type: 'tel' },
    { name: 'message' as const, label: lang === 'en' ? 'LIC Policy Number / Query' : 'LIC पॉलिसी नंबर / सवाल', icon: <MessageSquare size={12} />, type: 'textarea', placeholder: lang === 'en' ? 'Tell us how we can help...' : 'बताएं कि हम आपकी कैसे मदद कर सकते हैं...' }
  ]

  const isHi = lang === 'hi'

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      
      {/* Hero Header */}
      <section className="bg-navy text-white py-14 px-6 relative overflow-hidden rounded-b-[40px] md:rounded-b-[60px] mb-12">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
            <Shield size={16} className="inline mr-1" />{isHi ? 'LIC ग्राहक सहायता' : 'LIC Customer Help'}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {isHi 
              ? 'MyLIC ऐप गाइड — डाउनलोड, पंजीकरण, प्रीमियम भुगतान (2026)' 
              : 'MyLIC App Help — Download, Register, Pay Premium (Complete Guide 2026)'}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'MyLIC ऐप का उपयोग करके प्रीमियम का भुगतान करने, पॉलिसी स्थिति की जांच करने और सामान्य लॉगिन समस्याओं को हल करने के लिए चरण-दर-चरण मार्गदर्शिका।'
              : 'Step-by-step guidance to download MyLIC app, register your policy, pay premium online, and troubleshoot common portal login errors.'}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SEO First Paragraph */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-8 border-l-4 border-gold pl-4 italic">
          {isHi ? (
            <>लाखों LIC पॉलिसीधारक अपने पोर्टफोलियो को प्रबंधित करने के लिए आधिकारिक <strong>MyLIC app</strong> डाउनलोड कर रहे हैं। यह विस्तृत सहायता मार्गदर्शिका आपको सिखाएगी कि एंड्रॉइड या आईओएस के लिए <strong>MyLIC app download</strong> कैसे पूरा करें, और ओटीपी या पंजीकरण समस्याओं को तुरंत हल करने के लिए विशेषज्ञ <strong>LIC portal login help</strong> प्रदान करती है। गोरखपुर के प्रमुख LIC चेयरमैन क्लब सदस्य अजय कुमार पोद्दार द्वारा संकलित।</>
          ) : (
            <>Millions of LIC policyholders are downloading the official <strong>MyLIC app</strong> to manage their portfolios. This step-by-step help guide shows you how to complete the <strong>MyLIC app download</strong> for Android or iOS and provides expert <strong>LIC portal login help</strong> to resolve OTP or registration issues quickly. Authored by MDRT wealth advisor Ajay Kumar Poddar.</>
          )}
        </p>

        {/* Section 1: How to Download MyLIC App */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <Download className="text-gold" size={20} /> {isHi ? '1. MyLIC ऐप कैसे डाउनलोड करें' : '1. How to Download MyLIC App'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <><strong>MyLIC ऐप</strong> डाउनलोड करने की प्रक्रिया बेहद सुरक्षित और सीधी है। सुनिश्चित करें कि आप केवल आधिकारिक स्टोर से ही इसे डाउनलोड कर रहे हैं:</>
              ) : (
                <>Downloading the official <strong>MyLIC app</strong> is highly secure and straightforward. Ensure you only download from official stores to safeguard your credentials:</>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.lic.liccustomer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer group"
              >
                <Bot size={24} className="text-indigo-500" />
                <div>
                  <div className="font-bold text-navy group-hover:text-gold transition-colors">Android Play Store</div>
                  <div className="text-xs text-slate-400">Download for Android phones</div>
                </div>
              </a>
              <a
                href="https://apps.apple.com/in/app/lic-customer/id1089408466"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer group"
              >
                <Smartphone size={24} className="text-gray-600" />
                <div>
                  <div className="font-bold text-navy group-hover:text-gold transition-colors">Apple App Store</div>
                  <div className="text-xs text-slate-400">Download for iPhone / iPad</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: How to Register on MyLIC App */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">02.</span> {isHi ? 'MyLIC ऐप पर पंजीकरण कैसे करें' : '2. How to Register on MyLIC App'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>पंजीकरण की प्रक्रिया पहली बार उपयोग करने वालों के लिए निम्नलिखित है:</>
              ) : (
                <>The registration flow is quick for first-time customer portal users. Follow these steps:</>
              )}
            </p>
            <ul className="list-decimal pl-5 space-y-2">
              {isHi ? (
                <>
                  <li>ऐप खोलें और <strong>&apos;New User Registration&apos;</strong> पर क्लिक करें।</li>
                  <li>अपना <strong>LIC पॉलिसी नंबर</strong>, जन्मतिथि (पॉलिसी बांड के अनुसार) और प्रीमियम राशि (बिना टैक्स के) दर्ज करें।</li>
                  <li>अपना पंजीकृत मोबाइल नंबर और ईमेल आईडी दर्ज करें।</li>
                  <li>आपके नंबर पर एक <strong>Aadhaar OTP / मोबाइल OTP</strong> प्राप्त होगा, उसे दर्ज करें।</li>
                  <li>एक सुरक्षित पासवर्ड बनाएं और लॉगिन करें।</li>
                </>
              ) : (
                <>
                  <li>Open the app and select the <strong>&apos;New User Registration&apos;</strong> button.</li>
                  <li>Enter your active <strong>LIC Policy Number</strong>, Date of Birth (matching bond documents), and installment premium (excluding taxes).</li>
                  <li>Provide your primary mobile number and email address.</li>
                  <li>Enter the secure <strong>Aadhaar OTP / mobile OTP</strong> sent to your registered number to verify your identity.</li>
                  <li>Create a strong custom password and finalize your login setup.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 3: How to Pay Premium Using MyLIC App */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">03.</span> {isHi ? 'MyLIC ऐप से प्रीमियम भुगतान कैसे करें' : '3. How to Pay Premium Using MyLIC App'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>ऐप के जरिए ऑनलाइन प्रीमियम भुगतान करना बेहद आसान और सुरक्षित है:</>
              ) : (
                <>Paying your premium online through the app is secured and helps prevent policy lapses:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {isHi ? (
                <>
                  <li>ऐप में लॉग इन करें और <strong>&apos;Premium Payment&apos;</strong> या <strong>&apos;Pay Direct&apos;</strong> विकल्प चुनें।</li>
                  <li>उन पॉलिसियों को चुनें जिनका प्रीमियम देय है।</li>
                  <li>भुगतान विवरण की जांच करें और <strong>Check & Pay</strong> पर क्लिक करें।</li>
                  <li>अपनी सुविधानुसार <strong>UPI (GPay/PhonePe), नेट बैंकिंग, या डेबिट/क्रेडिट कार्ड</strong> चुनें।</li>
                  <li>भुगतान सफल होने के बाद, ऐप से तुरंत अपनी प्रीमियम रसीद (PDF) डाउनलोड करें।</li>
                </>
              ) : (
                <>
                  <li>Log in to the app dashboard and select the <strong>&apos;Premium Payment&apos;</strong> or <strong>&apos;Pay Direct&apos;</strong> portal.</li>
                  <li>Select the active policies that display outstanding premium dues.</li>
                  <li>Verify the premium breakups and click <strong>Check & Pay</strong>.</li>
                  <li>Choose your payment channel: <strong>UPI (GPay/PhonePe), Net Banking, or Credit/Debit Cards</strong>.</li>
                  <li>Once payment succeeds, download the premium receipt PDF instantly from the transaction history.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 4: How to Check Policy Status */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">04.</span> {isHi ? 'पॉलिसी की स्थिति कैसे जांचें' : '4. How to Check Policy Status'}
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {isHi ? (
              <>लॉगिन करने के बाद, होम स्क्रीन पर <strong>&apos;My Policies&apos;</strong> सेक्शन में जाएं। यहाँ आप अपनी सभी लिंक्ड पॉलिसियों की लिस्ट देख सकते हैं। किसी भी पॉलिसी पर क्लिक करके आप उसका अगला देय प्रीमियम, मैच्योरिटी की तारीख, नॉमिनी का नाम और जमा बोनस (Bonus Accrued) देख सकते हैं।</>
            ) : (
              <>After logging in, navigate to the <strong>&apos;My Policies&apos;</strong> section from the home screen dashboard. Here, you can view the complete list of linked policies. Tap on any specific policy number to view next due dates, maturity details, nominee details, and total accrued bonuses.</>
            )}
          </p>
        </section>

        {/* Section 5: Common Problems & Solutions */}
        <section className="mb-10 border-t border-gray-100 pt-8">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <Info className="text-gold" size={20} /> {isHi ? 'सामान्य समस्याएं और उनके समाधान' : '5. Common Problems & Solutions'}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: isHi ? 'समस्या: मोबाइल नंबर पर ओटीपी (OTP) नहीं मिल रहा है' : 'Problem: OTP Not Received',
                a: isHi
                  ? 'समाधान: जांचें कि क्या आपका मोबाइल नंबर LIC रिकॉर्ड में पंजीकृत है। यदि नहीं, तो आपको पहले बेस शाखा में जाकर या LIC पोर्टल के माध्यम से अपना नंबर अपडेट करना होगा।'
                  : 'Solution: Confirm if your current active number is registered with LIC. If it is stale or incorrect, you will need to perform a contact update at your serving LIC branch office.'
              },
              {
                q: isHi ? 'समस्या: लिंक की गई पॉलिसी ऐप में नहीं दिख रही है' : 'Problem: Policy Not Displaying in App',
                a: isHi
                  ? 'समाधान: यदि पॉलिसी आपके नाम पर है लेकिन दिखाई नहीं दे रही है, तो ऐप में \'Link Policy\' विकल्प का उपयोग करें या अपनी गृह शाखा में पैन/आधार अपडेट कराएं।'
                  : 'Solution: Navigate to \'Link Policy\' inside the portal and enter the policy number. Ensure the owner name matches exactly with your user profile details.'
              },
              {
                q: isHi ? 'समस्या: ऐप पर भुगतान विफल हो गया' : 'Problem: App Premium Payment Failed',
                a: isHi
                  ? 'समाधान: यदि आपका बैंक खाता डेबिट हो गया है लेकिन रसीद नहीं मिली है, तो 24-48 घंटे प्रतीक्षा करें। आप बैकअप के रूप में LIC की आधिकारिक वेबसाइट (https://customer.onlineportal.licindia.in/) का उपयोग भी कर सकते हैं।'
                  : 'Solution: If payment fails but money is debited, it usually refunds in 24-48 hours. Try using the direct web customer portal as a backup: https://customer.onlineportal.licindia.in/'
              }
            ].map((prob, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <h3 className="font-bold text-navy text-sm md:text-base mb-1.5">{prob.q}</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{prob.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Capture Section: Still Having Trouble? */}
        <section className="bg-gradient-to-br from-amber-50/50 to-white border border-gold/15 rounded-3xl p-6 md:p-8 shadow-sm mt-12">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-gold" size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-navy mb-1.5">
              {isHi ? 'क्या आपको अभी भी सहायता की आवश्यकता है?' : 'Still Having Trouble with MyLIC App?'}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              {isHi 
                ? 'अजय सर ने गोरखपुर और पूर्वांचल के 5,000+ परिवारों को उनकी LIC पॉलिसियों को प्रबंधित करने और क्लेम निपटान में मदद की है। वह फोन कॉल पर आपका मार्गदर्शन कर सकते हैं।'
                : 'Ajay sir has personally helped over 5,000 families manage their LIC policies. He can walk you through the app setup or login errors on a simple phone call.'}
            </p>
          </div>

          <BaseLeadForm
            fields={fields}
            intent="MyLIC Help"
            submitText={isHi ? 'अजय सर से सहायता लें →' : 'Request App Help from Ajay Sir →'}
            successTitle={isHi ? 'अनुरोध प्राप्त हुआ!' : 'Support Request Received!'}
            successMessage={isHi
              ? 'अजय सर 24 घंटे के भीतर आपको फोन या व्हाट्सएप पर संपर्क कर सहायता करेंगे।'
              : 'Ajay sir will personally call or WhatsApp you within 24 hours to resolve your LIC portal issues.'}
            grid={true}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-100">
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi Ajay ji, I need help with MyLIC app portal.`}
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
              <Phone size={16} className="inline mr-1" />{isHi ? 'कॉल करें' : 'Call Ajay Sir'}
            </a>
          </div>

          {/* Share Block */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {isHi ? 'इसे दोस्तों के साथ साझा करें' : 'Share this guide with friends'}
            </p>
            <WhatsAppShare 
              text={isHi ? 'MyLIC ऐप उपयोग गाइड 2026:' : 'Step-by-step Guide to MyLIC App:'}
              url="https://www.poddarwealth.com/lic-help"
              className="w-full justify-center"
            />
          </div>
        </section>

      </div>
    </div>
  )
}
