'use client'

import { useEffect, useState } from 'react'

export function useFCMToken() {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function register() {
      try {
        if (typeof window === 'undefined' || !('Notification' in window)) return

        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const { getFirebaseMessaging } = await import('@/lib/firebase-client')
        const { getToken } = await import('firebase/messaging')
        const messaging = await getFirebaseMessaging()
        if (!messaging) return

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.getRegistration('/sw.js'),
        })

        if (!currentToken) return
        setToken(currentToken)

        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: currentToken }),
        })
      } catch (err) {
        console.error('FCM token error:', err)
        setError('Could not register for notifications')
      }
    }

    register()
  }, [])

  return { token, error }
}
