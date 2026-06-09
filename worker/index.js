// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Good morning! 🌸', {
      body: data.body || 'Time for your daily check-in.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      requireInteraction: true,
      data: { url: '/checkin' },
    })
  )
})

// Open /checkin when notification is tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        const existing = windowClients.find((c) => c.url.includes('/checkin'))
        if (existing) return existing.focus()
        return clients.openWindow(event.notification.data?.url || '/checkin')
      })
  )
})

// Background sync: drain queued check-ins when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-checkin') {
    event.waitUntil(drainCheckinQueue())
  }
})

async function drainCheckinQueue() {
  const db = await openDB()
  const tx = db.transaction('keyval', 'readonly')
  const store = tx.objectStore('keyval')
  const keys = await promisifyRequest(store.getAllKeys())

  for (const key of keys) {
    if (!String(key).startsWith('checkin_queue_')) continue
    const readTx = db.transaction('keyval', 'readonly')
    const item = await promisifyRequest(readTx.objectStore('keyval').get(key))
    if (!item) continue

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: item.date, answers: item.answers, submittedOffline: true }),
      })
      if (res.ok) {
        const delTx = db.transaction('keyval', 'readwrite')
        await promisifyRequest(delTx.objectStore('keyval').delete(key))
      }
    } catch {
      // Will retry on next sync
    }
  }
}

// Cache audio files when admin activates a new recording
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_AUDIO' && event.data.url) {
    caches.open('audio-files').then((cache) => cache.add(event.data.url))
  }
})

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('keyval-store', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('keyval')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
