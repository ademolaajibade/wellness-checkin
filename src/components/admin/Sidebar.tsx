'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/responses', label: 'Responses', icon: '📋' },
  { href: '/questions', label: 'Questions', icon: '❓' },
  { href: '/recordings', label: 'Recordings', icon: '🎙️' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth')
    router.refresh()
  }

  return (
    <nav className="flex flex-col h-full p-4 gap-1 bg-white border-r border-gray-100">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-bold text-rose-500">Wellness Check-In</h1>
        <p className="text-xs text-gray-400">Admin</p>
      </div>
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
            ${pathname === href ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'}
          `}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
      <div className="flex-1" />
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <span>🚪</span>
        <span>Log out</span>
      </button>
    </nav>
  )
}
