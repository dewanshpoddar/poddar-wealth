'use client'

import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'

interface VideoEmbedProps {
  videoUrl?: string
  videoId?: string
  platform?: 'youtube' | 'vimeo'
  title?: string
  thumbnailUrl?: string
}

export default function VideoEmbed({
  videoUrl,
  videoId: propVideoId,
  platform = 'youtube',
  title = 'Video player',
  thumbnailUrl: propThumbnailUrl,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnail, setThumbnail] = useState(propThumbnailUrl || '')
  
  // Extract video ID from URL if not explicitly provided
  let finalVideoId = propVideoId || ''
  let finalPlatform = platform

  if (videoUrl) {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      finalPlatform = 'youtube'
      const ytReg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      const match = videoUrl.match(ytReg)
      if (match) finalVideoId = match[1]
    } else if (videoUrl.includes('vimeo.com')) {
      finalPlatform = 'vimeo'
      const vimReg = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
      const match = videoUrl.match(vimReg)
      if (match) finalVideoId = match[1]
    }
  }

  useEffect(() => {
    if (propThumbnailUrl) {
      setThumbnail(propThumbnailUrl)
      return
    }

    if (finalPlatform === 'youtube' && finalVideoId) {
      // YouTube hqdefault is a guaranteed fallback
      setThumbnail(`https://img.youtube.com/vi/${finalVideoId}/hqdefault.jpg`)
    } else if (finalPlatform === 'vimeo' && finalVideoId) {
      fetch(`https://vimeo.com/api/v2/video/${finalVideoId}.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].thumbnail_large) {
            setThumbnail(data[0].thumbnail_large)
          }
        })
        .catch(() => {
          // Fallback placeholder
          setThumbnail('')
        })
    }
  }, [finalVideoId, finalPlatform, propThumbnailUrl])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isPlaying && finalVideoId) {
    const embedUrl =
      finalPlatform === 'youtube'
        ? `https://www.youtube.com/embed/${finalVideoId}?autoplay=1&rel=0`
        : `https://player.vimeo.com/video/${finalVideoId}?autoplay=1`

    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-gray-800">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    )
  }

  return (
    <div
      onClick={handlePlay}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-950 border border-gray-800/80 cursor-pointer group select-none transition-all duration-300 hover:border-amber-500/30 hover:shadow-amber-500/5"
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Video Preview</span>
        </div>
      )}

      {/* Decorative Border & Glow */}
      <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none group-hover:border-amber-500/20 transition-colors duration-300" />

      {/* Play Button Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        {/* Play Icon Circle */}
        <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-950/80 backdrop-blur-md border border-white/20 text-white shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:text-gray-950 group-hover:shadow-amber-500/20">
          <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
          
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-0 group-hover:opacity-70 group-hover:border-amber-400" />
        </div>
        
        {/* Video Title (Overlay) */}
        {title && (
          <div className="px-4 text-center">
            <p className="text-sm sm:text-base font-semibold text-gray-100 line-clamp-1 group-hover:text-amber-400 transition-colors duration-300 drop-shadow-md">
              {title}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
