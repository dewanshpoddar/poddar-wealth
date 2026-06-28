'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { 
  UploadCloud, 
  Lock, 
  Info, 
  Phone, 
  MessageCircle, 
  AlertCircle, 
  RefreshCw, 
  FileText
} from 'lucide-react'
import { useLang } from '@/lib/LangContext'
import { ADVISOR_PHONE } from '@/lib/constants'
import WhatsAppShare from '@/components/WhatsAppShare'
import CalculatorShell from '@/components/calculators/CalculatorShell'

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

const ANALYZER_FAQ = [
  {
    question: 'Is my uploaded policy document secure?',
    answer: 'Yes, absolutely. We do not store or save your files on any server. The text is parsed, analyzed in memory via secure AI, and immediately discarded. Your privacy is 100% protected.'
  },
  {
    question: 'What types of documents can the AI analyze?',
    answer: 'Currently, the AI Policy Analyzer supports official text-based PDF documents issued by LIC (such as policy bonds, premium receipts, or maturity estimates). Scanned image copies may fail if the text is not readable.'
  },
  {
    question: 'Can I upload files larger than 5MB?',
    answer: 'To ensure fast processing times and prevent server timeouts, we limit files to 5MB. If your PDF is larger, try optimizing or compressing it before upload.'
  }
]

