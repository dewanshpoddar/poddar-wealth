import React from 'react'
import { fmt, fmtSA } from '@/lib/format'

interface BenefitTableProps {
  data: any[]
  sa: number
  showAllRows: boolean
  setShowAllRows: (v: boolean) => void
}

export default function BenefitTable({ data, sa, showAllRows, setShowAllRows }: BenefitTableProps) {
  const visibleRows = showAllRows ? data : data.slice(0, 10)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-navy text-white text-[10px]">
            {['Year', 'Age', 'Premium', 'Cum. Paid', 'SA', 'Annual Bonus', 'Cum. Bonus', 'Death Benefit', 'Surrender Val.', 'Survival / Maturity'].map(h => (
              <th key={h} className="px-3 py-2.5 text-left font-bold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[11px]">
          {visibleRows.map((row: any, i: number) => (
            <tr key={row.year}
              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
                ${row.maturityPayout ? 'bg-green-50' : ''}
                ${row.survivalPayout ? 'bg-amber-50/60' : ''}`}>
              <td className="px-3 py-2 font-bold text-gold">{row.year}</td>
              <td className="px-3 py-2 text-gray-500">{row.age}</td>
              <td className="px-3 py-2">{row.premiumPaid ? fmt(row.premiumPaid) : '—'}</td>
              <td className="px-3 py-2 font-semibold">{fmt(row.cumPremiumPaid)}</td>
              <td className="px-3 py-2">{fmtSA(sa)}</td>
              <td className="px-3 py-2 text-blue-600">{row.annualBonus ? fmt(row.annualBonus) : '—'}</td>
              <td className="px-3 py-2 text-blue-700 font-semibold">{row.cumBonus ? fmt(row.cumBonus) : '—'}</td>
              <td className="px-3 py-2 font-bold text-red-600">{fmt(row.deathBenefit)}</td>
              <td className="px-3 py-2 text-amber-600">{row.gsv ? fmt(row.gsv) : '—'}</td>
              <td className="px-3 py-2 font-bold text-green-700">
                {row.maturityPayout ? `🎉 ${fmt(row.maturityPayout)}` : row.survivalPayout ? `💰 ${fmt(row.survivalPayout)}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 10 && (
        <button onClick={() => setShowAllRows(!showAllRows)}
          className="w-full py-2.5 text-[11px] font-bold text-gold hover:text-gold-hover border-t border-gray-50 hover:bg-gray-50 transition-colors">
          {showAllRows ? `Show less ↑` : `Show all ${data.length} years ↓`}
        </button>
      )}
    </div>
  )
}
