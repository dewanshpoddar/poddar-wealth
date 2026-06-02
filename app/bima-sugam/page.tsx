'use client'

import { useLang } from '@/lib/LangContext'
import BaseLeadForm from '@/components/base/BaseLeadForm'
import { User, Phone, MessageSquare, MessageCircle, Shield, HelpCircle, Info, Sparkles, Award } from 'lucide-react'
import WhatsAppShare from '@/components/WhatsAppShare'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function BimaSugamPage() {
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
        "name": lang === 'en' ? "What is Bima Sugam?" : "बीमा सुगम क्या है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en' 
            ? "Bima Sugam is an IRDAI-backed digital marketplace that acts as a single platform to buy, sell, and service life, health, and motor insurance policies across all insurers."
            : "बीमा सुगम IRDAI द्वारा समर्थित एक डिजिटल मार्केटप्लेस है जो सभी बीमा कंपनियों में जीवन, स्वास्थ्य और मोटर बीमा पॉलिसियों को खरीदने, बेचने और सेवा देने के लिए एकल मंच के रूप में कार्य करता है।"
        }
      },
      {
        "@type": "Question",
        "name": lang === 'en' ? "Is Bima Sugam free for customers?" : "क्या बीमा सुगम ग्राहकों के लिए मुफ्त है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "Yes, using the Bima Sugam portal is completely free of charge for customers. Insurers list their policies transparently on the platform."
            : "हाँ, ग्राहकों के लिए बीमा सुगम पोर्टल का उपयोग पूरी तरह से निःशुल्क है। बीमा कंपनियाँ मंच पर पारदर्शी रूप से अपनी पॉलिसियों को सूचीबद्ध करती हैं।"
        }
      },
      {
        "@type": "Question",
        "name": lang === 'en' ? "Do I still need an insurance agent like Ajay sir?" : "क्या मुझे अभी भी अजय सर जैसे बीमा एजेंट की आवश्यकता है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "Yes, while the platform allows direct purchases, choosing the right plan and handling complex claim settlements requires expert physical advisory. Ajay sir can advise you through the platform."
            : "हाँ, हालांकि यह मंच सीधे खरीदारी की अनुमति देता है, लेकिन सही योजना चुनना और जटिल क्लेम सेटलमेंट को संभालना विशेषज्ञ भौतिक सलाहकार की मांग करता है। अजय सर मंच के माध्यम से आपका मार्गदर्शन कर सकते हैं।"
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
            <Shield size={12} className="text-gold" /> {isHi ? 'नवीनतम IRDAI अपडेट' : 'Latest IRDAI Update'}
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-4 leading-tight">
            {isHi 
              ? 'बीमा सुगम (Bima Sugam) — भारत का नया बीमा बाज़ार (2026 गाइड)' 
              : 'Bima Sugam — India\'s New Insurance Marketplace (Complete Guide 2026)'}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'IRDAI का नया डिजिटल बीमा मंच। जानें कि बीमा सुगम पोर्टल कैसे काम करता है, बीमा सुगम पंजीकरण कैसे करें और यह आपकी LIC और स्वास्थ्य बीमा पॉलिसियों को कैसे प्रभावित करेगा।'
              : 'IRDAI\'s new digital insurance marketplace. Learn how the official Bima Sugam portal works, Bima Sugam registration steps, and what it means for your LIC and health insurance.'}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SEO First Paragraph */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-8 border-l-4 border-gold pl-4 italic">
          {isHi ? (
            <>IRDAI द्वारा वर्ष 2026 में क्रांतिकारी <strong>Bima Sugam</strong> मंच की शुरुआत की जा रही है। यह विस्तृत गाइड आपको बताएगी कि आधिकारिक <strong>Bima Sugam portal</strong> कैसे संचालित होगा और अपनी पॉलिसियों को आसानी से प्रबंधित करने के लिए आपको <strong>Bima Sugam registration</strong> के बारे में क्या जानना आवश्यक है। गोरखपुर के प्रतिष्ठित LIC और स्टार हेल्थ विशेषज्ञ अजय कुमार पोद्दार (MDRT, USA) द्वारा संकलित मार्गदर्शन।</>
          ) : (
            <>IRDAI is launching the revolutionary <strong>Bima Sugam</strong> platform in 2026. This complete guide walks you through how the official <strong>Bima Sugam portal</strong> will operate and what you need to know about <strong>Bima Sugam registration</strong> for paperless life, health, and motor insurance management. Prepared by MDRT certified advisor Ajay Kumar Poddar of Gorakhpur.</>
          )}
        </p>

        {/* Section 1: What is Bima Sugam? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">01.</span> {isHi ? 'बीमा सुगम क्या है?' : 'What is Bima Sugam?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <><strong>बीमा सुगम (Bima Sugam)</strong> एक अत्यधिक महत्वाकांक्षी डिजिटल प्लेटफ़ॉर्म है जिसे भारत सरकार और IRDAI (भारतीय बीमा नियामक और विकास प्राधिकरण) द्वारा समर्थित किया गया है। यह एक वन-स्टॉप डेस्टिनेशन के रूप में कार्य करेगा जहाँ ग्राहक सभी प्रकार की जीवन बीमा, स्वास्थ्य बीमा और सामान्य (जैसे मोटर/कार) बीमा पॉलिसियों की तुलना कर सकते हैं, उन्हें खरीद सकते हैं और उनके क्लेम की प्रक्रिया पूरी कर सकते हैं।</>
              ) : (
                <><strong>Bima Sugam</strong> is a revolutionary digital platform backed by the IRDAI (Insurance Regulatory and Development Authority of India). It acts as a single window or one-stop destination where customers can seamlessly compare, purchase, modify, and process claims for all types of life, health, and general (motor/home) insurance policies across all insurers in India.</>
              )}
            </p>
            <p>
              {isHi ? (
                <>इसे बीमा उद्योग के लिए &apos;UPI&apos; की तरह समझा जा रहा है। जैसे UPI ने भुगतान प्रणाली को आसान बनाया, वैसे ही बीमा सुगम भारत में पॉलिसी प्रबंधन को पूरी तरह से डिजिटल और पेपरलेस बना देगा। यह एक पूरी तरह से निष्पक्ष और सुरक्षित मंच है।</>
              ) : (
                <>It is widely described as the &apos;UPI of the insurance industry&apos;. Just as UPI transformed digital payments, Bima Sugam will simplify insurance ownership by making policy management 100% digital and paperless. It is a neutral, secure, and customer-first platform.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 2: How Will Bima Sugam Work? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">02.</span> {isHi ? 'बीमा सुगम कैसे काम करेगा?' : 'How Will Bima Sugam Work?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>जब यह पोर्टल पूरी तरह से लाइव हो जाएगा, तो प्रक्रिया काफी सीधी होगी:</>
              ) : (
                <>Once the official portal becomes fully live, the operation flow will be highly streamlined:</>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {isHi ? (
                <>
                  <li><strong>आसान तुलना:</strong> सभी बीमा कंपनियों के प्लांस के प्रीमियम और लाभों को एक साथ एक ही डैशबोर्ड पर देखें।</li>
                  <li><strong>ई-इंश्योरेंस खाता (eIA):</strong> आपका एक आधार-लिंक्ड डिजिटल बीमा खाता होगा जहाँ आपकी सभी पॉलिसियाँ (LIC, स्टार हेल्थ, मोटर आदि) एक ही जगह सुरक्षित रहेंगी।</li>
                  <li><strong>पेपरलेस क्लेम्स:</strong> सभी कागजी कार्रवाई डिजिटल होगी, जिससे नॉमिनी को क्लेम सेटलमेंट के दौरान किसी भी परेशानी का सामना नहीं करना पड़ेगा।</li>
                  <li><strong>पॉलिसी ट्रैकिंग:</strong> रिन्यूअल की तारीखें, प्रीमियम रसीदें और पॉलिसी की स्थिति एक ही डैशबोर्ड पर ट्रैक करें।</li>
                </>
              ) : (
                <>
                  <li><strong>Easy Comparison:</strong> View plan benefits and actual premiums across all licensed insurers on one clean dashboard.</li>
                  <li><strong>e-Insurance Account (eIA):</strong> An Aadhaar-linked digital account that safely stores all your active policies (LIC, Star Health, motor, etc.) in one place.</li>
                  <li><strong>Paperless Claims:</strong> All documentation and settlements are processed digitally, reducing payout delays for your nominees.</li>
                  <li><strong>Policy Tracking:</strong> Track renewals, dues, download premium receipts, and check active statuses in real time.</li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Section 3: Is Bima Sugam Free? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">03.</span> {isHi ? 'क्या बीमा सुगम फ्री है?' : 'Is Bima Sugam Free?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>हाँ, ग्राहकों के लिए <strong>Bima Sugam portal</strong> पर सेवाएं पूरी तरह से मुफ़्त हैं। नियामक और सरकारी दिशानिर्देशों के अनुसार, ग्राहकों से तुलना करने या डिजिटल रिन्यूअल के लिए कोई अतिरिक्त शुल्क नहीं लिया जाएगा।</>
              ) : (
                <>Yes, using the official <strong>Bima Sugam portal</strong> is 100% free of charge for customers. In accordance with IRDAI guidelines, no transactional or convenience fees will be levied on individuals seeking comparisons, purchases, or digital claims.</>
              )}
            </p>
            <p>
              {isHi ? (
                <>सबसे महत्वपूर्ण बात यह है कि आपके पसंदीदा एजेंट (जैसे अजय सर) अभी भी आपको मंच के माध्यम से योजना चुनने और क्लेम निपटान में मदद कर सकते हैं, जिससे आपको डिजिटल सुविधा और व्यक्तिगत भरोसे का अनोखा कॉम्बिनेशन मिलेगा।</>
              ) : (
                <>Importantly, your trusted physical advisor (like Ajay sir) can still guide you through the platform, ensuring you receive the perfect combination of digital convenience and expert personal advocacy when buying or renewing plans.</>
              )}
            </p>
          </div>
        </section>

        {/* Section 4: What Does This Mean for You? */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-xl md:text-2xl text-navy mb-4 flex items-center gap-2">
            <span className="text-gold">04.</span> {isHi ? 'यह आपके लिए क्या मायने रखता है?' : 'What Does This Mean for You?'}
          </h2>
          <div className="text-slate-600 text-sm md:text-base space-y-4 leading-relaxed">
            <p>
              {isHi ? (
                <>बीमा सुगम ग्राहकों को पूर्ण पारदर्शिता प्रदान करेगा। हालांकि, यह याद रखना आवश्यक है कि बीमा केवल एक उत्पाद खरीदना नहीं है — यह आपके परिवार के संकट के समय एक वादा है। सही क्लेम सेटलमेंट, उचित फॉर्म विवरण भरने और यह सुनिश्चित करने के लिए कि आपका पैसा सही जगह सुरक्षित है, आपको आज भी एक विश्वसनीय भौतिक एडवाइज़र की आवश्यकता होती है।</>
              ) : (
                <>While Bima Sugam provides pricing transparency and digital ease, it is vital to remember that insurance is not just a digital commodity; it is a promise of financial protection for your family during a crisis. To select the correct coverage values, input complex declarations properly, and guarantee that claims are settled in under 30 days, having an experienced on-ground advisor remains irreplaceable.</>
              )}
            </p>
            <p>
              {isHi ? (
                <>गोरखपुर और पूर्वांचल के 5,000+ परिवारों ने 31 वर्षों से अजय सर के निजी समर्थन पर भरोसा किया है। बीमा सुगम के डिजिटल बदलावों के बीच, अजय सर की टीम आपकी हर मदद के लिए तैयार है।</>
              ) : (
                <>Over 5,000 families in Gorakhpur and Eastern UP have relied on Ajay sir&apos;s physical presence and guidance for 31 years. Amidst the digital shift of Bima Sugam, our team stands ready to assist you in organizing your eIA digital account and managing your policies correctly.</>
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
                q: isHi ? 'बीमा सुगम कब से शुरू होगा?' : 'When will Bima Sugam be launched?',
                a: isHi 
                  ? 'IRDAI द्वारा 2026 के भीतर बीमा सुगम पोर्टल को पूर्ण रूप से चालू करने की योजना बनाई गई है।' 
                  : 'IRDAI is actively finalizing trials and expects the official Bima Sugam portal to become fully operational for public access within 2026.'
              },
              {
                q: isHi ? 'क्या मुझे अपनी पुरानी LIC पॉलिसियों को फिर से पंजीकृत करना होगा?' : 'Do I need to re-register my old LIC policies?',
                a: isHi
                  ? 'नहीं, आपके पैन और आधार नंबर का उपयोग करके आपके डिजिटल इंश्योरेंस अकाउंट (eIA) में आपकी सभी पुरानी पॉलिसियां ​​स्वचालित रूप से दिखाई देने लगेंगी।'
                  : 'No, once Bima Sugam registration is done using your PAN and Aadhaar, all your existing offline life and health policies will automatically link into your digital e-Insurance Account.'
              },
              {
                q: isHi ? 'क्या बीमा सुगम आने के बाद प्रीमियम सस्ते होंगे?' : 'Will premiums become cheaper under Bima Sugam?',
                a: isHi
                  ? 'हाँ, डायरेक्ट चैनलों और डिजिटल कमीशन लाभों के कारण प्रीमियम दरों में कुछ प्रतिशत की गिरावट आने की उम्मीद है।'
                  : 'Yes, direct listings and optimized digital transaction structures are expected to slightly lower premium costs for consumers across multiple plans.'
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
              {isHi ? 'बीमा सुगम को लेकर उलझन में हैं?' : 'Need Help Understanding Bima Sugam?'}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
              {isHi 
                ? 'अजय सर आपको Bima Sugam registration और eIA डिजिटल बीमा खाता बनाने में व्यक्तिगत मार्गदर्शन प्रदान करेंगे।'
                : 'Get expert guidance from Ajay sir on Bima Sugam portal features, account setup, and policy mapping.'}
            </p>
          </div>

          <BaseLeadForm
            fields={fields}
            intent="Bima Sugam Guide"
            submitText={isHi ? 'अजय सर से बात करें →' : 'Request Guidance from Ajay Sir →'}
            successTitle={isHi ? 'अनुरोध प्राप्त हुआ! 🎉' : 'Request Received! 🎉'}
            successMessage={isHi
              ? 'अजय सर 24 घंटे के भीतर आपको व्हाट्सएप या फोन पर संपर्क करेंगे।'
              : 'Ajay sir will personally call or WhatsApp you within 24 hours to guide you.'}
            grid={true}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-100">
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi Ajay ji, I have questions about Bima Sugam portal.`}
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
              {isHi ? 'इसे दोस्तों के साथ साझा करें' : 'Share this guide with friends'}
            </p>
            <WhatsAppShare 
              text={isHi ? 'बीमा सुगम गाइड 2026:' : 'Complete Guide to Bima Sugam 2026:'}
              url="https://www.poddarwealth.com/bima-sugam"
              className="w-full justify-center"
            />
          </div>
        </section>

      </div>
    </div>
  )
}
