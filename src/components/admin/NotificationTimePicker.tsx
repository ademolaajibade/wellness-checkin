'use client'

import { useState } from 'react'

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
]

interface Props {
  initialTime: string
  initialTimezone: string
}

export default function NotificationTimePicker({ initialTime, initialTimezone }: Props) {
  const [time, setTime] = useState(initialTime)
  const [timezone, setTimezone] = useState(initialTimezone)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/notifications/schedule', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time, timezone }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function sendTest() {
    setSending(true)
    setSendResult(null)
    const res = await fetch('/api/notifications/send', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setSendResult(`Sent to ${data.sent} device(s)`)
    } else {
      setSendResult('Failed to send')
    }
    setSending(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Notification Schedule</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={sendTest}
          disabled={sending}
          className="rounded-xl border border-rose-200 text-rose-500 text-sm font-medium px-4 py-2 hover:bg-rose-50 transition-colors disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Send test notification'}
        </button>
        {sendResult && <span className="text-xs text-gray-500">{sendResult}</span>}
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600">Saved!</span>}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-rose-500 text-white text-sm font-medium px-4 py-2 disabled:opacity-50 active:scale-95 transition-transform"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
