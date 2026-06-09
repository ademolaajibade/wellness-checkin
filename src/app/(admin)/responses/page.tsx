import { connectDB } from '@/lib/db'
import CheckinResponse from '@/lib/models/CheckinResponse'
import User from '@/lib/models/User'
import ResponseRow from '@/components/admin/ResponseRow'
import { ICheckinResponse } from '@/types'

export default async function ResponsesPage() {
  await connectDB()
  const patient = await User.findOne({ role: 'patient' })
  const responses = patient
    ? await CheckinResponse.find({ userId: patient._id }).sort({ date: -1 }).limit(90)
    : []
  const plain: ICheckinResponse[] = JSON.parse(JSON.stringify(responses))

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Response History</h2>
      {plain.length === 0 ? (
        <p className="text-sm text-gray-400">No responses yet.</p>
      ) : (
        <div className="space-y-2">
          {plain.map((r) => <ResponseRow key={r._id} response={r} />)}
        </div>
      )}
    </div>
  )
}
