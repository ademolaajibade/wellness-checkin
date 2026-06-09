import { connectDB } from '@/lib/db'
import AppSettings from '@/lib/models/AppSettings'
import NotificationTimePicker from '@/components/admin/NotificationTimePicker'

export default async function SettingsPage() {
  await connectDB()
  const settings = await AppSettings.findOne()

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Settings</h2>
      <NotificationTimePicker
        initialTime={settings?.notificationTime ?? '08:00'}
        initialTimezone={settings?.timezone ?? 'America/Chicago'}
      />
    </div>
  )
}
