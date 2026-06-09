import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Recording from '@/lib/models/Recording'

export async function GET() {
  try {
    await requireAuth('patient')
    await connectDB()
    const [greeting, farewell] = await Promise.all([
      Recording.findOne({ type: 'greeting', active: true }),
      Recording.findOne({ type: 'farewell', active: true }),
    ])
    return Response.json({
      greeting: greeting ? { publicUrl: greeting.publicUrl } : null,
      farewell: farewell ? { publicUrl: farewell.publicUrl } : null,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
