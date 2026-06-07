'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { UploadCloud, Lock, Info, Phone, MessageCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { ADVISOR_PHONE } from '@/lib/constants'
import WhatsAppShare from '@/components/WhatsAppShare'

interface PolicyDetails {
  policyType?: string
  policyNumber?: string
  sumAssured?: string | number
  premiumAmount?: string | number
  startDate?: string
  maturityDate?: string
  nominee?: string
  status?: string
  bonusAccrued?: string
  loanOutstanding?: string
  benefitsRiders?: string
}

interface AnalysisResult {
  summary: string
  details: PolicyDetails
  recommendation: string
}

export default function PolicyDocumentAnalyzerPage() {
  const { t, lang } = useLang()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzerT = t.policyAnalyzer || {
    badge: 'AI-POWERED',
    title: 'Understand Your LIC Policy in Seconds',
    subtitle: 'Upload your policy document and get a clear, plain-language summary. No jargon. No confusion.',
    privacyNotice: '🔒 Secure — your document is never stored. Analysis happens instantly.',
    dropzoneTitle: 'Drop your LIC policy PDF here',
    dropzoneSubtitle: 'or click to browse — Max 5MB',
    analyzeButton: 'Analyze Policy',
    loadingReading: 'Reading your policy document...',
    loadingAnalyzing: 'Analyzing with AI...',
    loadingPreparing: 'Preparing your summary...',
    resultsTitle: 'Your Policy Summary',
    recommendationTitle: 'What We Recommend',
    discussCta: 'Discuss with Ajay sir',
    errorMessage: "We couldn't read this document. It might be a scanned copy. Try uploading a text-based PDF, or call Ajay sir for a free policy review.",
    disclaimer: 'Disclaimer: This analysis is AI-generated based on the document uploaded. Please verify the details with your official policy document or consult a licensed advisor before making decisions.',
    details: {
      policyType: 'Policy Type',
      policyNumber: 'Policy Number',
      sumAssured: 'Sum Assured',
      premiumAmount: 'Premium Amount',
      startDate: 'Start Date',
      maturityDate: 'Maturity Date',
      nominee: 'Nominee',
      status: 'Status',
      bonusAccrued: 'Bonus Accrued',
      loanOutstanding: 'Loan Outstanding',
      benefitsRiders: 'Benefits & Riders'
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError(
        lang === 'en'
          ? 'Only PDF documents are supported. Please select a text-based LIC policy PDF.'
          : 'केवल PDF दस्तावेज समर्थित हैं। कृपया एक टेक्स्ट-आधारित LIC पॉलिसी PDF चुनें।'
      )
      setFile(null)
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(
        lang === 'en'
          ? 'File size exceeds 5MB limit. Please upload a smaller PDF.'
          : 'फाइल का आकार 5MB से अधिक है। कृपया एक छोटी PDF अपलोड करें।'
      )
      setFile(null)
      return
    }

    setError(null)
    setFile(selectedFile)
    setResult(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const clearFile = () => {
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setLoadingStep(0)
    setError(null)
    setResult(null)

    // Progressive loader interval
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev))
    }, 2000)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/analyzers/policy-document', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('API failed')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(analyzerT.errorMessage)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const isNotFound = (val: any) => {
    if (val === null || val === undefined || val === '') return true
    const str = String(val).toLowerCase().trim()
    return str === 'not found' || str === 'notfound' || str === 'n/a' || str === 'none'
  }

  const detailFields = [
    { key: 'policyType', label: analyzerT.details.policyType },
    { key: 'policyNumber', label: analyzerT.details.policyNumber },
    { key: 'sumAssured', label: analyzerT.details.sumAssured, formatCurrency: true },
    { key: 'premiumAmount', label: analyzerT.details.premiumAmount, formatCurrency: true },
    { key: 'startDate', label: analyzerT.details.startDate },
    { key: 'maturityDate', label: analyzerT.details.maturityDate },
    { key: 'nominee', label: analyzerT.details.nominee },
    { key: 'status', label: analyzerT.details.status },
    { key: 'bonusAccrued', label: analyzerT.details.bonusAccrued },
    { key: 'loanOutstanding', label: analyzerT.details.loanOutstanding },
    { key: 'benefitsRiders', label: analyzerT.details.benefitsRiders },
  ]

  const formatValue = (field: typeof detailFields[0], rawVal: any) => {
    if (isNotFound(rawVal)) {
      return (
        <span className="text-gray-400 flex items-center gap-1.5 font-medium italic text-sm">
          <Info size={14} className="shrink-0 text-gray-300" />
          {lang === 'en' ? 'Not found' : 'नहीं मिला'}
        </span>
      )
    }

    if (field.formatCurrency) {
      const num = parseFloat(String(rawVal).replace(/[^0-9.]/g, ''))
      if (!isNaN(num)) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(num)
      }
    }
    return String(rawVal)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const loadingMessages = [
    analyzerT.loadingReading,
    analyzerT.loadingAnalyzing,
    analyzerT.loadingPreparing
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-gray-950 text-white pt-24 pb-16 px-4 md:px-8 border-b border-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {analyzerT.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 max-w-2xl mx-auto leading-tight">
            {analyzerT.title}
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {analyzerT.subtitle}
          </p>
        </div>
      </section>

      {/* Upload Zone & Instructions */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 md:p-10 mb-8">
          
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={!file && !loading ? triggerBrowse : undefined}
            className={`border-2 border-dashed rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
              dragActive ? 'border-amber-500 bg-amber-50/20' : 'border-gray-200 hover:border-amber-500/50'
            } ${!file && !loading ? 'cursor-pointer' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
              disabled={loading}
            />

            {!file && !loading && (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 group-hover:scale-105 transition-transform">
                  <UploadCloud className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-gray-700 font-bold text-sm md:text-base mb-1">
                  {analyzerT.dropzoneTitle}
                </h3>
                <p className="text-gray-400 text-xs font-semibold mb-4">
                  {analyzerT.dropzoneSubtitle}
                </p>
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/50 text-gray-600 font-bold text-xs px-4 py-2 rounded-xl">
                  {lang === 'en' ? 'Select File' : 'फ़ाइल चुनें'}
                </div>
              </>
            )}

            {file && !loading && (
              <div className="w-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
                  <FileText className="text-amber-500 w-8 h-8" />
                </div>
                <h3 className="text-gray-800 font-bold text-sm truncate max-w-xs md:max-w-md mb-1">
                  {file.name}
                </h3>
                <p className="text-gray-400 text-xs font-medium mb-6">
                  {formatSize(file.size)}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAnalyze()
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    {analyzerT.analyzeButton}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      clearFile()
                    }}
                    className="bg-slate-50 hover:bg-slate-100 text-gray-500 border border-slate-200/50 font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                  >
                    {lang === 'en' ? 'Clear' : 'साफ़ करें'}
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-6">
                <RefreshCw className="text-amber-500 w-10 h-10 animate-spin mb-4" />
                <h3 className="text-gray-700 font-bold text-sm md:text-base animate-pulse">
                  {loadingMessages[loadingStep]}
                </h3>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-5 text-gray-500 text-[11px] font-semibold justify-center">
            <Lock size={12} className="text-gray-400 flex-shrink-0" />
            <span>{analyzerT.privacyNotice}</span>
          </div>
        </div>

        {/* Errors Container */}
        {error && (
          <div className="bg-red-50 border border-red-200/50 rounded-2xl p-6 mb-8 flex gap-3.5 items-start">
            <AlertCircle className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-red-800 font-bold text-sm mb-1">
                {lang === 'en' ? 'Analysis Failed' : 'विश्लेषण विफल रहा'}
              </h4>
              <p className="text-red-700 text-xs leading-relaxed font-medium">
                {error}
              </p>
              {file && (
                <button
                  onClick={clearFile}
                  className="mt-3 text-[11px] font-bold text-red-800 hover:underline uppercase tracking-wider"
                >
                  {lang === 'en' ? 'Try another file' : 'दूसरा दस्तावेज चुनें'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Sections */}
        {result && (
          <div className="space-y-8 animate-fade-up">
            
            {/* Summary Block */}
            <div className="bg-amber-50 border border-amber-100/60 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-navy text-lg md:text-xl font-bold mb-3">
                {analyzerT.resultsTitle}
              </h2>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                {result.summary}
              </p>
            </div>

            {/* Parameter Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailFields.map((field) => {
                const rawVal = result.details?.[field.key as keyof PolicyDetails]
                const isFieldNotFound = isNotFound(rawVal)

                return (
                  <div
                    key={field.key}
                    className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-200 ${
                      isFieldNotFound ? 'border-gray-100 bg-gray-50/20' : 'border-gray-100'
                    }`}
                  >
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      {field.label}
                    </div>
                    <div className="text-sm md:text-base font-bold text-navy">
                      {formatValue(field, rawVal)}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recommendation block */}
            <div className="bg-gray-950 text-white rounded-2xl p-6 md:p-8 border border-gray-800 shadow-xl">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                {analyzerT.recommendationTitle}
              </h3>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                {result.recommendation}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                    lang === 'en'
                      ? `Hi Ajay Sir, I just analyzed my LIC policy (${result.details?.policyType || ''}) and want to discuss the recommendation.`
                      : `नमस्ते अजय सर, मैंने अपनी एलआईसी पॉलिसी (${result.details?.policyType || ''}) का विश्लेषण किया है और आपकी सलाह पर चर्चा करना चाहता हूँ।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <MessageCircle size={14} />
                  {lang === 'en' ? 'Discuss with Ajay Sir' : 'अजय सर से व्हाट्सएप पर बात करें'}
                </a>
                <a
                  href={`tel:+91${ADVISOR_PHONE}`}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Phone size={14} />
                  {lang === 'en' ? 'Call Ajay Sir' : 'अजय सर को कॉल करें'}
                </a>
              </div>
            </div>

            {/* Share & Disclaimer */}
            <div className="border-t border-gray-200/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <WhatsAppShare
                  text={
                    lang === 'en'
                      ? 'I just analyzed my LIC policy on Poddar Wealth! Try it free: https://poddarwealth.com/analyzers/policy-document'
                      : 'मैंने पोद्दार वेल्थ पर अपनी एलआईसी पॉलिसी का विश्लेषण किया! इसे मुफ्त में आज़माएं: https://poddarwealth.com/analyzers/policy-document'
                  }
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {lang === 'en' ? 'Share on WhatsApp' : 'व्हाट्सएप पर शेयर करें'}
                </WhatsAppShare>
              </div>
              
              <button
                onClick={clearFile}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/20 font-bold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                {lang === 'en' ? 'Analyze another policy' : 'दूसरी पॉलिसी का विश्लेषण करें'}
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
              {analyzerT.disclaimer}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
