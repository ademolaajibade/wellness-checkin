import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Question from '@/lib/models/Question'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth('admin')
    const { text, options } = await request.json()
    if (!text?.trim()) return Response.json({ error: 'Text required' }, { status: 400 })
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return Response.json({ error: 'At least 2 options required' }, { status: 400 })
      }
      const valid = options.every(
        (o: unknown) =>
          typeof o === 'object' &&
          o !== null &&
          typeof (o as Record<string, unknown>).value === 'string' &&
          typeof (o as Record<string, unknown>).label === 'string' &&
          ['green', 'amber', 'rose', 'blue', 'purple'].includes((o as Record<string, unknown>).color as string)
      )
      if (!valid) return Response.json({ error: 'Invalid options' }, { status: 400 })
    }
    await connectDB()
    const update: Record<string, unknown> = { text: text.trim(), updatedAt: new Date() }
    if (options !== undefined) update.options = options
    const question = await Question.findByIdAndUpdate(params.id, update, { new: true })
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
