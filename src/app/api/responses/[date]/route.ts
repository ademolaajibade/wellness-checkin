import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import CheckinResponse from '@/lib/models/CheckinResponse'
import User from '@/lib/models/User'

export async function GET(_request: NextRequest, { params }: { params: { date: string } }) {
  try {
    await requireAuth('admin')
    await connectDB()
    const patient = await User.findOne({ role: 'patient' })
    if (!patient) return Response.json(null)
    const response = await CheckinResponse.findOne({ userId: patient._id, date: params.date })
    return Response.json(response ?? null)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
