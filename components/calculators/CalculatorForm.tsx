'use client'
import React, { useState } from 'react'
import { Info, LucideIcon } from 'lucide-react'

interface CalculatorFormProps {
  title: string
  icon: LucideIcon
  infoTooltip?: string
  onCalculate: (e: React.FormEvent) => void
  calculateButtonText: string
  children: React.ReactNode
}

export default function CalculatorForm({
  title,
  icon: Icon,
  infoTooltip,
  onCalculate,
  calculateButtonText,
  children
}: CalculatorFormProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
      {/* Form Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-[#d97706] rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
        </div>
        {infoTooltip && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              aria-label="Info"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-10 w-64 p-3 bg-gray-950 text-white text-xs rounded-xl shadow-lg border border-gray-800 leading-relaxed animate-fadeIn">
                {infoTooltip}
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onCalculate(e)
        }}
        className="space-y-4"
      >
        {children}

        <button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm hover:from-amber-700 hover:to-amber-800 cursor-pointer flex items-center justify-center gap-2"
        >
          {calculateButtonText}
        </button>
      </form>
    </div>
  )
}
