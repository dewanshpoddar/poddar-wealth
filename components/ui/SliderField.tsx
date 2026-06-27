'use client'
import React from 'react'

interface SliderFieldProps {
  label: string
  value: number
  onChange: (val: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  formatValue?: (val: number) => string
}

export default function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  formatValue
}: SliderFieldProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const displayVal = formatValue ? formatValue(value) : `${value}${unit}`

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>

      <div className="relative pt-6 pb-2">
        {/* Value badge positioned absolute above the thumb (premium glass tag with gold tail) */}
        <div
          className="absolute top-0 bg-[#0c0f20] text-amber-400 border border-amber-500/30 text-xs font-bold rounded-lg px-2.5 py-1 -translate-x-1/2 pointer-events-none shadow-md shadow-amber-500/10"
          style={{ left: `${percentage}%` }}
        >
          {displayVal}
          {/* Small tail/caret for badge */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0c0f20]" />
        </div>

        <div className="relative h-5 flex items-center">
          {/* Custom track & fill (glowing gold gradient) */}
          <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-200 pointer-events-none">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.45)]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Native range slider over it */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {/* Visual thumb overlaying the real input position (custom dual-ring gold core dot) */}
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-amber-500 shadow-md shadow-amber-500/20 -translate-x-1/2 pointer-events-none flex items-center justify-center"
            style={{ left: `${percentage}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Min/Max indicators */}
        <div className="flex justify-between text-xs text-gray-400 mt-1 pointer-events-none">
          <span>{formatValue ? formatValue(min) : `${min}${unit}`}</span>
          <span>{formatValue ? formatValue(max) : `${max}${unit}`}</span>
        </div>
      </div>
    </div>
  )
}
