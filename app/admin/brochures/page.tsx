'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  CheckCircle, AlertCircle, ExternalLink,
  RefreshCw, Search, Upload, Edit3, X, Zap, Eye
} from 'lucide-react'
import type { BrochureEntry } from '@/lib/lic-engine/types'

// ── Supabase brochure row shape (from lic_brochures table) ───────────────────
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
  preview: { age: string; terms: Record<string, number> }[]
  gsvFactors: Record<string, number>
}

const SB_STATUS_COLORS: Record<string, string> = {
  pending:     'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-100 text-amber-700',
  extracted:   'bg-blue-100 text-blue-700',
  approved:    'bg-green-100 text-green-700',
}

function SupabaseBrochuresPanel() {
  const [rows, setRows]         = useState<SbBrochure[]>([])
  const [loading, setLoading]   = useState(true)
  const [extracting, setExtracting] = useState<number | null>(null)
  const [approving, setApproving]   = useState<number | null>(null)
  const [preview, setPreview]   = useState<{ id: number; result: ExtractResult } | null>(null)

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
      const data = await res.json() as ExtractResult & { error?: string }
      if (res.ok) {
        setPreview({ id: row.id, result: data })
        await loadRows()
      } else {
        alert(`Extract failed: ${data.error}`)
      }
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

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">Supabase Brochure Extraction</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {stats.approved}/{stats.total} approved · {stats.extracted} ready to approve · {stats.pending} pending extract
          </p>
        </div>
        <button onClick={loadRows} className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {preview && (
        <div className="mx-5 my-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-blue-800 mb-1">
                Extracted via <span className="uppercase">{preview.result.source}</span> — {preview.result.ratesInserted} rates inserted
              </p>
              {preview.result.preview.length > 0 && (
                <p className="text-blue-700 font-mono">
                  Preview (age → terms): {preview.result.preview.map(p =>
                    `Age ${p.age}: ${Object.entries(p.terms).map(([t, r]) => `${t}yr=₹${r}`).join(', ')}`
                  ).join(' | ')}
                </p>
              )}
              {preview.result.rowCount === 0 && (
                <p className="text-amber-700">No rates extracted — PDF may be scanned image. Manual entry required.</p>
              )}
            </div>
            <button onClick={() => setPreview(null)} className="text-blue-400 hover:text-blue-700 cursor-pointer shrink-0">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

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
            <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">Loading...</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No brochures in Supabase yet.</td></tr>
          ) : rows.map(row => (
            <tr key={row.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 ${preview?.id === row.id ? 'bg-blue-50/40' : ''}`}>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {row.lic_plans?.name ?? `Plan ${row.plan_no}`}
                </p>
                <p className="text-xs text-gray-400">Plan {row.plan_no}</p>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs text-gray-500">{row.lic_plans?.category ?? '—'}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${SB_STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {row.status === 'in_progress' ? (extracting === row.id ? '⏳ Extracting…' : 'In Progress') : row.status}
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
                  {(row.status === 'pending' || row.status === 'in_progress') && row.brochure_url && (
                    <button
                      disabled={extracting === row.id}
                      onClick={() => handleExtract(row)}
                      className="inline-flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      <Zap size={11} /> {extracting === row.id ? 'Running…' : 'Extract'}
                    </button>
                  )}
                  {row.status === 'extracted' && (
                    <button
                      disabled={approving === row.id}
                      onClick={() => handleApprove(row)}
                      className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      <CheckCircle size={11} /> {approving === row.id ? 'Approving…' : 'Approve'}
                    </button>
                  )}
                  {row.status === 'approved' && row.approved_at && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ {new Date(row.approved_at).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type FilterKey = 'all' | 'pending' | 'missing' | 'approved'

const STATUS_META = {
  approved:     { label: 'Approved',     color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  extracted:    { label: 'Extracted',    color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  in_progress:  { label: 'In Progress',  color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500' },
  pending:      { label: 'Pending',      color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200',   dot: 'bg-gray-400' },
  not_applicable:{ label: 'N/A',         color: 'text-gray-400',   bg: 'bg-gray-50',   border: 'border-gray-100',   dot: 'bg-gray-300' },
}

interface Stats {
  total_retail: number
  url_known: number
  url_missing: number
  pending: number
  extracted: number
  approved: number
}

interface UrlModalProps {
  entry: BrochureEntry
  onSave: (planNo: number | null, planName: string, url: string, notes: string) => void
  onClose: () => void
}

function UrlModal({ entry, onSave, onClose }: UrlModalProps) {
  const [url, setUrl] = useState(entry.brochure_url ?? '')
  const [notes, setNotes] = useState(entry.notes ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">{entry.plan_name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {entry.plan_no ? `Plan ${entry.plan_no}` : 'Unknown Plan No'} · Add/Update Brochure URL
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              LIC Brochure URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://licindia.in/documents/..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-xs text-gray-400 mt-1">Find on licindia.in → Products → [Plan Name] → Download Brochure</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Rate table is on page 4, column 3"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button
            onClick={() => { if (url.trim()) onSave(entry.plan_no, entry.plan_name, url.trim(), notes) }}
            disabled={!url.trim()}
            className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg disabled:opacity-40 cursor-pointer"
          >
            Save URL
          </button>
        </div>
      </div>
    </div>
  )
}

function BrochureRow({ entry, onApprove, onAddUrl }: {
  entry: BrochureEntry
  onApprove: (planNo: number | null, planName: string) => void
  onAddUrl: (entry: BrochureEntry) => void
}) {
  const statusMeta = STATUS_META[entry.extraction_status] ?? STATUS_META.pending

  const completionPct = entry.extraction_status === 'not_applicable' ? null :
    Math.round(
      ([entry.tabular_rates_complete, entry.gsv_factors_complete, entry.bonus_rates_verified]
        .filter(Boolean).length / 3) * 100
    )

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full shrink-0 ${statusMeta.dot}`} />
          <div>
            <p className="text-sm font-medium text-gray-900 leading-tight">{entry.plan_name}</p>
            <p className="text-xs text-gray-400">{entry.plan_no ? `Plan ${entry.plan_no}` : 'No plan number'}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{entry.lic_category}</span>
      </td>
      <td className="px-4 py-3">
        {entry.url_status === 'known' && entry.brochure_url ? (
          <a
            href={entry.brochure_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            Open PDF <ExternalLink size={11} />
          </a>
        ) : entry.url_status === 'not_applicable' ? (
          <span className="text-xs text-gray-300">N/A</span>
        ) : (
          <button
            onClick={() => onAddUrl(entry)}
            className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 cursor-pointer"
          >
            <Upload size={11} /> Add URL
          </button>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusMeta.bg} ${statusMeta.color}`}>
          {statusMeta.label}
        </span>
      </td>
      <td className="px-4 py-3">
        {completionPct !== null ? (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${completionPct === 100 ? 'bg-green-500' : completionPct >= 66 ? 'bg-blue-400' : 'bg-gray-300'}`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{completionPct}%</span>
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {entry.extraction_status === 'extracted' && (
          <button
            onClick={() => onApprove(entry.plan_no, entry.plan_name)}
            className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <CheckCircle size={11} /> Approve
          </button>
        )}
        {entry.approved_at && (
          <span className="text-xs text-gray-400">
            {new Date(entry.approved_at).toLocaleDateString('en-IN')}
          </span>
        )}
      </td>
    </tr>
  )
}

export default function BrochuresPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [entries, setEntries] = useState<BrochureEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')
  const [urlModal, setUrlModal] = useState<BrochureEntry | null>(null)

  const load = useCallback(async (f: FilterKey = filter) => {
    setLoading(true)
    const params = f !== 'all' ? `?filter=${f}` : '?filter=retail'
    const res = await fetch(`/api/admin/brochures${params}`)
    if (res.ok) {
      const d = await res.json()
      setStats(d.stats)
      setEntries(d.entries)
    }
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  const handleApprove = async (planNo: number | null, planName: string) => {
    await fetch('/api/admin/brochures', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_no: planNo, plan_name: planName, approve: true }),
    })
    load()
  }

  const handleSaveUrl = async (planNo: number | null, planName: string, url: string, notes: string) => {
    await fetch('/api/admin/brochures', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_no: planNo, plan_name: planName, brochure_url: url, notes }),
    })
    setUrlModal(null)
    load()
  }

  const filtered = entries.filter(e =>
    !search || e.plan_name.toLowerCase().includes(search.toLowerCase()) ||
    String(e.plan_no ?? '').includes(search)
  )

  const needUrlList = entries.filter(e => e.url_status === 'missing' && e.category_type === 'retail_individual')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Brochure Data Pipeline</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Track LIC plan brochure extraction status. Approved brochures power the 99.9% accurate calculators.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Retail Plans', value: stats.total_retail, color: 'text-gray-700' },
            { label: 'URL Known', value: stats.url_known, color: 'text-blue-600' },
            { label: 'URL Missing', value: stats.url_missing, color: 'text-red-500' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Extracted', value: stats.extracted, color: 'text-blue-500' },
            { label: 'Approved', value: stats.approved, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Brochures needed — manual action list */}
      {needUrlList.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-2">
                {needUrlList.length} plans need brochure URLs — please find these on licindia.in
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {needUrlList.map(e => (
                  <div key={e.plan_name} className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-gray-700">
                      {e.plan_no ? `Plan ${e.plan_no} — ` : ''}{e.plan_name}
                    </span>
                    <button
                      onClick={() => setUrlModal(e)}
                      className="text-xs text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 ml-2 cursor-pointer"
                    >
                      <Edit3 size={10} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['all', 'pending', 'missing', 'approved'] as FilterKey[]).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); load(f) }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer capitalize ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search plan name or number..."
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 w-56"
          />
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Plan', 'Category', 'Brochure', 'Status', 'Completion', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && !entries.length ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No plans match filter.</td></tr>
            ) : (
              filtered.map(e => (
                <BrochureRow
                  key={e.plan_name}
                  entry={e}
                  onApprove={handleApprove}
                  onAddUrl={setUrlModal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Next Steps guidance */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Workflow</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: '1', title: 'Add Missing URLs', desc: 'Find brochure PDFs on licindia.in and paste the URL here' },
            { step: '2', title: 'Extract Rate Tables', desc: 'Open each PDF and enter the age × term premium grid into the system' },
            { step: '3', title: 'Approve & Go Live', desc: 'Once extracted, approve the plan — calculators instantly use the exact rates' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase extraction pipeline */}
      <SupabaseBrochuresPanel />

      {urlModal && (
        <UrlModal
          entry={urlModal}
          onSave={handleSaveUrl}
          onClose={() => setUrlModal(null)}
        />
      )}
    </div>
  )
}
