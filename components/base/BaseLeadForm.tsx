'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
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

function validateMobile(value: string) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 'Mobile number is required'
  if (digits.length !== 10) return 'Enter a valid 10-digit mobile number'
  return ''
}

function validateEmail(value: string) {
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
  return ''
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
  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof LeadData, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const validateField = (name: keyof LeadData, value: string) => {
    if (name === 'mobile') return validateMobile(value)
    if (name === 'email') return validateEmail(value)
    return ''
  }

  const handleChange = (name: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (name: keyof LeadData, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate mobile + email on submit
    const newErrors: Partial<Record<keyof LeadData, string>> = {}
    const newTouched: Partial<Record<keyof LeadData, boolean>> = {}
    for (const field of fields) {
      newTouched[field.name] = true
      const err = validateField(field.name, (formData[field.name] as string) || '')
      if (err) newErrors[field.name] = err
    }
    setTouched(newTouched)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

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
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      <div className={grid ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
        {fields.map((field) => {
          const value = (formData[field.name] as string) || ''
          const error = errors[field.name]
          const hasError = touched[field.name] && !!error

          return (
            <div key={field.name} className="space-y-1.5 group">
              <label className="pw-label flex items-center gap-2">
                {field.icon}
                {field.label}
              </label>

              {field.type === 'select' ? (
                <select
                  required={field.required}
                  className={`pw-select ${hasError ? 'border-red-400 focus:ring-red-300' : ''}`}
                  value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  className={`pw-textarea ${hasError ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  className={`pw-input ${hasError ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => {
                    // For tel fields, strip non-digits automatically
                    const val = field.type === 'tel'
                      ? e.target.value.replace(/\D/g, '').slice(0, 10)
                      : e.target.value
                    handleChange(field.name, val)
                  }}
                  onBlur={(e) => handleBlur(field.name, e.target.value)}
                  inputMode={field.type === 'tel' ? 'numeric' : undefined}
                  maxLength={field.type === 'tel' ? 10 : undefined}
                />
              )}

              {hasError && (
                <p className="text-red-500 text-[11px] font-medium mt-0.5">{error}</p>
              )}
            </div>
          )
        })}
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
