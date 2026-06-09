import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Recording from '@/lib/models/Recording'
import { getR2UploadUrl, getR2PublicUrl } from '@/lib/r2'

export async function GET(request: NextRequest) {
  try {
    await requireAuth('admin')
    const type = request.nextUrl.searchParams.get('type')
    if (type !== 'greeting' && type !== 'farewell') {
      return Response.json({ error: 'Invalid type' }, { status: 400 })
    }

    const key = `recordings/${type}-${Date.now()}.mp3`
    const uploadUrl = await getR2UploadUrl(key)
    const publicUrl = getR2PublicUrl(key)

    await connectDB()
    const recording = await Recording.create({
      type,
      storageUrl: key,
      publicUrl,
      active: false,
    })

    return Response.json({ uploadUrl, recordingId: recording._id.toString(), publicUrl })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('[recordings/upload]', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
