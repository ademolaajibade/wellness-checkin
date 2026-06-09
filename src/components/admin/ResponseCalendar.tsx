'use client'

import { ICheckinResponse, AnswerValue } from '@/types'

interface Props {
  responses: ICheckinResponse[]
  year: number
  month: number
}

function getDaySentiment(response: ICheckinResponse | undefined): AnswerValue | null {
  if (!response) return null
  const counts = { great: 0, okay: 0, not_well: 0 }
  for (const a of response.answers) counts[a.answer]++
  if (counts.not_well > 0) return 'not_well'
  if (counts.okay > 0) return 'okay'
  return 'great'
}

const sentimentColor: Record<AnswerValue, string> = {
  great: 'bg-green-200 text-green-800',
  okay: 'bg-amber-200 text-amber-800',
  not_well: 'bg-rose-200 text-rose-800',
}

export default function ResponseCalendar({ responses, year, month }: Props) {
  const byDate = Object.fromEntries(responses.map((r) => [r.date, r]))
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const response = byDate[dateStr]
          const sentiment = getDaySentiment(response)
          const isToday = dateStr === today
          return (
            <div
              key={dateStr}
              title={response ? `${dateStr}: checked in` : `${dateStr}: no check-in`}
              className={`
                rounded-lg flex items-center justify-center text-xs font-medium aspect-square
                ${sentiment ? sentimentColor[sentiment] : 'bg-gray-100 text-gray-400'}
                ${isToday ? 'ring-2 ring-rose-400 ring-offset-1' : ''}
              `}
            >
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block" /> Great</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 inline-block" /> Okay</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-200 inline-block" /> Not well</span>
      </div>
    </div>
  )
}
