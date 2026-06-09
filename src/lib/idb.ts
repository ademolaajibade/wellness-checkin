import { get, set, del, keys } from 'idb-keyval'
import { QueuedCheckin } from '@/types'

const PREFIX = 'checkin_queue_'

export async function saveToQueue(item: Omit<QueuedCheckin, 'id'>): Promise<string> {
  const id = `${PREFIX}${Date.now()}_${Math.random().toString(36).slice(2)}`
  await set(id, { ...item, id })
  return id
}

export async function getQueue(): Promise<QueuedCheckin[]> {
  const allKeys = await keys()
  const queueKeys = (allKeys as string[]).filter((k) => k.startsWith(PREFIX))
  const items = await Promise.all(queueKeys.map((k) => get<QueuedCheckin>(k)))
  return items.filter((item): item is QueuedCheckin => item != null)
}

export async function removeFromQueue(id: string): Promise<void> {
  await del(id)
}
