'use client'

import { useState, useRef, useEffect } from 'react'

interface DataPoint {
  date: string
  nav: number
}

interface NavChartProps {
  data: DataPoint[]
  isHi?: boolean
}

export default function NavChart({ data, isHi = false }: NavChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(500)
  const [height, setHeight] = useState(300)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })

  // Keep responsive width/height updated
  useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width || 500)
        setHeight(entry.contentRect.height || 300)
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900/40 rounded-2xl border border-gray-800">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Margin values inside the SVG
  const margin = { top: 20, right: 20, bottom: 35, left: 45 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // Extract min and max values to scale the chart
  const navValues = data.map((d) => d.nav)
  const minNav = Math.min(...navValues)
  const maxNav = Math.max(...navValues)
  
  // Pad the range slightly so the chart doesn't touch the top/bottom boundaries
  const navRange = maxNav - minNav
  const padding = navRange * 0.1 || 1.0
  const yMin = Math.max(0, minNav - padding)
  const yMax = maxNav + padding

  // Convert a data point to SVG coordinates
  const getX = (index: number) => {
    if (data.length <= 1) return margin.left + chartWidth / 2
    return margin.left + (index / (data.length - 1)) * chartWidth
  }

  const getY = (val: number) => {
    const range = yMax - yMin
    if (range === 0) return margin.top + chartHeight / 2
    const percentage = (val - yMin) / range
    // SVG y-axis is inverted: 0 at top, height at bottom
    return margin.top + chartHeight - percentage * chartHeight
  }

  // Construct the SVG path string
  let pathD = ''
  let areaD = ''

  if (data.length > 0) {
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.nav) }))
    
    // Build line path
    pathD = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`
    }

    // Build filled area path (under the line)
    areaD = `${pathD} L ${points[points.length - 1].x} ${margin.top + chartHeight} L ${points[0].x} ${margin.top + chartHeight} Z`
  }

  // Handle Mouse Hover Interactions
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left - margin.left
    
    if (mouseX < 0 || mouseX > chartWidth) {
      setHoverIndex(null)
      return
    }

    const pct = mouseX / chartWidth
    const approxIndex = Math.round(pct * (data.length - 1))
    const index = Math.max(0, Math.min(data.length - 1, approxIndex))

    setHoverIndex(index)
    setHoverPos({
      x: getX(index),
      y: getY(data[index].nav)
    })
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  // Format dates for bottom labels
  const getLabelDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Generate grid values for Y axis
  const gridCount = 4
  const gridLines = Array.from({ length: gridCount + 1 }).map((_, i) => {
    const val = yMin + (i / gridCount) * (yMax - yMin)
    return {
      value: val.toFixed(2),
      y: getY(val)
    }
  })

  // Sample a few indices for X-axis labels
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1].filter((idx) => idx < data.length)

  return (
    <div ref={containerRef} className="w-full h-full relative select-none">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow Filter */}
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Y-Axis Horizontal Gridlines & Labels */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={margin.left}
              y1={line.y}
              x2={margin.left + chartWidth}
              y2={line.y}
              stroke="#1f2937"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={margin.left - 10}
              y={line.y + 4}
              textAnchor="end"
              className="text-[10px] fill-gray-500 font-bold font-sans"
            >
              ₹{line.value}
            </text>
          </g>
        ))}

        {/* X-Axis Labels */}
        {labelIndices.map((idx) => {
          const x = getX(idx)
          return (
            <text
              key={idx}
              x={x}
              y={margin.top + chartHeight + 20}
              textAnchor="middle"
              className="text-[10px] fill-gray-500 font-bold font-sans"
            >
              {getLabelDate(data[idx].date)}
            </text>
          )
        })}

        {/* Glow Area Under Curve */}
        {areaD && (
          <path
            d={areaD}
            fill="url(#chart-gradient)"
            className="transition-all duration-300"
          />
        )}

        {/* Line Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]"
          />
        )}

        {/* Hover elements */}
        {hoverIndex !== null && (
          <g>
            {/* Vertical hover line */}
            <line
              x1={hoverPos.x}
              y1={margin.top}
              x2={hoverPos.x}
              y2={margin.top + chartHeight}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            {/* Outer glowing dot */}
            <circle
              cx={hoverPos.x}
              cy={hoverPos.y}
              r="7"
              fill="#f59e0b"
              opacity="0.3"
              className="animate-ping"
            />
            {/* Inner solid dot */}
            <circle
              cx={hoverPos.x}
              cy={hoverPos.y}
              r="4.5"
              fill="#f59e0b"
              stroke="#111827"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      {/* HTML Floating Tooltip overlay for exact hover positioning */}
      {hoverIndex !== null && (
        <div
          className="absolute z-10 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 shadow-xl pointer-events-none text-xs font-semibold text-white flex flex-col gap-0.5"
          style={{
            left: `${Math.max(4, Math.min(width - 124, hoverPos.x - 60))}px`,
            top: `${hoverPos.y - 65 < 4 ? hoverPos.y + 15 : hoverPos.y - 65}px`
          }}
        >
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {getLabelDate(data[hoverIndex].date)}
          </span>
          <span className="text-amber-500 font-bold text-sm">
            ₹{data[hoverIndex].nav.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  )
}
