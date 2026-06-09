import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import AppSettings from '@/lib/models/AppSettings'
import { sendPushToPatients } from '@/lib/fcm'

export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get('x-cron-secret')
    const isValidCron = cronSecret === process.env.CRON_SECRET

    if (!isValidCron) {
      const session = await getSession()
      if (!session.userId || session.role !== 'admin') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const result = await sendPushToPatients(
      "Good morning! 🌸",
      "Time for your daily check-in. How are you feeling today?"
    )

    await connectDB()
    await AppSettings.findOneAndUpdate({}, { lastNotificationSent: new Date() }, { upsert: true })

    return Response.json({ ok: true, ...result })
  } catch {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
