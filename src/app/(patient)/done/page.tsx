'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AudioPlayer from '@/components/patient/AudioPlayer'

export default function DonePage() {
  const router = useRouter()
  const [farewellUrl, setFarewellUrl] = useState<string | null>(null)
  const [audioEnded, setAudioEnded] = useState(false)

  useEffect(() => {
    fetch('/api/recordings')
      .then((r) => r.json())
      .then((data) => setFarewellUrl(data.farewell?.publicUrl ?? null))
      .catch(() => {})
  }, [])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6 gap-8">
      <div className="text-center">
        <p className="text-5xl mb-4">💕</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">All done!</h1>
        <p className="text-gray-400 text-sm">Thank you for checking in today.</p>
      </div>

      {farewellUrl && <AudioPlayer url={farewellUrl} onEnded={() => setAudioEnded(true)} />}

      {(audioEnded || !farewellUrl) && (
        <div className="text-center">
          <p className="text-gray-500 mb-6">See you tomorrow 💕</p>
          <button
            onClick={() => router.push('/checkin')}
            className="text-sm text-rose-400 underline"
          >
            Back to check-in
          </button>
        </div>
      )}
    </main>
  )
}
