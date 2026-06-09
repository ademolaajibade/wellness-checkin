'use client'

import { IQuestionOption, OptionColor } from '@/types'

const colorMap: Record<OptionColor, { bg: string; border: string; text: string }> = {
  green: { bg: 'bg-green-50 hover:bg-green-100', border: 'border-green-400', text: 'text-green-700' },
  amber: { bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-400', text: 'text-amber-700' },
  rose: { bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-400', text: 'text-rose-700' },
  blue: { bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-400', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-400', text: 'text-purple-700' },
}

interface Props {
  option: IQuestionOption
  disabled?: boolean
  onClick: () => void
}

export default function AnswerButton({ option, disabled, onClick }: Props) {
  const c = colorMap[option.color] ?? colorMap.green
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full min-h-[4rem] rounded-2xl border-2 px-6 py-4
        flex items-center justify-center
        text-lg font-semibold
        ${c.bg} ${c.border} ${c.text}
        active:scale-95 transition-transform
        disabled:opacity-50 disabled:pointer-events-none
      `}
    >
      {option.label}
    </button>
  )
}
