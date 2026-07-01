'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  CheckCircle, AlertCircle, ExternalLink,
  RefreshCw, Search, Zap, Eye, X, RotateCcw
} from 'lucide-react'

interface SbBrochure {
  id: number
  plan_id: number
  plan_no: number | null
  brochure_url: string
  status: 'pending' | 'in_progress' | 'extracted' | 'approved'
  extracted_at: string | null
  approved_at: string | null
  lic_plans?: { name: string; category: string } | null
}

interface ExtractResult {
  source: 'rule' | 'llm' | 'empty'
  rowCount: number
  ratesInserted: number
  gsvRowsInserted: number
  preview: { age: string; terms: Record<string, number> }[]
  error?: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-100 text-amber-700',
  extracted:   'bg-blue-100 text-blue-700',
  approved:    'bg-green-100 text-green-700',
}

export default function BrochuresPage() {
  const [rows, setRows]           = useState<SbBrochure[]>([])
  const [loading, setLoading]     = useState(true)
  const [extracting, setExtracting] = useState<number | null>(null)
  const [approving, setApproving]   = useState<number | null>(null)
  const [preview, setPreview]     = useState<{ id: number; result: ExtractResult } | null>(null)
  const [search, setSearch]       = useState('')

  const loadRows = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/brochures/extract')
    if (res.ok) { const d = await res.json(); setRows(d.brochures ?? []) }
    setLoading(false)
  }, [])

  useEffect(() => { loadRows() }, [loadRows])

  const handleExtract = async (row: SbBrochure) => {
    setExtracting(row.id)
    try {
      const res = await fetch('/api/admin/brochures/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: row.id, brochure_url: row.brochure_url }),
      })
      const data = await res.json() as ExtractResult
      setPreview({ id: row.id, result: data })
      if (res.ok) await loadRows()
    } finally {
      setExtracting(null)
    }
  }

  const handleApprove = async (row: SbBrochure) => {
    setApproving(row.id)
    try {
      const res = await fetch('/api/admin/brochures/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: row.id }),
      })
      if (res.ok) { await loadRows(); setPreview(null) }
      else { const d = await res.json(); alert(`Approve failed: ${d.error}`) }
    } finally {
      setApproving(null)
    }
  }

  const stats = {
    total:     rows.length,
    pending:   rows.filter(r => r.status === 'pending').length,
    extracted: rows.filter(r => r.status === 'extracted').length,
    approved:  rows.filter(r => r.status === 'approved').length,
  }

  const filtered = rows.filter(r =>
    !search ||
    (r.lic_plans?.name ?? `Plan ${r.plan_no}`).toLowerCase().includes(search.toLowerCase()) ||
    String(r.plan_no ?? '').includes(search)
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Brochure Data Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Extract GSV factors and illustration rates from LIC brochure PDFs.
            Approved data powers the calculator engine.
          </p>
        </div>
        <button onClick={loadRows} className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer mt-1">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Plans', value: stats.total,     color: 'text-gray-700' },
          { label: 'Pending',     value: stats.pending,   color: 'text-amber-600' },
          { label: 'Extracted',   value: stats.extracted, color: 'text-blue-600' },
          { label: 'Approved',    value: stats.approved,  color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Workflow guide */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: '1', title: 'Extract', desc: 'Click Extract → parser pulls GSV factors + illustration rates from the PDF' },
            { step: '2', title: 'Review', desc: 'Check the preview: source (rule/llm), rates inserted, GSV rows found' },
            { step: '3', title: 'Approve', desc: 'Approve → calculator uses brochure-verified data, badge shows "Brochure-verified"' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
              <div>
                <p className="text-sm font-semibold text-blue-900">{s.title}</p>
                <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extraction preview toast */}
      {preview && (
        <div className={`border rounded-xl p-4 text-sm ${preview.result.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              {preview.result.error ? (
                <p className="font-semibold text-red-700 flex items-center gap-1.5">
                  <AlertCircle size={14} /> Extract failed: {preview.result.error}
                </p>
              ) : (
                <>
                  <p className="font-semibold text-green-800 flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    Extracted via <span className="uppercase font-bold">{preview.result.source}</span>
                    {' '}— {preview.result.ratesInserted} premium anchors · {preview.result.gsvRowsInserted} GSV rows
                  </p>
                  {preview.result.preview.length > 0 && (
                    <p className="text-xs text-green-700 font-mono">
                      Rate preview: {preview.result.preview.map(p =>
                        `Age ${p.age}: ${Object.entries(p.terms).map(([t, r]) => `${t}yr=₹${Number(r).toFixed(2)}/1k`).join(', ')}`
                      ).join(' | ')}
                    </p>
                  )}
                  {preview.result.rowCount === 0 && (
                    <p className="text-xs text-amber-700">No data extracted — PDF may be a scanned image. Try a different URL or enter rates manually.</p>
                  )}
                </>
              )}
            </div>
            <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer shrink-0">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search plan name or number…"
          className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Plan', 'Category', 'Status', 'Extracted', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">No plans found.</td></tr>
            ) : filtered.map(row => (
              <tr
                key={row.id}
                className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 ${preview?.id === row.id ? 'bg-blue-50/40' : ''}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 leading-tight">
                    {row.lic_plans?.name ?? `Plan ${row.plan_no}`}
                  </p>
                  <p className="text-xs text-gray-400">Plan {row.plan_no}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {row.lic_plans?.category ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {extracting === row.id ? '⏳ Extracting…' : row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {row.extracted_at ? new Date(row.extracted_at).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.brochure_url && (
                      <a href={row.brochure_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700">
                        <Eye size={11} /> PDF
                      </a>
                    )}
                    {(row.status === 'pending' || row.status === 'extracted') && row.brochure_url && (
                      <button
                        disabled={extracting === row.id}
                        onClick={() => handleExtract(row)}
                        className="inline-flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        <Zap size={11} />
                        {extracting === row.id ? 'Running…' : row.status === 'extracted' ? 'Re-extract' : 'Extract'}
                      </button>
                    )}
                    {row.status === 'approved' && row.brochure_url && (
                      <button
                        disabled={extracting === row.id}
                        onClick={() => handleExtract(row)}
                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Re-extract (will need re-approval)"
                      >
                        <RotateCcw size={11} /> Re-extract
                      </button>
                    )}
                    {row.status === 'extracted' && (
                      <button
                        disabled={approving === row.id}
                        onClick={() => handleApprove(row)}
                        className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        <CheckCircle size={11} />
                        {approving === row.id ? 'Approving…' : 'Approve'}
                      </button>
                    )}
                    {row.status === 'approved' && row.approved_at && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={11} /> {new Date(row.approved_at).toLocaleDateString('en-IN')}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data note */}
      <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
        <strong className="text-gray-600">What gets extracted:</strong>{' '}
        (1) GSV factor table — full policy term × year matrix → powers surrender &amp; loan calculators.{' '}
        (2) Illustration premium table — 3-4 age/term anchor points → converted to rate/₹1000 for interpolation.{' '}
        Full premium rate grids (all ages × all terms) require LIC Agent Rate Books, not sales brochures.
      </div>
    </div>
  )
}
