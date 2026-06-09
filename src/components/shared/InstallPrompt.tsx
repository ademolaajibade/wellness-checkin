'use client'

import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { useState } from 'react'

export default function InstallPrompt() {
  const { promptEvent, isInstalled, isIOS, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (isInstalled || dismissed) return null

  if (isIOS) {
    return (
      <div className="fixed bottom-4 inset-x-4 z-50 rounded-2xl bg-white shadow-xl border border-rose-100 p-4">
        <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-gray-400 text-lg">✕</button>
        <p className="text-sm font-semibold text-gray-800 mb-1">Add to Home Screen</p>
        <p className="text-xs text-gray-500">
          Tap the <strong>Share</strong> button in Safari, then <strong>"Add to Home Screen"</strong> to get morning notifications.
        </p>
      </div>
    )
  }

  if (!promptEvent) return null

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 rounded-2xl bg-white shadow-xl border border-rose-100 p-4 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Install the app</p>
        <p className="text-xs text-gray-500">Get morning reminders right on your phone.</p>
      </div>
      <button onClick={() => setDismissed(true)} className="text-gray-400 text-sm">Later</button>
      <button
        onClick={install}
        className="rounded-full bg-rose-500 text-white px-4 py-2 text-sm font-semibold active:scale-95 transition-transform"
      >
        Install
      </button>
    </div>
  )
}
