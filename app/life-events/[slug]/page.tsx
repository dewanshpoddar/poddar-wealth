import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import LifeStageCalculator from '@/components/LifeStageCalculator';
import { LIFE_EVENTS, COVER_LABELS, COVER_HREFS } from '@/lib/data/life-events';
import { ADVISOR_PHONE } from '@/lib/constants';
import blogIndex from '@/lib/data/blog-index.json';
import { 
  Shield, Heart, Baby, Home, Sunset, HeartPulse, Ribbon, 
  GraduationCap, Stethoscope, ChevronLeft, MessageCircle, Phone, ArrowRight 
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}



export async function generateStaticParams() {
  return LIFE_EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = LIFE_EVENTS.find((e) => e.slug === slug);
  if (!event) return {};
  return {
    title: `${event.title} | Poddar Wealth Management`,
    description: event.description,
    openGraph: {
      title: `${event.title} | Poddar Wealth Management`,
      description: event.description,
    },
  };
}

const iconMap: Record<string, any> = {
  Shield, Heart, Baby, Home, Sunset, HeartPulse, Ribbon, GraduationCap, Stethoscope
};

// Cover cards builder with custom icons and descriptions
const getCoverDetails = (cover: string, isHi: boolean) => {
  const customDetails: Record<string, { name: string; nameHi: string; desc: string; descHi: string; icon: string }> = {
    'term-life': {
      name: 'Term Life Insurance',
      nameHi: 'टर्म लाइफ इंश्योरेंस',
      desc: 'High coverage at low premiums to secure your family\'s future.',
      descHi: 'कम प्रीमियम पर बड़ा लाइफ कवर ताकि परिवार हमेशा सुरक्षित रहे।',
      icon: 'Shield'
    },
    'health-insurance': {
      name: 'Health Insurance',
      nameHi: 'स्वास्थ्य बीमा',
      desc: 'Cover medical costs and protect your savings from hospital bills.',
      descHi: 'अस्पताल के खर्चों से अपनी जीवन भर की गाढ़ी कमाई को बचाएं।',
      icon: 'HeartPulse'
    },
    'retirement': {
      name: 'Retirement Plan',
      nameHi: 'रिटायरमेंट प्लान',
      desc: 'Build a corpus to receive regular monthly income after retirement.',
      descHi: 'रिटायरमेंट के बाद नियमित मासिक आय के लिए एक सुरक्षित कोष बनाएं।',
      icon: 'Sunset'
    },
    'child-education': {
      name: 'Child Education Plan',
      nameHi: 'चाइल्ड एजुकेशन प्लान',
      desc: 'Guaranteed savings to secure your child\'s higher education.',
      descHi: 'बच्चे की उच्च शिक्षा के लिए गारंटीड रिटर्न वाला बचत प्लान।',
      icon: 'GraduationCap'
    },
    'home-insurance': {
      name: 'Home Protection',
      nameHi: 'होम प्रोटेक्शन प्लान',
      desc: 'Ensure your home loan EMI is never a burden on your family.',
      descHi: 'सुनिश्चित करें कि आपके होम लोन की ईएमआई परिवार पर बोझ न बने।',
      icon: 'Home'
    },
    pension: {
      name: 'Pension Plan',
      nameHi: 'पेंशन प्लान',
      desc: 'Guaranteed lifetime regular income starting right from day one.',
      descHi: 'सुरक्षित बुढ़ापे के लिए जीवन भर गारंटीड पेंशन की सुविधा।',
      icon: 'Landmark'
    },
    'health-insurance-senior': {
      name: 'Senior Health Insurance',
      nameHi: 'वरिष्ठ नागरिक स्वास्थ्य बीमा',
      desc: 'Specialized health cover for parents with cashless treatment.',
      descHi: 'माता-पिता के लिए विशेष स्वास्थ्य कवर, कैशलेस इलाज के साथ।',
      icon: 'Stethoscope'
    },
    'critical-illness': {
      name: 'Critical Illness Cover',
      nameHi: 'क्रिटिकल इलनेस कवर',
      desc: 'Lump-sum cash payout on diagnosis of major diseases like cancer or heart attack.',
      descHi: 'कैंसर या हार्ट अटैक जैसी गंभीर बीमारियों के इलाज के लिए एकमुश्त नकद भुगतान।',
      icon: 'Ribbon'
    }
  };

  const details = customDetails[cover];
  if (details) {
    return {
      name: isHi ? details.nameHi : details.name,
      desc: isHi ? details.descHi : details.desc,
      icon: details.icon
    };
  }

  return {
    name: COVER_LABELS[cover] || cover,
    desc: isHi ? 'अपने परिवार के भविष्य को सुरक्षित और खुशहाल बनाएं।' : 'Secure your family\'s financial roadmap easily.',
    icon: 'Shield'
  };
};

