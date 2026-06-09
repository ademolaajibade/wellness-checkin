'use client'

import { useState, useRef } from 'react'
import { RecordingType } from '@/types'

interface Props {
  type: RecordingType
  currentUrl?: string | null
  onActivated: () => void
}

type UploadState = 'idle' | 'uploading' | 'activating' | 'done' | 'error'

export default function RecordingUploader({ type, currentUrl, onActivated }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (mp3, m4a, etc.)')
      return
    }
    setUploadState('uploading')
    setProgress(0)

    const res = await fetch(`/api/recordings/upload?type=${type}`)
    if (!res.ok) { setUploadState('error'); return }
    const { uploadUrl, recordingId } = await res.json()

    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
    })
    xhr.addEventListener('load', async () => {
      if (xhr.status < 200 || xhr.status >= 300) { setUploadState('error'); return }
      setUploadState('activating')
      const activateRes = await fetch('/api/recordings/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId }),
      })
      if (activateRes.ok) {
        setUploadState('done')
        onActivated()
      } else {
        setUploadState('error')
      }
    })
    xhr.addEventListener('error', () => setUploadState('error'))
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', 'audio/mpeg')
    xhr.send(file)
  }

  const label = type === 'greeting' ? 'Greeting' : 'Farewell'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label} Recording</p>
          <p className="text-xs text-gray-400">{type === 'greeting' ? 'Plays when she opens the app' : 'Plays after she finishes'}</p>
        </div>
        {uploadState === 'done' && <span className="text-xs text-green-600 font-medium">Active ✓</span>}
      </div>

      {currentUrl && (
        <audio controls src={currentUrl} className="w-full h-8 mb-3" />
      )}

      {uploadState === 'uploading' && (
        <div className="mb-3">
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-rose-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}% uploaded</p>
        </div>
      )}

      {uploadState === 'activating' && <p className="text-xs text-gray-400 mb-3">Activating…</p>}
      {uploadState === 'error' && <p className="text-xs text-red-500 mb-3">Upload failed. Try again.</p>}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      <button
        onClick={() => { setUploadState('idle'); inputRef.current?.click() }}
        disabled={uploadState === 'uploading' || uploadState === 'activating'}
        className="w-full rounded-xl border-2 border-dashed border-rose-200 py-4 text-sm text-rose-400 font-medium hover:border-rose-300 hover:bg-rose-50 transition-colors disabled:opacity-50"
      >
        {uploadState === 'idle' || uploadState === 'error' || uploadState === 'done'
          ? `Upload ${label} Audio`
          : 'Uploading…'}
      </button>
    </div>
  )
}
