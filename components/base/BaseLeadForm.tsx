'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { submitLead, LeadData } from '@/lib/api'

interface Field {
  name: keyof LeadData
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  icon?: React.ReactNode
  options?: string[]
}

interface BaseLeadFormProps {
  fields: Field[]
  intent: string
  submitText: string
  successTitle: string
  successMessage: string
  onSuccess?: () => void
  className?: string
  grid?: boolean
}

export default function BaseLeadForm({
  fields,
  intent,
  submitText,
  successTitle,
  successMessage,
  onSuccess,
  className = '',
  grid = false
}: BaseLeadFormProps) {
  const [formData, setFormData] = useState<LeadData>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), { intent } as LeadData)
  )
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      await submitLead(formData)
      setStatus('success')
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{successTitle}</h3>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">{successMessage}</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-sm font-bold text-green-700 hover:underline"
        >
          ← Send another response
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className={grid ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        {fields.map((field) => (
          <div key={field.name} className="space-y-1.5 group">
            <label className="pw-label flex items-center gap-2">
              {field.icon}
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                required={field.required}
                className="pw-select"
                value={(formData[field.name] as string) || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              >
                <option value="">Select...</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                required={field.required}
                className="pw-textarea"
                placeholder={field.placeholder}
                value={(formData[field.name] as string) || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            ) : (
              <input
                type={field.type || 'text'}
                required={field.required}
                className="pw-input"
                placeholder={field.placeholder}
                value={(formData[field.name] as string) || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="pw-btn pw-btn--gold pw-btn--full h-12 mt-4"
      >
        {status === 'submitting' ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          submitText
        )}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-xs text-center mt-2">
          Something went wrong. Please try again or call 9415313434.
        </p>
      )}
    </form>
  )
}
