import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Question from '@/lib/models/Question'

export async function GET() {
  try {
    await requireAuth()
    await connectDB()
    const questions = await Question.find().sort({ order: 1 })
    return Response.json(questions)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
