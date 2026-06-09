'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Mode = 'patient' | 'admin'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('patient')
  const [pin, setPin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handlePin(digit: string) {
    if (pin.length >= 4) return
    setPin((p) => p + digit)
    setError('')
  }

  function deleteLast() {
    setPin((p) => p.slice(0, -1))
    setError('')
  }

  async function submit() {
    setLoading(true)
    setError('')
    const body = mode === 'patient'
      ? { role: 'patient', pin }
      : { role: 'admin', email, password }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push(mode === 'patient' ? '/checkin' : '/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      if (mode === 'patient') setPin('')
    }
    setLoading(false)
  }

  // Auto-submit when 4 digits entered
  if (mode === 'patient' && pin.length === 4 && !loading) {
    setTimeout(submit, 100)
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Good morning</h1>
          <p className="text-gray-400 text-sm">
            {mode === 'patient' ? 'Enter your 4-digit PIN' : 'Sign in to your account'}
          </p>
        </div>

        {mode === 'patient' ? (
          <>
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                    i < pin.length ? 'bg-rose-500 border-rose-500' : 'border-gray-300'
                  }`}
                />
              ))}
            </div>

            {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-3 gap-3 mb-4">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => {
                if (!key) return <div key={i} />
                return (
                  <button
                    key={i}
                    onClick={() => key === '⌫' ? deleteLast() : handlePin(key)}
                    disabled={loading}
                    className="h-16 rounded-2xl text-xl font-semibold text-gray-700 bg-white border border-gray-200 active:scale-95 active:bg-rose-50 transition-all shadow-sm"
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); submit() }} className="space-y-3 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-rose-500 text-white font-semibold py-3 active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <button
          onClick={() => { setMode(mode === 'patient' ? 'admin' : 'patient'); setPin(''); setError('') }}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          {mode === 'patient' ? 'Admin login →' : '← Back to Sarah\'s login'}
        </button>
      </div>
    </main>
  )
}
