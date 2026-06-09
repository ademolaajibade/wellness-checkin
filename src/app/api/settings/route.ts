import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import AppSettings from '@/lib/models/AppSettings'

export async function GET() {
  try {
    await requireAuth('admin')
    await connectDB()
    const settings = await AppSettings.findOne()
    return Response.json(settings ?? {})
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
    const body = await request.json()
    await connectDB()
    const settings = await AppSettings.findOneAndUpdate({}, body, { upsert: true, new: true })
    return Response.json(settings)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
