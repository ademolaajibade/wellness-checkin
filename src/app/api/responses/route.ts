import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import CheckinResponse from '@/lib/models/CheckinResponse'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await requireAuth('admin')
    const { searchParams } = request.nextUrl
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    await connectDB()
    const patient = await User.findOne({ role: 'patient' })
    if (!patient) return Response.json([])

    const query: Record<string, unknown> = { userId: patient._id }
    if (from || to) {
      query.date = {}
      if (from) (query.date as Record<string, string>).$gte = from
      if (to) (query.date as Record<string, string>).$lte = to
    }

    const responses = await CheckinResponse.find(query).sort({ date: -1 }).limit(90)
    return Response.json(responses)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
