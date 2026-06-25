'use client'
import * as Icons from 'lucide-react'
import { LucideProps } from 'lucide-react'

interface ConsequenceCard {
  icon: string
  stat: string
  desc: string
}

interface ProblemSectionProps {
  title: string
  cards: ConsequenceCard[]
}

export default function ProblemSection({ title, cards }: ProblemSectionProps) {
  return (
    <section className="relative py-20 bg-[#0f1225] text-white overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-navy pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 z-10 text-center">
        <h2 className="font-display font-bold text-2xl md:text-4xl max-w-3xl mx-auto leading-snug mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {cards.map((card, idx) => {
            // Dynamically resolve the Lucide icon from its name string
            const IconComponent = (Icons as any)[card.icon] || Icons.AlertTriangle

            return (
              <div
                key={idx}
                className="bg-navy-light/40 border border-navy-border/40 rounded-2xl p-8 hover:border-gold/30 hover:bg-navy-light/60 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-gold" />
                </div>
                <div className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-white">
                  {card.stat}
                </div>
                <p className="text-14 text-gray-300 font-medium leading-relaxed">
                  {card.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
