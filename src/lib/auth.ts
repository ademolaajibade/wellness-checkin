import { getIronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionData } from '@/types'

const PATIENT_TTL = 30 * 24 * 60 * 60 // 30 days
const ADMIN_TTL = 7 * 24 * 60 * 60    // 7 days

function sessionOptions(ttl: number): SessionOptions {
  return {
    password: process.env.IRON_SESSION_SECRET!,
    cookieName: 'wellness_session',
    ttl,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  }
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions(PATIENT_TTL))
}

export async function setSession(data: SessionData) {
  const ttl = data.role === 'admin' ? ADMIN_TTL : PATIENT_TTL
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions(ttl))
  session.userId = data.userId
  session.role = data.role
  await session.save()
  return session
}

export async function clearSession() {
  const session = await getSession()
  session.destroy()
}

export async function requireAuth(role?: 'admin' | 'patient'): Promise<SessionData> {
  const session = await getSession()
  console.log('Session data:', session)
  if (!session.userId) throw new Error('Unauthorized')
  if (role && session.role !== role) throw new Error('Forbidden')
  return { userId: session.userId, role: session.role! }
}
