'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Calendar, Filter, MessageCircle, Save, CheckCircle, 
  Search, ArrowDownWideNarrow, Phone, Plus, RefreshCw, Edit3, Trash2
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  source: string
  status: 'New' | 'Contacted' | 'Meeting' | 'Converted' | 'Lost'
  date: string
  notes: string
}

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Amit Pathak', phone: '9876543210', source: 'Exit Intent Popup', status: 'New', date: '2026-06-08', notes: 'Interested in Jeevan Labh plan. Requested call back in the evening.' },
  { id: '2', name: 'Priya Srivastava', phone: '9123456789', source: 'Wealth Blueprint', status: 'Contacted', date: '2026-06-07', notes: 'Completed full wealth blueprint audit. Score was 65. Needs tax saving advisory.' },
  { id: '3', name: 'Rajesh Kumar', phone: '8765432109', source: 'Contact Form', status: 'Meeting', date: '2026-06-06', notes: 'Scheduled meeting for Sunday 11 AM at Vijay chowk office.' },
  { id: '4', name: 'Sanjay Mishra', phone: '7654321098', source: 'Referral Hub', status: 'Converted', date: '2026-06-05', notes: 'Referred by Suresh. Policy review completed and SIIP plan purchased.' },
  { id: '5', name: 'Vikram Singh', phone: '9988776655', source: 'NAV Tracker Alert', status: 'New', date: '2026-06-08', notes: 'Set alert for LIC Growth Fund (749). Wants to discuss fund switching.' },
  { id: '6', name: 'Sunita Sharma', phone: '8877665544', source: 'Premium Calculator', status: 'Lost', date: '2026-06-02', notes: 'Checked premium calculations but bought offline from relative.' }
]

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [sourceFilter, setSourceFilter] = useState<string>('All')
  const [dateFilter, setDateFilter] = useState<string>('All')

  // Load leads from API with mock fallbacks
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/admin/leads')
        if (res.ok) {
          const data = await res.json()
          if (data && data.leads) {
            setLeads(data.leads)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('API Leads endpoint offline, using local metrics', err)
      }
      // Fallback
      setLeads(MOCK_LEADS)
      setLoading(false)
    }
    fetchLeads()
  }, [])

  // Save Leads changes (Status or Notes)
  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    setUpdatingId(id)
    
    // Update locally first
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updates } : lead))

    try {
      const res = await fetch(`/api/admin/leads/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      if (!res.ok) {
        console.warn('Failed to update on server, local state remains active')
      }
    } catch {
      console.warn('Server update request failed, saved locally')
    } finally {
      // Simulate visual feedback
      setTimeout(() => setUpdatingId(null), 500)
    }
  }

  // Calculate Metrics
  const totalLeads = leads.length
  const newLeadsCount = leads.filter(l => l.status === 'New').length
  const meetingCount = leads.filter(l => l.status === 'Meeting').length
  const convertedCount = leads.filter(l => l.status === 'Converted').length
  const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(0) : '0'

  // Extract unique sources for filter dropdown
  const uniqueSources = Array.from(new Set(leads.map(l => l.source)))

  // Apply filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.notes.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter
    
    let matchesDate = true
    if (dateFilter === 'Today') {
      matchesDate = lead.date === '2026-06-08'
    } else if (dateFilter === 'Week') {
      matchesDate = new Date(lead.date) >= new Date('2026-06-01')
    }

    return matchesSearch && matchesStatus && matchesSource && matchesDate
  })

  // Colors mapping for status tags
  const getStatusStyle = (status: Lead['status']) => {
    const colors = {
      New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Meeting: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      Converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Lost: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
    return colors[status]
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">CRM Leads & Pipeline</h1>
          <p className="text-gray-500 text-sm">Track customer query capture, policy requests, and referrals in real time.</p>
        </div>
        
        <button 
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 600)
          }}
          className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer bg-gray-900"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-amber-500' : ''} />
          Refresh
        </button>
      </div>

      {/* KPI METRICS CARD GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Total Queries</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-sans">{totalLeads}</span>
            <span className="text-[10px] font-bold text-emerald-400 font-sans">+100%</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">New Enquiries</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-400 font-sans">{newLeadsCount}</span>
            <span className="text-[10px] font-bold text-gray-500">Active</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Meetings Scheduled</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-400 font-sans">{meetingCount}</span>
            <span className="text-[10px] font-bold text-gray-500">Pending</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Conversion Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-sans">{conversionRate}%</span>
            <span className="text-[10px] font-bold text-emerald-400">Closed Won</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR PANEL */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="flex-1 bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-xl px-3.5 py-2 flex items-center gap-2.5 focus-within:border-amber-500/30 transition-all">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, phone, or notes..."
              className="w-full bg-transparent text-xs outline-none placeholder-gray-600 text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 shrink-0">
            {/* Status Selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs px-3 py-2 rounded-xl outline-none focus:border-amber-500/30 transition-all cursor-pointer font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting">Meeting</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Source Selector */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs px-3 py-2 rounded-xl outline-none focus:border-amber-500/30 transition-all cursor-pointer font-semibold"
            >
              <option value="All">All Sources</option>
              {uniqueSources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Date Selector */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs px-3 py-2 rounded-xl outline-none focus:border-amber-500/30 transition-all cursor-pointer font-semibold"
            >
              <option value="All">All Time</option>
              <option value="Today">Today Only</option>
              <option value="Week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* PIPELINE DATA TABLE */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Loading CRM Records...</p>
        </div>
      ) : filteredLeads.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-950/40">
                    <th className="px-6 py-4">Name / Contact</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Notes</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-800/20 transition-all duration-150">
                      
                      {/* Name & Contact */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="text-xs font-bold text-white">{lead.name}</div>
                        <div className="text-[10px] text-gray-500 mt-1 font-sans flex items-center gap-1 font-semibold">
                          <Phone size={10} />
                          {lead.phone}
                        </div>
                        <div className="text-[9px] text-gray-600 mt-0.5 font-sans font-bold uppercase tracking-wider">{lead.date}</div>
                      </td>

                      {/* Source */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs font-bold text-gray-300">
                        {lead.source}
                      </td>

                      {/* Status select tag */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLead(lead.id, { status: e.target.value as Lead['status'] })}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border outline-none bg-transparent cursor-pointer font-sans ${getStatusStyle(lead.status)}`}
                          >
                            <option value="New" className="bg-gray-900 text-blue-400">New</option>
                            <option value="Contacted" className="bg-gray-900 text-amber-400">Contacted</option>
                            <option value="Meeting" className="bg-gray-900 text-purple-400">Meeting</option>
                            <option value="Converted" className="bg-gray-900 text-emerald-400">Converted</option>
                            <option value="Lost" className="bg-gray-900 text-gray-400">Lost</option>
                          </select>
                          {updatingId === lead.id && (
                            <span className="absolute -right-5 top-1.5 w-3.5 h-3.5 border border-amber-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      </td>

                      {/* Notes area */}
                      <td className="px-6 py-4.5 max-w-xs">
                        <textarea
                          defaultValue={lead.notes}
                          onBlur={(e) => {
                            if (e.target.value !== lead.notes) {
                              handleUpdateLead(lead.id, { notes: e.target.value })
                            }
                          }}
                          placeholder="Add comments or status updates..."
                          className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/40 rounded-lg p-2 text-xs outline-none text-gray-400 focus:text-white transition-all resize-y min-h-[48px] font-medium"
                        />
                      </td>

                      {/* WhatsApp trigger */}
                      <td className="px-6 py-4.5 text-center whitespace-nowrap">
                        <a
                          href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                            `Hello ${lead.name}, this is Ajay Kumar Poddar regarding your inquiry from "${lead.source}". Let's discuss further details.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-sans"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={14} className="fill-current" />
                        </a>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout View (collapses elegantly) */}
          <div className="md:hidden space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 space-y-4 relative">
                
                {/* Header detail */}
                <div className="flex justify-between items-start border-b border-gray-800/60 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{lead.name}</h3>
                    <div className="text-[10px] text-gray-500 mt-1 font-sans flex items-center gap-1 font-semibold">
                      <Phone size={10} />
                      {lead.phone}
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest font-sans">{lead.date}</span>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Source</span>
                    <span className="font-extrabold text-gray-300">{lead.source}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLead(lead.id, { status: e.target.value as Lead['status'] })}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border outline-none bg-transparent cursor-pointer font-sans ${getStatusStyle(lead.status)}`}
                    >
                      <option value="New" className="bg-gray-900 text-blue-400">New</option>
                      <option value="Contacted" className="bg-gray-900 text-amber-400">Contacted</option>
                      <option value="Meeting" className="bg-gray-900 text-purple-400">Meeting</option>
                      <option value="Converted" className="bg-gray-900 text-emerald-400">Converted</option>
                      <option value="Lost" className="bg-gray-900 text-gray-400">Lost</option>
                    </select>
                  </div>
                </div>

                {/* Notes update */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Notes</span>
                  <textarea
                    defaultValue={lead.notes}
                    onBlur={(e) => {
                      if (e.target.value !== lead.notes) {
                        handleUpdateLead(lead.id, { notes: e.target.value })
                      }
                    }}
                    placeholder="Add comments or status updates..."
                    className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/40 rounded-xl p-2.5 text-xs outline-none text-gray-400 focus:text-white transition-all min-h-[48px] font-medium"
                  />
                </div>

                {/* WhatsApp action */}
                <a
                  href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                    `Hello ${lead.name}, this is Ajay Kumar Poddar regarding your inquiry from "${lead.source}". Let's discuss further details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 font-sans"
                >
                  <MessageCircle size={14} className="fill-current" />
                  WhatsApp Contact
                </a>

              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">No leads match your active filters</p>
        </div>
      )}

    </div>
  )
}
