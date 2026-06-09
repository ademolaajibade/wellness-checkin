'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type AudioState = 'idle' | 'loading' | 'playing' | 'ended' | 'error' | 'blocked'

export function useAudio(url: string | null | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioState>('idle')

  useEffect(() => {
    if (!url) return
    const audio = new Audio(url)
    ;(audio as HTMLAudioElement & { playsInline: boolean }).playsInline = true
    audio.preload = 'auto'
    audioRef.current = audio

    audio.addEventListener('ended', () => setState('ended'))
    audio.addEventListener('error', () => setState('error'))
    audio.addEventListener('canplaythrough', () => {
      if (state === 'loading') setState('idle')
    })

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const play = useCallback(async () => {
    if (!audioRef.current) return
    setState('loading')
    try {
      await audioRef.current.play()
      setState('playing')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setState('blocked')
      } else {
        setState('error')
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setState('idle')
  }, [])

  return { state, play, reset }
}