export default function PolicyAnalyzerPage() {
  const { t, lang } = useLang()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const resultRef = useRef<HTMLDivElement | null>(null)

  const analyzerT = t.policyAnalyzer || {
    badge: 'AI-POWERED',
    title: 'Understand Your LIC Policy in Seconds',
    subtitle: 'Upload your policy document and get a clear, plain-language summary. No jargon. No confusion.',
    privacyNotice: '🔒 Secure - your document is never stored. Analysis happens instantly.',
    dropzoneTitle: 'Drop your LIC policy PDF here',
    dropzoneSubtitle: 'or click to browse - Max 5MB',
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

  const loadingMessages = [
    analyzerT.loadingReading,
    analyzerT.loadingAnalyzing,
    analyzerT.loadingPreparing
  ]

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
    setHasCalculated(false)
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
    setHasCalculated(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!file) {
      triggerBrowse()
      return
    }

    setLoading(true)
    setLoadingStep(0)
    setError(null)
    setResult(null)
    setHasCalculated(true) // Open result column immediately to show loader smoothly

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
      
      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(analyzerT.errorMessage)
      setResult(null)
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

  const formatValue = (field: typeof detailFields[0], rawVal: any) => {
    if (isNotFound(rawVal)) {
      return (
        <span className="text-gray-400 flex items-center gap-1.5 font-medium italic text-xs">
          <Info size={13} className="shrink-0 text-gray-300" />
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

  return (
    <CalculatorShell
      activeTabId="policy-analyzer"
      title={lang === 'en' ? 'AI Policy Analyzer' : 'एआई पॉलिसी विश्लेषक'}
      infoTooltip="Upload your policy document PDF to verify and review important plan terms, premiums, nominee details, and get unbiased optimization recommendations from our AI."
      faq={ANALYZER_FAQ}
      hasCalculated={hasCalculated}
      onCalculate={handleAnalyze}
      calculateButtonText={
        loading
          ? (lang === 'en' ? 'Analyzing...' : 'विश्लेषण किया जा रहा है...')
          : (!file ? (lang === 'en' ? 'Select Policy PDF' : 'पॉलिसी PDF चुनें') : analyzerT.analyzeButton)
      }
      resultRef={resultRef}
      formFields={
        <div className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={!file && !loading ? triggerBrowse : undefined}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 relative ${
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
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                  <UploadCloud className="text-gray-400 w-6 h-6" />
                </div>
                <h4 className="text-gray-700 font-bold text-xs mb-0.5">
                  {analyzerT.dropzoneTitle}
                </h4>
                <p className="text-gray-400 text-[10px] font-semibold mb-3">
                  {analyzerT.dropzoneSubtitle}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 text-gray-600 font-bold text-[10px] px-3.5 py-1.5 rounded-lg">
                  {lang === 'en' ? 'Select File' : 'फ़ाइल चुनें'}
                </div>
              </>
            )}

            {file && !loading && (
              <div className="w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3 border border-amber-100 animate-pulse">
                  <FileText className="text-amber-500 w-6 h-6" />
                </div>
                <h4 className="text-gray-800 font-bold text-xs truncate max-w-xs mb-0.5">
                  {file.name}
                </h4>
                <p className="text-gray-400 text-[10px] font-semibold mb-4">
                  {formatSize(file.size)}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFile()
                  }}
                  className="bg-slate-50 hover:bg-slate-100 text-gray-500 border border-slate-200/50 font-bold text-[10px] px-4 py-1.5 rounded-lg transition-all"
                >
                  {lang === 'en' ? 'Clear File' : 'फ़ाइल हटाएं'}
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-4">
                <RefreshCw className="text-amber-500 w-8 h-8 animate-spin mb-3" />
                <h4 className="text-gray-700 font-bold text-xs animate-pulse">
                  {loadingMessages[loadingStep]}
                </h4>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-semibold justify-center">
            <Lock size={12} className="text-gray-400 flex-shrink-0" />
            <span>{analyzerT.privacyNotice}</span>
          </div>
        </div>
      }
      resultPanel={
        <div className="space-y-6">
          {/* loading indicator in panel if working */}
          {loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm text-center min-h-[300px]">
              <RefreshCw className="text-amber-500 w-10 h-10 animate-spin mb-4" />
              <h3 className="text-gray-800 font-bold text-sm mb-2">{lang === 'en' ? 'AI Agent At Work' : 'एआई एजेंट कार्य कर रहा है'}</h3>
              <p className="text-gray-500 text-xs max-w-xs">{loadingMessages[loadingStep]}</p>
            </div>
          )}

          {/* error block */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200/50 rounded-2xl p-5 flex gap-3 items-start">
              <AlertCircle className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-800 font-bold text-xs mb-0.5">
                  {lang === 'en' ? 'Analysis Failed' : 'विश्लेषण विफल रहा'}
                </h4>
                <p className="text-red-700 text-[11px] leading-relaxed font-semibold">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={clearFile}
                  className="mt-3 text-[10px] font-bold text-red-800 hover:underline uppercase tracking-wider block"
                >
                  {lang === 'en' ? 'Try another file' : 'दूसरा दस्तावेज चुनें'}
                </button>
              </div>
            </div>
          )}

          {/* result panel display */}
          {result && !loading && (
            <div className="space-y-5 animate-fade-up">
              {/* Summary Block */}
              <div className="bg-amber-50 border border-amber-100/60 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="text-gray-900 text-sm font-bold mb-2">
                  {analyzerT.resultsTitle}
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>

              {/* Details grid list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detailFields.map((field) => {
                  const rawVal = result.details?.[field.key as keyof PolicyDetails]
                  const isFieldNotFound = isNotFound(rawVal)

                  return (
                    <div
                      key={field.key}
                      className={`bg-white border rounded-xl p-4 shadow-sm transition-all duration-200 ${
                        isFieldNotFound ? 'border-gray-100 bg-gray-50/20' : 'border-gray-100'
                      }`}
                    >
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                        {field.label}
                      </div>
                      <div className="text-xs md:text-sm font-bold text-gray-900">
                        {formatValue(field, rawVal)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Recommendation card */}
              <div className="bg-gray-950 text-white rounded-2xl p-5 md:p-6 border border-gray-800 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-2">
                  {analyzerT.recommendationTitle}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed mb-5 font-semibold">
                  {result.recommendation}
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={`https://wa.me/91${ADVISOR_PHONE}?text=${encodeURIComponent(
                      lang === 'en'
                        ? `Hi Ajay Sir, I just analyzed my LIC policy (${result.details?.policyType || ''}) and want to discuss the recommendation.`
                        : `नमस्ते अजय सर, मैंने अपनी एलआईसी पॉलिसी (${result.details?.policyType || ''}) का विश्लेषण किया है और आपकी सलाह पर चर्चा करना चाहता हूँ।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                  >
                    <MessageCircle size={13} />
                    {lang === 'en' ? 'Discuss with Ajay Sir' : 'अजय सर से व्हाट्सएप पर बात करें'}
                  </a>
                  <a
                    href={`tel:+91${ADVISOR_PHONE}`}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-[10px] px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                  >
                    <Phone size={13} />
                    {lang === 'en' ? 'Call Ajay Sir' : 'अजय सर को कॉल करें'}
                  </a>
                </div>
              </div>

              {/* Action shares & reset */}
              <div className="border-t border-gray-200/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <WhatsAppShare
                  text={
                    lang === 'en'
                      ? 'I just analyzed my LIC policy on Poddar Wealth! Try it free: https://poddarwealth.com/calculators/policy-analyzer'
                      : 'मैंने पोद्दार वेल्थ पर अपनी एलआईसी पॉलिसी का विश्लेषण किया! इसे मुफ्त में आज़माएं: https://poddarwealth.com/calculators/policy-analyzer'
                  }
                  className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[10px] px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {lang === 'en' ? 'Share on WhatsApp' : 'व्हाट्सएप पर शेयर करें'}
                </WhatsAppShare>
                
                <button
                  type="button"
                  onClick={clearFile}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/20 font-bold text-[10px] px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  {lang === 'en' ? 'Analyze another policy' : 'दूसरी पॉलिसी का विश्लेषण करें'}
                </button>
              </div>

              <p className="text-[9px] text-gray-400 font-semibold leading-relaxed">
                {analyzerT.disclaimer}
              </p>
            </div>
          )}
        </div>
      }
    />
  )
}
