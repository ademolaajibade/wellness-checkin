'use client'

import { useEffect } from 'react'
import { useAudio } from '@/hooks/useAudio'

interface Props {
  url: string | null | undefined
  onEnded?: () => void
  autoPlay?: boolean
}

export default function AudioPlayer({ url, onEnded, autoPlay = true }: Props) {
  const { state, play } = useAudio(url)

  useEffect(() => {
    if (autoPlay && url) play()
  }, [url, autoPlay, play])

  useEffect(() => {
    if (state === 'ended') onEnded?.()
  }, [state, onEnded])

  if (!url) {
    return null
  }

  if (state === 'blocked') {
    return (
      <button
        onClick={play}
        className="flex items-center gap-2 rounded-full bg-rose-50 px-5 py-3 text-rose-600 border border-rose-200 active:scale-95 transition-transform"
      >
        <span className="text-lg">▶</span>
        <span className="text-sm font-medium">Tap to play message</span>
      </button>
    )
  }

  if (state === 'error') {
    return (
      <button
        onClick={onEnded}
        className="text-sm text-gray-400 underline"
      >
        Skip audio
      </button>
    )
  }

  return (
    <div className="flex items-center justify-center gap-1 h-8" aria-label="Playing audio">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-rose-400"
          style={{
            height: state === 'playing' ? undefined : '8px',
            animation: state === 'playing' ? `wave 1s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 6px; }
          to { height: 28px; }
        }
      `}</style>
    </div>
  )
}
