import ChatBot from '@/components/ChatBot'

export const metadata = {
  title: 'Ask Poddar Ji — AI Insurance Advisor | Poddar Wealth',
  description: '31 years of LIC and Star Health expertise, now available 24/7. Ask Poddar Ji anything about insurance in Hindi or English.',
}

export default function AIAdvisorPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-navy pt-20 pb-14 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Online — replies in seconds</span>
          </div>
          <h1 className="font-display text-[36px] md:text-[52px] font-bold text-white leading-tight mb-4">
            Ask <span className="text-gold">Poddar Ji</span>
          </h1>
          <p className="text-white/60 text-[15px] md:text-[17px] leading-relaxed max-w-2xl mx-auto">
            31 years of on-ground LIC expertise in Gorakhpur — now available at any hour. Ask in Hindi or English about life cover, health plans, retirement, or anything in between.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {['LIC Certified', 'Star Health Expert', 'Hindi + English', 'MDRT-level knowledge'].map(label => (
              <div key={label} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-gold text-[11px]">✓</span>
                <span className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat section */}
      <ChatBot />
    </div>
  )
}
