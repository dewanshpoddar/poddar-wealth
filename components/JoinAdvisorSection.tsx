'use client'
import { useLang } from '@/lib/LangContext'

interface Benefit {
  title: string
  description: string
}

interface JoinAdvisorTranslation {
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  benefits: Benefit[]
}

export default function JoinAdvisorSection() {
  const { t, lang } = useLang()

  // Safely check if t.joinAdvisor is an object (it could be a string or undefined)
  const rawJoinAdvisor = (t as any).joinAdvisor
  const c: JoinAdvisorTranslation =
    rawJoinAdvisor && typeof rawJoinAdvisor === 'object' && !Array.isArray(rawJoinAdvisor)
      ? (rawJoinAdvisor as JoinAdvisorTranslation)
      : {
          eyebrow: lang === 'en' ? 'JOIN OUR NETWORK' : lang === 'hi' ? 'हमारे नेटवर्क से जुड़ें' : 'আমাদের নেটওয়ার্কে যোগ দিন',
          title: lang === 'en' ? 'Become a Trusted Insurance Advisor' : lang === 'hi' ? 'एक विश्वसनीय बीमा सलाहकार बनें' : 'একজন বিশ্বস্ত বীমা উপদেষ্টা হন',
          subtitle: lang === 'en' ? "Build a rewarding career, protect families, and grow with Gorakhpur's premier wealth firm." : lang === 'hi' ? 'एक पुरस्कृत करियर बनाएं, परिवारों की रक्षा करें और गोरखपुर की प्रमुख वेल्थ फर्म के साथ बढ़ें।' : 'একটি ফলপ্রসূ কর্মজীবন গড়ে তুলুন, পরিবারকে রক্ষা করুন এবং গোরখপুরের প্রিমিয়ার ওয়েলথ ফার্মের সাথে বৃদ্ধি পান।',
          cta: lang === 'en' ? 'Join as Advisor' : lang === 'hi' ? 'सलाहकार बनें' : 'উপদেষ্টা হিসেবে যোগ দিন',
          benefits: [
            {
              title: lang === 'en' ? '31+ Yrs Legacy' : lang === 'hi' ? '31+ वर्षों की विरासत' : '31+ বছরের ঐতিহ্য',
              description: lang === 'en' ? "Learn directly from Ajay sir's three decades of expertise." : lang === 'hi' ? 'अजय सर के तीन दशकों के अनुभव से सीधे सीखें।' : "অজয় স্যারের তিন দশকের অভিজ্ঞতা থেকে সরাসরি শিখুন।"
            },
            {
              title: lang === 'en' ? 'Uncapped Earnings' : lang === 'hi' ? 'असीमित कमाई' : 'সীমাহীন আয়',
              description: lang === 'en' ? 'Earn best-in-class commissions and renewal premiums.' : lang === 'hi' ? 'सर्वश्रेष्ठ कमीशन और रिन्यूअल प्रीमियम अर्जित करें।' : 'সেরা কমিশন এবং নবায়ন প্রিমিয়াম উপার্জন করুন।'
            },
            {
              title: lang === 'en' ? 'Complete Support' : lang === 'hi' ? 'पूर्ण सहयोग' : 'সম্পূর্ণ সমর্থন',
              description: lang === 'en' ? 'Get training, digital tools, and claims assistance.' : lang === 'hi' ? 'प्रशिक्षण, डिजिटल टूल और क्लेम सहायता प्राप्त करें।' : 'প্রশিক্ষণ, ডিজিটাল টুলস এবং দাবি সহায়তা পান।'
            }
          ]
        }

  return (
    <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-16 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2 text-center">
            {c.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            {c.title}
          </h2>
          <p className="text-white/80 mt-2 text-center max-w-xl mx-auto">
            {c.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {c.benefits.map((b, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-colors duration-300">
              <div className="text-2xl font-bold text-white">{b.title}</div>
              <div className="text-white/70 text-sm mt-2">{b.description}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/become-advisor"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm shadow-lg hover:shadow-xl"
          >
            {c.cta} →
          </a>
        </div>
      </div>
    </section>
  )
}
