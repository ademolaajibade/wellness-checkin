'use client'

import { ICheckinResponse } from '@/types'

interface Props {
  responses: ICheckinResponse[]
  year: number
  month: number
}

type Sentiment = 'positive' | 'neutral' | 'concern'

const CONCERN_COLORS = new Set(['rose', 'not_well'])
const NEUTRAL_COLORS = new Set(['amber', 'okay'])

function getDaySentiment(response: ICheckinResponse | undefined): Sentiment | null {
  if (!response) return null
  let hasConcern = false
  let hasNeutral = false
  for (const a of response.answers) {
    const key = a.answerColor ?? a.answer
    if (CONCERN_COLORS.has(key)) hasConcern = true
    else if (NEUTRAL_COLORS.has(key)) hasNeutral = true
  }
  if (hasConcern) return 'concern'
  if (hasNeutral) return 'neutral'
  return 'positive'
}

const sentimentColor: Record<Sentiment, string> = {
  positive: 'bg-green-200 text-green-800',
  neutral: 'bg-amber-200 text-amber-800',
  concern: 'bg-rose-200 text-rose-800',
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
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block" /> Positive</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 inline-block" /> Neutral</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-200 inline-block" /> Concern</span>
      </div>
    </div>
  )
}
