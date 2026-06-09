import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Question from '@/lib/models/Question'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth('admin')
    const { text } = await request.json()
    if (!text?.trim()) return Response.json({ error: 'Text required' }, { status: 400 })
    await connectDB()
    const question = await Question.findByIdAndUpdate(
      params.id,
      { text: text.trim(), updatedAt: new Date() },
      { new: true }
    )
    if (!question) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(question)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Unauthorized' || msg === 'Forbidden') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
