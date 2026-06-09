'use client'

import { useEffect, useState, useCallback } from 'react'
import RecordingUploader from '@/components/admin/RecordingUploader'

interface Recordings {
  greeting: { publicUrl: string } | null
  farewell: { publicUrl: string } | null
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recordings>({ greeting: null, farewell: null })

  const reload = useCallback(() => {
    fetch('/api/recordings')
      .then((r) => r.json())
      .then(setRecordings)
      .catch(() => {})
  }, [])

  useEffect(() => { reload() }, [reload])

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Voice Recordings</h2>
      <p className="text-sm text-gray-400">Upload audio files — your voice is what she hears every morning.</p>
      <RecordingUploader type="greeting" currentUrl={recordings.greeting?.publicUrl} onActivated={reload} />
      <RecordingUploader type="farewell" currentUrl={recordings.farewell?.publicUrl} onActivated={reload} />
    </div>
  )
}
