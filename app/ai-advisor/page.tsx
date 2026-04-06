import React from 'react'
import ChatBot from '@/components/ChatBot'

export default function AIAdvisorPage() {
  return (
    <div className="bg-white">
      {/* Elaborated Header Section */}
      <section className="bg-navy pt-20 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="pw-eyebrow text-gold/80">Premium AI Protection</div>
          <h1 className="pw-hero-h1 mb-4">
            Meet the Poddar Wealth <span>AI Advisor</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            Trained on 31 years of on-ground experience in Gorakhpur. Our AI combines deep knowledge of LIC of India and Star Health policies with Mr. Ajay Kumar Poddar&apos;s legendary customer-first approach.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <span className="text-gold">✓</span>
              <span className="text-xs text-white uppercase tracking-wider font-semibold">LIC Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <span className="text-gold">✓</span>
              <span className="text-xs text-white uppercase tracking-wider font-semibold">Star Health Expert</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <span className="text-gold">✓</span>
              <span className="text-xs text-white uppercase tracking-wider font-semibold">Bilingual (Hindi/English)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive Chat Experience */}
      <ChatBot fullPage={true} />

      {/* Why it works? */}
      <section className="pw-section--warm py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="pw-title text-3xl mb-6">How it works?</h2>
          <p className="pw-subtitle text-lg max-w-2xl mx-auto mb-12">
            This isn&apos;t just another chatbot. It&apos;s a digital extension of Poddar Wealth Management&apos;s three-decade legacy.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="pw-card bg-white shadow-sm border-none">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="font-bold mb-2">Deep Knowledge</h3>
              <p className="text-12 text-gray-500">Access data on every LIC and Star Health plan instantly.</p>
            </div>
            <div className="pw-card bg-white shadow-sm border-none">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-bold mb-2">Human Centric</h3>
              <p className="text-12 text-gray-500">Trained to prioritize your family&apos;s safety over basic sales.</p>
            </div>
            <div className="pw-card bg-white shadow-sm border-none">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-bold mb-2">24/7 Availability</h3>
              <p className="text-12 text-gray-500">Get answers at midnight or mid-day, exactly when you need them.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
