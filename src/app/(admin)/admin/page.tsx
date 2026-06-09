import { connectDB } from '@/lib/db'
import CheckinResponse from '@/lib/models/CheckinResponse'
import User from '@/lib/models/User'
import AppSettings from '@/lib/models/AppSettings'
import StatCard from '@/components/admin/StatCard'
import ResponseCalendar from '@/components/admin/ResponseCalendar'
import { ICheckinResponse } from '@/types'

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const sorted = [...dates].sort((a, b) => b.localeCompare(a))
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

export default async function AdminOverviewPage() {
  await connectDB()
  const patient = await User.findOne({ role: 'patient' })
  const settings = await AppSettings.findOne()

  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 86400000).toISOString().split('T')[0]
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const responses = patient
    ? await CheckinResponse.find({ userId: patient._id, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 })
    : []

  const plain: ICheckinResponse[] = JSON.parse(JSON.stringify(responses))
  const todayResponse = plain.find((r) => r.date === today)
  const streak = calcStreak(plain.map((r) => r.date))
  const lastSeen = plain[0]?.date ?? '—'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Overview</h2>
        <p className="text-sm text-gray-400">
          Notification time: {settings?.notificationTime ?? '08:00'} ({settings?.timezone ?? 'America/Chicago'})
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Today"
          value={todayResponse ? 'Checked in' : 'Not yet'}
          highlight={!todayResponse}
        />
        <StatCard label="Streak" value={`${streak}d`} sub="consecutive days" />
        <StatCard label="Last seen" value={lastSeen} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <ResponseCalendar responses={plain} year={year} month={month} />
      </div>
    </div>
  )
}
