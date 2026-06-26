'use client'
import React, { useState, useEffect } from 'react'

interface Option<T> {
  label: string
  value: T
}

interface QuickPickProps<T extends string | number | boolean> {
  label?: string
  value: T
  onChange: (val: T) => void
  options: Option<T>[]
  showCustom?: boolean
  customPlaceholder?: string
  customType?: 'number' | 'text'
  customLabel?: string
  customSuffix?: string
}

export default function QuickPick<T extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
  showCustom = false,
  customPlaceholder = 'Enter custom value',
  customType = 'number',
  customLabel = 'Custom',
  customSuffix = ''
}: QuickPickProps<T>) {
  const isPreset = options.some(opt => opt.value === value)
  const [isCustom, setIsCustom] = useState(showCustom && !isPreset)
  const [customVal, setCustomVal] = useState<string>(!isPreset ? String(value) : '')

  useEffect(() => {
    const isValPreset = options.some(opt => opt.value === value)
    if (isValPreset) {
      setIsCustom(false)
    } else if (value !== undefined && value !== null && value !== '') {
      setIsCustom(true)
      setCustomVal(String(value))
    }
  }, [value, options])

  const handlePillClick = (val: T) => {
    setIsCustom(false)
    onChange(val)
  }

  const handleCustomPillClick = () => {
    setIsCustom(true)
    if (customVal) {
      const parsed = customType === 'number' ? Number(customVal) : customVal
      onChange(parsed as T)
    }
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setCustomVal(raw)
    if (raw === '') return
    const parsed = customType === 'number' ? Number(raw) : raw
    onChange(parsed as T)
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = !isCustom && value === opt.value
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => handlePillClick(opt.value)}
              className={
                isSelected
                  ? 'bg-[#0f1225] text-white rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200'
                  : 'bg-white text-gray-700 rounded-full px-4 py-2.5 text-sm border border-gray-200 hover:border-gray-400 transition-all duration-200'
              }
            >
              {opt.label}
            </button>
          )
        })}
        {showCustom && (
          <button
            type="button"
            onClick={handleCustomPillClick}
            className={
              isCustom
                ? 'bg-[#0f1225] text-white rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200'
                : 'bg-white text-gray-700 rounded-full px-4 py-2.5 text-sm border border-gray-200 hover:border-gray-400 transition-all duration-200'
            }
          >
            {customLabel}
          </button>
        )}
      </div>

      {isCustom && (
        <div className="mt-2.5 relative">
          <input
            type={customType}
            value={customVal}
            onChange={handleCustomInputChange}
            placeholder={customPlaceholder}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base text-gray-900 pr-12"
          />
          {customSuffix && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
              {customSuffix}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
