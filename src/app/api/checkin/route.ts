import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import CheckinResponse from '@/lib/models/CheckinResponse'

export async function GET() {
  try {
    const session = await requireAuth('patient')
    const today = new Date().toISOString().split('T')[0]
    await connectDB()
    const existing = await CheckinResponse.findOne({ userId: session.userId, date: today })
    return Response.json({ submitted: !!existing })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth('patient')
    const { date, answers, notes, submittedOffline } = await request.json()

    if (!date || !Array.isArray(answers) || answers.length === 0) {
      return Response.json({ error: 'date and answers required' }, { status: 400 })
    }

    await connectDB()

    try {
      const response = await CheckinResponse.create({
        userId: session.userId,
        date,
        answers,
        notes: typeof notes === 'string' ? notes.trim() : '',
        submittedOffline: !!submittedOffline,
        syncedAt: submittedOffline ? new Date() : null,
      })
      return Response.json({ ok: true, id: response._id.toString() })
    } catch (dbErr: unknown) {
      if ((dbErr as { code?: string | number }).code === 11000 || (dbErr as { code?: string | number }).code === '11000') {
        return Response.json({ ok: true, alreadySubmitted: true })
      }
      throw dbErr
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
