'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Mail } from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { LEAD_POPUP_EVENT } from '@/lib/events'
import BaseLeadForm from './base/BaseLeadForm'

export default function LeadPopup() {
  const { t } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [initialIntent, setInitialIntent] = useState('General Consultation')

  useEffect(() => {
    // Show popup after 4 seconds automatically if not dismissed
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 4500)

    // Global listener to open popup from any button
    const handleOpenRequest = (e: any) => {
      if (e.detail?.intent) {
        setInitialIntent(e.detail.intent)
      }
      setIsOpen(true)
    }

    window.addEventListener(LEAD_POPUP_EVENT, handleOpenRequest)
    return () => {
      clearTimeout(timer)
      window.removeEventListener(LEAD_POPUP_EVENT, handleOpenRequest)
    }
  }, [])

  const handleClose = () => setIsOpen(false)

  const handleSuccess = () => {
    setTimeout(() => setIsOpen(false), 3000)
  }

  const fields = [
    { name: 'name' as const, label: t.commonForm.name, icon: <User size={12} />, placeholder: 'Ex: Rajesh Kumar', required: true },
    { name: 'mobile' as const, label: t.commonForm.phone, icon: <Phone size={12} />, placeholder: '10-digit number', required: true, type: 'tel' },
    { name: 'email' as const, label: t.commonForm.email, icon: <Mail size={12} />, placeholder: 'your@email.com', required: true, type: 'email' },
    { 
      name: 'wantTo' as const, 
      label: t.leadPopup.fields.wantTo, 
      type: 'select', 
      options: t.leadPopup.options.wantTo,
      required: true 
    },
    { 
      name: 'iAm' as const, 
      label: t.leadPopup.fields.iAm, 
      type: 'select', 
      options: t.leadPopup.options.iAm,
      required: true 
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col">
                {/* Decorative Banner */}
                <div className="bg-navy p-6 pt-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border border-white" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white" />
                  </div>
                  <div className="pw-eyebrow text-gold/80 mb-2">{t.leadPopup.eyebrow}</div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">
                    {t.leadPopup.titlePrefix} <span className="text-gold">{t.leadPopup.titleAccent}</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8">
                  <BaseLeadForm 
                    fields={fields}
                    intent={initialIntent}
                    submitText={t.leadPopup.cta}
                    successTitle={t.leadPopup.successTitle}
                    successMessage={t.leadPopup.successMessage}
                    onSuccess={handleSuccess}
                    grid={true}
                  />

                  <button 
                    type="button"
                    onClick={handleClose}
                    className="w-full text-gray-400 text-[12px] font-medium hover:text-gray-600 transition-colors pt-4 text-center"
                  >
                    {t.leadPopup.maybeLater}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
