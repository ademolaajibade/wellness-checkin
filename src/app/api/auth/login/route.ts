import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { setSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, pin, email, password } = body

    if (!role || !['admin', 'patient'].includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 })
    }

    await connectDB()

    if (role === 'patient') {
      if (!pin) return Response.json({ error: 'PIN required' }, { status: 400 })
      const user = await User.findOne({ role: 'patient' })
      if (!user?.pinHash) return Response.json({ error: 'Invalid PIN' }, { status: 401 })
      const valid = await bcrypt.compare(String(pin), user.pinHash)
      if (!valid) return Response.json({ error: 'Invalid PIN' }, { status: 401 })
      await setSession({ userId: user._id.toString(), role: 'patient' })
      return Response.json({ ok: true })
    }

    if (role === 'admin') {
      if (!email || !password) return Response.json({ error: 'Email and password required' }, { status: 400 })
      const user = await User.findOne({ role: 'admin', email })
      if (!user?.passwordHash) return Response.json({ error: 'Invalid credentials' }, { status: 401 })
      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) return Response.json({ error: 'Invalid credentials' }, { status: 401 })
      await setSession({ userId: user._id.toString(), role: 'admin' })
      return Response.json({ ok: true })
    }

    return Response.json({ error: 'Invalid role' }, { status: 400 })
  } catch (err) {
    console.error('Login error:', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
