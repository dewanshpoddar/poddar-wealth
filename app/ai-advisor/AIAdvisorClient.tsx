'use client'
import dynamic from 'next/dynamic'

const AIChatWidget = dynamic(
  () => import('@/src/features/ai-agent/components/ChatBot'),
  { ssr: false, loading: () => (
    <div className="animate-pulse bg-gray-100 rounded-2xl h-[500px] w-full flex items-center justify-center">
      <p className="text-gray-400">Loading Poddar Ji...</p>
    </div>
  )}
)

export default function AIAdvisorClient() {
  return <AIChatWidget />
}
