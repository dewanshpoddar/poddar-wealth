import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { LIFE_EVENTS, COVER_LABELS, COVER_HREFS } from '@/lib/data/life-events';
import { ADVISOR_PHONE } from '@/lib/constants';
import blogIndex from '@/lib/data/blog-index.json';

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

export default async function LifeEventPage({ params }: Props) {
  const { slug } = await params;
  const event = LIFE_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const relatedPosts = (blogIndex as Array<{ slug: string; title: string; summary: string; category: string }>)
    .filter((post) => event.blogSlugs.includes(post.slug))
    .slice(0, 3);

  const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-800' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
  };

  const c = colorMap[event.color] ?? colorMap.blue;

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      {/* Hero */}
      <section className={`${c.bg} border-b ${c.border} py-12 px-4`}>
        <div className="max-w-3xl mx-auto text-center">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${c.badge}`}>
            Life Stage · Ages {event.ageRange}
          </span>
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${c.text}`}>{event.title}</h1>
          <p className="text-gray-700 text-lg mb-2">{event.description}</p>
          <p className="text-gray-500 text-base mb-6">{event.descriptionHi}</p>
          <p className="text-gray-800 font-semibold text-xl italic">"{event.heroText}"</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-12">
        {/* Suggested Covers */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">What You Need Right Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.suggestedCovers.map((cover) => (
              <Link
                key={cover}
                href={COVER_HREFS[cover] ?? '/services/life-insurance'}
                className={`flex items-center gap-3 p-4 rounded-xl border ${c.border} ${c.bg} hover:shadow-md transition-shadow`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.text.replace('text-', 'bg-')}`} />
                <span className={`font-semibold ${c.text}`}>{COVER_LABELS[cover] ?? cover}</span>
                <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Calculator CTA */}
        <section className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Calculate Your Coverage</h2>
            <p className="text-gray-600 text-sm">Use our free tool to estimate exactly what you need.</p>
          </div>
          <Link
            href={event.calculatorLink}
            className="flex-shrink-0 bg-navy text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-navy/90 transition-colors"
          >
            Open Calculator →
          </Link>
        </section>

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Helpful Guides For You</h2>
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <span className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                    {post.category}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-snug">{post.title}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{post.summary}</p>
                  </div>
                  <svg className="ml-auto w-4 h-4 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* WhatsApp CTA */}
        <section className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Talk to Ajay sir — It's Free</h2>
          <p className="text-gray-600 text-sm mb-5">
            31 years of experience. He will tell you exactly what you need, no pressure, no scripts.
          </p>
          <a
            href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20sir,%20I%20am%20at%20the%20life%20stage%3A%20${encodeURIComponent(event.title)}%20and%20need%20advice.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            Chat on WhatsApp
          </a>
        </section>

        {/* Back link */}
        <div>
          <Link href="/life-events" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all life stages
          </Link>
        </div>
      </div>
    </main>
  );
}
