import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import AppSettings from '@/lib/models/AppSettings'

export async function GET() {
  try {
    await requireAuth('admin')
    await connectDB()
    const settings = await AppSettings.findOne()
    return Response.json({
      time: settings?.notificationTime ?? '08:00',
      timezone: settings?.timezone ?? 'America/Chicago',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth('admin')
    const { time, timezone } = await request.json()
    if (!time || !timezone) return Response.json({ error: 'time and timezone required' }, { status: 400 })
    await connectDB()
    const settings = await AppSettings.findOneAndUpdate(
      {},
      { notificationTime: time, timezone },
      { upsert: true, new: true }
    )
    return Response.json({ time: settings.notificationTime, timezone: settings.timezone })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
