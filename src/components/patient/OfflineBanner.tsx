'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-400 text-amber-900 text-center text-sm font-medium py-2 px-4">
      You're offline — your answers will be saved and sent when you reconnect.
    </div>
  )
}
