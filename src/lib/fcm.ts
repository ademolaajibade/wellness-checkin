import { getAdminMessaging } from './firebase-admin'
import { connectDB } from './db'
import User from './models/User'

export async function sendPushToPatients(title: string, body: string) {
  await connectDB()
  const patient = await User.findOne({ role: 'patient' })
  if (!patient || patient.fcmTokens.length === 0) return { sent: 0, failed: 0 }

  const messaging = getAdminMessaging()

  const result = await messaging.sendEachForMulticast({
    tokens: patient.fcmTokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        requireInteraction: true,
      },
      fcmOptions: { link: '/checkin' },
    },
  })

  const failedTokens: string[] = []
  result.responses.forEach((resp, idx) => {
    if (!resp.success) failedTokens.push(patient.fcmTokens[idx])
  })

  if (failedTokens.length > 0) {
    patient.fcmTokens = patient.fcmTokens.filter((t: string) => !failedTokens.includes(t))
    await patient.save()
  }

  return { sent: result.successCount, failed: result.failureCount }
}
