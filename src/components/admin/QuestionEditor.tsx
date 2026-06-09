'use client'

import { useState } from 'react'
import { IQuestion, IQuestionOption, OptionColor, DEFAULT_OPTIONS } from '@/types'

const COLOR_OPTIONS: OptionColor[] = ['green', 'amber', 'rose', 'blue', 'purple']

const COLOR_DOT: Record<OptionColor, string> = {
  green: 'bg-green-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
}

const COLOR_RING: Record<OptionColor, string> = {
  green: 'ring-green-400',
  amber: 'ring-amber-400',
  rose: 'ring-rose-400',
  blue: 'ring-blue-400',
  purple: 'ring-purple-400',
}

function labelToValue(label: string): string {
  const v = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  return v || 'option'
}

type DraftOption = IQuestionOption & { _key: string }

function toDraft(options: IQuestionOption[]): DraftOption[] {
  return options.map((o, i) => ({ ...o, _key: o.value || String(i) }))
}

export default function QuestionEditor({
  question,
  onSaved,
}: {
  question: IQuestion
  onSaved: (q: IQuestion) => void
}) {
  const [text, setText] = useState(question.text)
  const [options, setOptions] = useState<DraftOption[]>(() =>
    toDraft(question.options?.length ? question.options : DEFAULT_OPTIONS)
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateOption(key: string, changes: Partial<IQuestionOption>) {
    setOptions((prev) => prev.map((o) => (o._key === key ? { ...o, ...changes } : o)))
  }

  function removeOption(key: string) {
    setOptions((prev) => prev.filter((o) => o._key !== key))
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      { value: '', label: '', color: 'green', _key: String(Date.now()) },
    ])
  }

  const validOptions = options.filter((o) => o.label.trim())
  const canSave = text.trim() && validOptions.length >= 2

  async function save() {
    if (!canSave) return
    const finalOptions = validOptions.map((o) => ({
      value: labelToValue(o.label),
      label: o.label.trim(),
      color: o.color,
    }))
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/questions/${question._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, options: finalOptions }),
    })
    if (res.ok) {
      const updated: IQuestion = await res.json()
      onSaved(updated)
      setOptions(toDraft(updated.options ?? DEFAULT_OPTIONS))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
      <div>
        <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2">
          Question {question.order}
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Response Options
        </p>
        <div className="space-y-2">
          {options.map((opt) => (
            <div key={opt._key} className="flex items-center gap-2">
              <div className="flex gap-1 shrink-0">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateOption(opt._key, { color: c })}
                    className={`w-4 h-4 rounded-full transition-all ${COLOR_DOT[c]} ${
                      opt.color === c ? `ring-2 ring-offset-1 ${COLOR_RING[c]}` : 'opacity-30 hover:opacity-60'
                    }`}
                    aria-label={`${c} color`}
                  />
                ))}
              </div>
              <input
                value={opt.label}
                onChange={(e) => updateOption(opt._key, { label: e.target.value })}
                placeholder="Option label"
                className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(opt._key)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm leading-none"
                  aria-label="Remove option"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 5 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-xs text-rose-400 hover:text-rose-600 font-medium transition-colors"
          >
            + Add option
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        {saved && <span className="text-xs text-green-600">Saved!</span>}
        <button
          onClick={save}
          disabled={saving || !canSave}
          className="rounded-lg bg-rose-500 text-white text-sm font-medium px-4 py-1.5 disabled:opacity-50 active:scale-95 transition-transform"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
