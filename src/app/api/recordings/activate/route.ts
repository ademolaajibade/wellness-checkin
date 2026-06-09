import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Recording from '@/lib/models/Recording'

export async function POST(request: NextRequest) {
  try {
    await requireAuth('admin')
    const { recordingId } = await request.json()
    if (!recordingId) return Response.json({ error: 'recordingId required' }, { status: 400 })

    await connectDB()
    const recording = await Recording.findById(recordingId)
    if (!recording) return Response.json({ error: 'Not found' }, { status: 404 })

    await Recording.updateMany({ type: recording.type }, { active: false })
    recording.active = true
    await recording.save()

    if (typeof window !== 'undefined') {
      navigator.serviceWorker?.controller?.postMessage({
        type: 'CACHE_AUDIO',
        url: recording.publicUrl,
      })
    }

    return Response.json({ ok: true, recording })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
