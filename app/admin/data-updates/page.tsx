'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-react'
import type { DataChange, ChangeType } from '@/lib/lic-engine/types'

const TYPE_META: Record<ChangeType, { label: string; color: string; bg: string; border: string }> = {
  PLAN_WITHDRAWN:      { label: 'Plan Withdrawn',      color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
  NEW_PLAN_DETECTED:   { label: 'New Plan Detected',   color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  BONUS_RATE_CHANGED:  { label: 'Bonus Rate Changed',  color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  ELIGIBILITY_CHANGED: { label: 'Eligibility Changed', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  BROCHURE_URL_UPDATED:{ label: 'Brochure URL',        color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  GSV_FORMULA_CHANGED: { label: 'GSV Formula Changed', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
}

interface ApiResponse {
  pending_count: number
  pending: DataChange[]
  recent_log: DataChange[]
}

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color = pct >= 95 ? 'text-green-700 bg-green-50' : pct >= 80 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {pct}% confidence
    </span>
  )
}

function ChangeCard({ change, onAction }: { change: DataChange; onAction: (id: string, action: 'approve' | 'reject') => void }) {
  const meta = TYPE_META[change.type] ?? { label: change.type, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' }
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(true)
    await onAction(change.id, action)
    setLoading(false)
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${meta.border}`}>
      <div className={`${meta.bg} px-5 py-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
              <ConfidenceBadge value={change.confidence} />
            </div>
            <p className="text-gray-900 font-semibold text-sm">
              {change.plan_no ? `Plan ${change.plan_no} — ` : ''}{change.plan_name}
            </p>
            {change.field && (
              <p className="text-gray-500 text-xs mt-0.5">
                Field: <code className="font-mono bg-white/60 px-1 rounded">{change.field}</code>
                {change.old_value !== undefined && (
                  <> · <span className="line-through text-red-500">{String(change.old_value)}</span>
                  {' → '}
                  <span className="text-green-600 font-medium">{String(change.new_value)}</span></>
                )}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Source: {change.source} · {new Date(change.detected_at).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handle('approve')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => handle('reject')}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <XCircle size={13} /> Reject
            </button>
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>
      </div>

      {expanded && change.evidence && (
        <div className="px-5 py-3 bg-white border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">Evidence</p>
          <p className="text-sm text-gray-700 leading-relaxed">{change.evidence}</p>
        </div>
      )}
    </div>
  )
}

export default function DataUpdatesPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'log'>('pending')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/data-updates')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    await fetch('/api/admin/data-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Data Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and approve scraped LIC data changes before they go live</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Pending Review', value: data.pending_count, icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { label: 'Approved Today', value: data.recent_log.filter(c => c.status === 'approved' && c.reviewed_at && new Date(c.reviewed_at).toDateString() === new Date().toDateString()).length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'Rejected', value: data.recent_log.filter(c => c.status === 'rejected').length, icon: XCircle, color: 'text-red-600 bg-red-50' },
            { label: 'Total Logged', value: data.recent_log.length, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon size={16} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 leading-relaxed">
          Changes are detected by the LIC scraper cron (weekly) and require your approval before updating the live calculator database. High-confidence changes (95%+) can be bulk-approved. Low-confidence changes should be manually verified against the LIC website.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['pending', 'log'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer capitalize ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t === 'pending' ? `Pending (${data?.pending_count ?? 0})` : 'History'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !data ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : tab === 'pending' ? (
        <div className="space-y-3">
          {data?.pending.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
              <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No pending changes — database is up to date.</p>
            </div>
          ) : (
            data?.pending.map(c => (
              <ChangeCard key={c.id} change={c} onAction={handleAction} />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {data?.recent_log.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">No history yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Type', 'Plan', 'Action', 'Reviewed', 'By'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recent_log.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${TYPE_META[c.type]?.color ?? 'text-gray-600'}`}>
                        {TYPE_META[c.type]?.label ?? c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.plan_no ? `Plan ${c.plan_no}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {c.reviewed_at ? new Date(c.reviewed_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.reviewed_by ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
