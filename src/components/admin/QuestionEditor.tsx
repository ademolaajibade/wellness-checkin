'use client'

import { useState } from 'react'
import { IQuestion } from '@/types'

export default function QuestionEditor({ question, onSaved }: { question: IQuestion; onSaved: (q: IQuestion) => void }) {
  const [text, setText] = useState(question.text)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/questions/${question._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (res.ok) {
      const updated = await res.json()
      onSaved(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2">Question {question.order}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
      />
      <div className="flex items-center justify-end gap-2 mt-2">
        {saved && <span className="text-xs text-green-600">Saved!</span>}
        <button
          onClick={save}
          disabled={saving || text === question.text || !text.trim()}
          className="rounded-lg bg-rose-500 text-white text-sm font-medium px-4 py-1.5 disabled:opacity-50 active:scale-95 transition-transform"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
