'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface BreakdownRow {
  label: string
  value: string | number
  isTotal?: boolean
}

export interface BarData {
  label: string
  value: number
  max: number
  colorClass: string
  displayValue: string
}

interface ResultBreakdownProps {
  rows: BreakdownRow[]
  bars?: BarData[]
  expandLabel?: string
  collapseLabel?: string
}

export default function ResultBreakdown({
  rows,
  bars,
  expandLabel = 'View detailed breakdown ▾',
  collapseLabel = 'Hide detailed breakdown ▴'
}: ResultBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-4">
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors cursor-pointer"
      >
        <span>{isOpen ? collapseLabel : expandLabel}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4 animate-fadeIn">
          {/* Table */}
          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="w-full border-collapse">
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`
                      ${row.isTotal ? 'font-semibold border-t border-gray-200 bg-gray-50/50' : 'even:bg-gray-50/50'}
                      h-11
                    `}
                  >
                    <td className="text-sm text-gray-600 text-left px-4">
                      {row.label}
                    </td>
                    <td className="text-sm text-gray-900 text-right font-medium tabular-nums px-4">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CSS Bar Chart */}
          {bars && bars.length > 0 && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              {bars.map((bar, idx) => {
                const percentage = Math.min(100, Math.max(0, (bar.value / bar.max) * 100))
                return (
                  <div key={idx}>
                    <div className="text-xs text-gray-500 mb-1">{bar.label}</div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 ${bar.colorClass}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs font-semibold text-gray-800 mt-1">
                      {bar.displayValue}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
