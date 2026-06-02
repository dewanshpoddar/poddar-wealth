'use client'
import { useRef, useState, useEffect, type ReactNode } from 'react'

export default function LazySection({ children, height = 'h-32' }: { children: ReactNode; height?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={ref}>
      {visible ? children : <div className={`animate-pulse bg-gray-50 rounded-xl ${height} w-full`} />}
    </div>
  )
}
