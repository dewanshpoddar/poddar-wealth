'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ShieldCheck, Mail, Phone, User, Rocket } from 'lucide-react'

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    intent: 'General Consultation'
  })

  useEffect(() => {
    // Check if user already dismissed the popup
    const isDismissed = localStorage.getItem('poddar_lead_popup_status')
    if (isDismissed) return

    // Show popup after 4 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus('success')
        localStorage.setItem('poddar_lead_popup_status', 'completed')
        // Close after 3 seconds on success
        setTimeout(() => setIsOpen(false), 3000)
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('poddar_lead_popup_status', 'dismissed')
  }

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
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {status === 'success' ? (
                <div className="p-10 text-center flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-navy">Journey Started!</h3>
                  <p className="text-gray-500">Ajay Kumar Poddar or our senior advisor will contact you within 24 hours.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Decorative Banner */}
                  <div className="bg-navy p-6 pt-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border border-white" />
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white" />
                    </div>
                    <div className="pw-eyebrow text-gold/80 mb-2">Poddar Wealth Management</div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">
                      Secure Your Family's <span className="text-gold">Financial Future</span>
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                          required
                          type="text"
                          placeholder="Ex: Rajesh Kumar"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-13 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            required
                            type="tel"
                            placeholder="10-digit number"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-13 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input
                            required
                            type="email"
                            placeholder="your@email.com"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-13 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">I am interested in</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-13 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all appearance-none cursor-pointer"
                        value={formData.intent}
                        onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                      >
                        <option>Life Insurance Protection</option>
                        <option>Health & Medical Cover</option>
                        <option>Retirement & Pension</option>
                        <option>Child Education Planning</option>
                        <option>Complete Financial Checkup</option>
                      </select>
                    </div>

                    <p className="text-[11px] text-gray-400 text-center italic">
                      <ShieldCheck size={12} className="inline mr-1" />
                      Your data is secure and will never be shared.
                    </p>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-gold hover:bg-gold-hover text-white font-bold h-[52px] rounded-xl shadow-lg shadow-gold/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                      {status === 'sending' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Rocket size={18} />
                          Start My Free Consultation
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={handleClose}
                      className="w-full text-gray-400 text-[12px] font-medium hover:text-gray-600 transition-colors pt-2"
                    >
                      Maybe later, I'll explore first
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
