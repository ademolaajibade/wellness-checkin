'use client'

interface Props {
  total: number
  current: number
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`
            rounded-full transition-all duration-300
            ${i < current ? 'w-2 h-2 bg-rose-400' : ''}
            ${i === current ? 'w-3 h-3 bg-rose-500' : ''}
            ${i > current ? 'w-2 h-2 bg-rose-200' : ''}
          `}
        />
      ))}
    </div>
  )
}
