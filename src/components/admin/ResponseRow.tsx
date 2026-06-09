'use client'

import { useState } from 'react'
import { ICheckinResponse } from '@/types'

const COLOR_BADGE: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  // legacy value-based fallbacks
  great: 'bg-green-100 text-green-700',
  okay: 'bg-amber-100 text-amber-700',
  not_well: 'bg-rose-100 text-rose-700',
}

function badgeClass(answer: string, answerColor?: string): string {
  if (answerColor && COLOR_BADGE[answerColor]) return COLOR_BADGE[answerColor]
  return COLOR_BADGE[answer] ?? 'bg-gray-100 text-gray-700'
}

function formatLabel(answer: string): string {
  return answer.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function ResponseRow({ response }: { response: ICheckinResponse }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">{response.date}</span>
        <div className="flex items-center gap-2">
          {response.answers.map((a, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass(a.answer, a.answerColor)}`}
            >
              {formatLabel(a.answer)}
            </span>
          ))}
          <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-100 space-y-2">
          {response.answers.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 shrink-0 ${badgeClass(a.answer, a.answerColor)}`}
              >
                {formatLabel(a.answer)}
              </span>
              <p className="text-sm text-gray-600">{a.questionText}</p>
            </div>
          ))}
          {response.notes && (
            <div className="mt-1 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2">
              <p className="text-xs text-rose-400 font-medium mb-0.5">Her note</p>
              <p className="text-sm text-gray-700">{response.notes}</p>
            </div>
          )}
          {response.submittedOffline && (
            <p className="text-xs text-gray-400">Submitted offline</p>
          )}
        </div>
      )}
    </div>
  )
}
