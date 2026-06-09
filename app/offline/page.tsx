'use client'

import React from 'react'
import Image from 'next/image'
import { Phone, MapPin, MessageCircle, RefreshCw } from 'lucide-react'
import { ADVISOR_PHONE } from '@/lib/constants'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/pwm-logo.svg"
            alt="Poddar Wealth Logo"
            width={32}
            height={32}
          />
          <span className="text-sm font-black uppercase tracking-wider text-navy">
            Poddar Wealth
          </span>
        </div>
        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest animate-pulse">
          Offline Mode
        </span>
      </header>

      {/* Main body */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center items-center text-center space-y-8">
        
        {/* Connection status circle */}
        <div className="relative">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
            <RefreshCw size={32} className="animate-spin duration-3000" />
          </div>
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-rose-500 border-4 border-white flex items-center justify-center" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-navy leading-tight">
            Connection Lost
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
            You are currently offline. If you are experiencing spotty coverage, you can still view our key contact details below to get in touch with Ajay sir directly.
          </p>
        </div>

        {/* Contact Info Card */}
        <div className="w-full bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-5 text-left">
          
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
            Emergency Contacts
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Call Directly</p>
                <a href={`tel:+91${ADVISOR_PHONE}`} className="text-sm font-extrabold text-navy hover:text-amber-600 transition-colors">
                  +91 {ADVISOR_PHONE}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="text-emerald-500 w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Consultation</p>
                <a 
                  href={`https://wa.me/91${ADVISOR_PHONE}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-extrabold text-navy hover:text-amber-600 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office Address</p>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  AD Mall Compound, Vijay Chowk, Gorakhpur, Uttar Pradesh 273001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Try Reconnecting button */}
        <button 
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          className="w-full bg-navy hover:bg-navy/90 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw size={14} />
          Try Reconnecting
        </button>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
        © 2026 Poddar Wealth Management
      </footer>
    </div>
  )
}