export default async function LifeEventPage({ params }: Props) {
  const { slug } = await params;
  const event = LIFE_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  // Deduce lang based on slug titleHi matching
  const isHi = true; // Use default language detection logic or context inside client, but since we are server component:
  // Let's check parameters or headers if we had a language router, but since routing is slug based and LangContext handles it, 
  // we can check matching variables dynamically. We can support bilingual renders side-by-side or based on language parameter.
  // Wait, let's make it display both, or support a simple switcher, or since LangContext sets lang, in the server component we can render both descriptions to be extremely friendly, or use a responsive language detection.
  // Let's render the titles and descriptions based on default parameters, and display both descriptions (EN + Hindi) for maximum bilingual clarity as in the original page layout!
  // Yes! The original page showed both descriptions side-by-side:
  // e.g. <p className="text-gray-700">{event.description}</p>
  //      <p className="text-gray-500">{event.descriptionHi}</p>
  // This is a beautiful approach! Let's display both English and Hindi text so both language readers are instantly accommodated!

  const relatedPosts = (blogIndex as Array<{ slug: string; title: string; summary: string; category: string; titleHi?: string; summaryHi?: string }>)
    .filter((post) => event.blogSlugs.includes(post.slug))
    .slice(0, 3);

  const colorWashMap: Record<string, string> = {
    blue: 'from-blue-900 via-blue-950 to-gray-950 border-blue-900',
    rose: 'from-rose-900 via-rose-950 to-gray-950 border-rose-900',
    amber: 'from-amber-800 via-amber-900 to-gray-950 border-amber-900',
    emerald: 'from-emerald-900 via-emerald-950 to-gray-950 border-emerald-900',
    violet: 'from-violet-900 via-violet-950 to-gray-950 border-violet-900',
    red: 'from-red-900 via-red-950 to-gray-950 border-red-900',
  };
  const bgWash = colorWashMap[event.color] || colorWashMap.blue;



  return (
    <main className="min-h-screen bg-white pb-0">
      
      {/* ── HERO SECTION ── */}
      <section className={`bg-gradient-to-br ${bgWash} border-b py-20 px-6 pt-28 text-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245,200,66,0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6">
            Life Stage · Ages {event.ageRange}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4 text-white">
            {event.title}
          </h1>
          <h2 className="font-sans text-lg md:text-xl font-medium text-amber-300 max-w-2xl mx-auto mb-6">
            {event.titleHi}
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-2 font-medium">
            {event.description}
          </p>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-xl mx-auto mb-8 font-medium">
            {event.descriptionHi}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculator-section"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
            >
              Check My Coverage
            </a>
            <Link
              href="/ai-advisor"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all active:scale-[0.98]"
            >
              Ask Poddar Ji
            </Link>
          </div>
        </div>
      </section>

      {/* ── SUGGESTED COVERS ── */}
      <section className="bg-white py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-navy">
              What You Need
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-2">
              आपके लिए अनुशंसित सुरक्षा समाधान
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.suggestedCovers.map((cover) => {
              const details = getCoverDetails(cover, false);
              const detailsHi = getCoverDetails(cover, true);
              const CoverIcon = iconMap[details.icon] || Shield;
              const href = COVER_HREFS[cover] || '/services';

              return (
                <Link
                  key={cover}
                  href={href}
                  className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gold/5 text-gold flex items-center justify-center mb-6 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <CoverIcon className="w-5.5 h-5.5" />
                    </div>
                    {/* Text */}
                    <h3 className="font-display font-bold text-[16px] text-navy group-hover:text-gold transition-colors leading-tight mb-2">
                      {details.name}
                      <span className="block text-xs font-semibold text-slate-400 mt-1">{detailsHi.name}</span>
                    </h3>
                    <p className="text-[12px] text-slate-500 mt-3 leading-relaxed font-medium">
                      {details.desc}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium italic">
                      {detailsHi.desc}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold uppercase tracking-widest mt-6">
                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR EMBED ── */}
      <section id="calculator-section" className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-navy">
              See How Much Coverage You Need
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-2">
              निःशुल्क कैलकुलेटर: अपनी सटीक सुरक्षा आवश्यकताओं को मापें
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-2 sm:p-6 md:p-8">
            <LifeStageCalculator slug={event.slug} />
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ── */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-16 md:py-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-navy">
                Helpful Guides For You
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-2">
                आपके लिए उपयोगी और स्पष्ट गाइड
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full inline-block mb-4">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-[15px] leading-snug text-navy group-hover:text-gold transition-colors mb-2.5">
                      {post.title}
                    </h3>
                    <p className="text-[12px] text-slate-500 line-clamp-3 leading-relaxed font-medium">
                      {post.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold uppercase tracking-widest mt-6">
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ASK PODDAR JI & WHATSAPP ── */}
      <section className="bg-gray-950 py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 text-white leading-tight">
            Still Unsure About Your Protection?
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8 font-medium">
            31 years of experience means Ajay sir has helped over 5,000 families find peace of mind. Ask Poddar Ji online or connect directly on WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ai-advisor"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Ask Poddar Ji
            </Link>
            <a
              href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20sir,%20I%20am%20at%20the%20life%20stage%3A%20${encodeURIComponent(event.title)}%20and%20need%20advice.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MessageCircle size={15} className="text-[#25D366] fill-current" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── BACK NAVIGATION ── */}
      <section className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8 flex justify-start">
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-navy uppercase tracking-wider flex items-center gap-1.5 transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>
      </section>

    </main>
  );
}
