'use client'

import { useState } from 'react'
import { ICheckinResponse, AnswerValue } from '@/types'

const answerLabel: Record<AnswerValue, string> = {
  great: 'Great',
  okay: 'Okay',
  not_well: 'Not well',
}

const answerColor: Record<AnswerValue, string> = {
  great: 'bg-green-100 text-green-700',
  okay: 'bg-amber-100 text-amber-700',
  not_well: 'bg-rose-100 text-rose-700',
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
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${answerColor[a.answer]}`}>
              {answerLabel[a.answer]}
            </span>
          ))}
          <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-3 border-t border-gray-100 space-y-2">
          {response.answers.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 shrink-0 ${answerColor[a.answer]}`}>
                {answerLabel[a.answer]}
              </span>
              <p className="text-sm text-gray-600">{a.questionText}</p>
            </div>
          ))}
          {response.submittedOffline && (
            <p className="text-xs text-gray-400">Submitted offline</p>
          )}
        </div>
      )}
    </div>
  )
}
