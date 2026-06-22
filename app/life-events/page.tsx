import Link from 'next/link';
import type { Metadata } from 'next';
import { LIFE_EVENTS } from '@/lib/data/life-events';
import { ADVISOR_PHONE } from '@/lib/constants';

export const metadata: Metadata = {
  title: "What's Your Situation? | Poddar Wealth Management",
  description:
    'Choose your life stage and get personalised insurance and financial planning advice from Ajay Kumar Poddar, MDRT Member with 31 years of experience.',
  openGraph: {
    title: "What's Your Situation? | Poddar Wealth Management",
    description:
      'Choose your life stage and get personalised insurance and financial planning advice.',
  },
};

const ICON_EMOJIS: Record<string, string> = {
  Briefcase: '💼',
  Heart: '💑',
  Baby: '👶',
  Home: '🏠',
  Sunset: '🌅',
  HeartPulse: '❤️‍🩺',
};

const COLOR_CLASSES: Record<string, { card: string; badge: string; hover: string }> = {
  blue: { card: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50', badge: 'bg-blue-100 text-blue-700', hover: 'group-hover:text-blue-600' },
  rose: { card: 'border-rose-200 hover:border-rose-400 hover:bg-rose-50', badge: 'bg-rose-100 text-rose-700', hover: 'group-hover:text-rose-600' },
  amber: { card: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50', badge: 'bg-amber-100 text-amber-700', hover: 'group-hover:text-amber-600' },
  emerald: { card: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', hover: 'group-hover:text-emerald-600' },
  violet: { card: 'border-violet-200 hover:border-violet-400 hover:bg-violet-50', badge: 'bg-violet-100 text-violet-700', hover: 'group-hover:text-violet-600' },
  red: { card: 'border-red-200 hover:border-red-400 hover:bg-red-50', badge: 'bg-red-100 text-red-700', hover: 'group-hover:text-red-600' },
};

export default function LifeEventsPage() {
  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200 py-12 px-4 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-4">
          Life Stage Planner
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          What&apos;s Your Situation?
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Choose what applies to you — we&apos;ll show you exactly what you need
        </p>
      </section>

      {/* Cards */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LIFE_EVENTS.map((event) => {
            const colors = COLOR_CLASSES[event.color] ?? COLOR_CLASSES.blue;
            return (
              <Link
                key={event.slug}
                href={`/life-events/${event.slug}`}
                className={`group flex flex-col p-5 rounded-2xl border bg-white transition-all duration-200 shadow-sm hover:shadow-md ${colors.card}`}
              >
                <div className="text-3xl mb-3">{ICON_EMOJIS[event.icon] ?? '📋'}</div>
                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full w-fit mb-2 ${colors.badge}`}>
                  Ages {event.ageRange}
                </span>
                <h2 className={`font-bold text-gray-900 text-lg leading-tight mb-1 transition-colors ${colors.hover}`}>
                  {event.title}
                </h2>
                <p className="text-gray-500 text-sm mb-1">{event.titleHi}</p>
                <p className="text-gray-600 text-sm flex-1 mt-2">{event.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-gray-500 group-hover:text-gray-800 transition-colors">
                  See what you need
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best Plan finder CTA */}
      <section className="max-w-4xl mx-auto px-4 mt-10 mb-2">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 text-sm">Not sure of your age bracket?</p>
            <p className="text-gray-600 text-xs mt-0.5">Use our age-based plan finder to see the best LIC plan for you.</p>
          </div>
          <Link
            href="/best-plan/30"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            Find My Best Plan →
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-2xl mx-auto px-4 mt-10 text-center">
        <p className="text-gray-500 text-sm mb-4">Not sure which applies to you? Just ask Ajay sir.</p>
        <a
          href={`https://wa.me/91${ADVISOR_PHONE}?text=Hi%20Ajay%20sir,%20I%20need%20insurance%20advice%20based%20on%20my%20life%20situation.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
          Ask Ajay sir on WhatsApp
        </a>
      </section>
    </main>
  );
}
