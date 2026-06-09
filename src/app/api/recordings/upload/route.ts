import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Recording from '@/lib/models/Recording'
import { getAdminStorage } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    await requireAuth('admin')
    const type = request.nextUrl.searchParams.get('type')
    if (type !== 'greeting' && type !== 'farewell') {
      return Response.json({ error: 'Invalid type' }, { status: 400 })
    }

    const filename = `recordings/${type}-${Date.now()}.mp3`
    const bucket = getAdminStorage().bucket()
    const file = bucket.file(filename)

    const [signedUrl] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType: 'audio/mpeg',
    })

    const storageUrl = `gs://${bucket.name}/${filename}`
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

    await connectDB()
    const recording = await Recording.create({
      type,
      storageUrl,
      publicUrl,
      active: false,
    })

    return Response.json({ uploadUrl: signedUrl, recordingId: recording._id.toString(), publicUrl })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
