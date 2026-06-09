'use client'

import { AnswerValue } from '@/types'

const config: Record<AnswerValue, { label: string; emoji: string; bg: string; border: string; text: string }> = {
  great: {
    label: 'Great',
    emoji: '😊',
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-400',
    text: 'text-green-700',
  },
  okay: {
    label: 'Okay',
    emoji: '😐',
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-700',
  },
  not_well: {
    label: 'Not well',
    emoji: '😔',
    bg: 'bg-rose-50 hover:bg-rose-100',
    border: 'border-rose-400',
    text: 'text-rose-700',
  },
}

interface Props {
  value: AnswerValue
  disabled?: boolean
  onClick: (value: AnswerValue) => void
}

export default function AnswerButton({ value, disabled, onClick }: Props) {
  const c = config[value]
  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`
        w-full min-h-[4rem] rounded-2xl border-2 px-6 py-4
        flex items-center justify-center gap-3
        text-lg font-semibold
        ${c.bg} ${c.border} ${c.text}
        active:scale-95 transition-transform
        disabled:opacity-50 disabled:pointer-events-none
      `}
    >
      <span className="text-2xl">{c.emoji}</span>
      <span>{c.label}</span>
    </button>
  )
}
