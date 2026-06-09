import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth('patient')
    const { token } = await request.json()
    if (!token) return Response.json({ error: 'token required' }, { status: 400 })

    await connectDB()
    await User.updateOne(
      { _id: session.userId },
      { $addToSet: { fcmTokens: token } }
    )
    return Response.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
