import { clearSession } from '@/lib/auth'

export async function POST() {
  try {
    await clearSession()
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
