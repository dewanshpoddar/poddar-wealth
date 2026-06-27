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
        {/* Value badge positioned absolute above the thumb */}
        <div
          className="absolute top-0 bg-[#0f1225] text-white text-xs font-semibold rounded px-2 py-0.5 -translate-x-1/2 pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          {displayVal}
          {/* Small tail/caret for badge */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0f1225]" />
        </div>

        <div className="relative h-5 flex items-center">
          {/* Custom track & fill */}
          <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-200 pointer-events-none">
            <div
              className="h-full rounded-full bg-[#0f1225]"
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

          {/* Visual thumb overlaying the real input position */}
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#0f1225] shadow-sm -translate-x-1/2 pointer-events-none"
            style={{ left: `${percentage}%` }}
          />
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
