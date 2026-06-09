'use client'

import { useEffect } from 'react'
import { useCheckin } from '@/hooks/useCheckin'
import AudioPlayer from '@/components/patient/AudioPlayer'
import AnswerButton from '@/components/patient/AnswerButton'
import ProgressDots from '@/components/patient/ProgressDots'
import Spinner from '@/components/shared/Spinner'
import { DEFAULT_OPTIONS } from '@/types'

const ANSWER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-300'  },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300'  },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300'},
}

export default function CheckinPage() {
  const {
    step,
    questionIndex,
    questions,
    answers,
    notes,
    greetingUrl,
    greetingEnded,
    submitAnswer,
    confirmSubmit,
    setNotes,
    error,
  } = useCheckin()

  const currentQuestion = questions[questionIndex]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [questionIndex])

  if (step === 'loading' || step === 'submitting') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-sm text-gray-400">
            {step === 'submitting' ? 'Saving your answers…' : 'Loading…'}
          </p>
        </div>
      </main>
    )
  }

  if (step === 'error' || error) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-rose-500 text-white px-6 py-2 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </main>
    )
  }

  if (step === 'already_done') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6 gap-6">
        <p className="text-5xl">🌸</p>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">You already checked in today Sis</h1>
          <p className="text-gray-400 text-sm">Come back tomorrow. Rest up 💕</p>
        </div>
      </main>
    )
  }

  if (step === 'greeting') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6 gap-8">
        <div className="text-center">
          <p className="text-4xl mb-3">🌸</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Good morning OLUWADAMILOLA!</h1>
          <p className="text-gray-400 text-sm">A message for you…</p>
        </div>
        <AudioPlayer url={greetingUrl} onEnded={greetingEnded} />
        {!greetingUrl && (
          <button onClick={greetingEnded} className="text-sm text-rose-400 underline">
            Continue
          </button>
        )}
      </main>
    )
  }

  if (step === 'questions' && currentQuestion) {
    return (
      <main className="flex min-h-dvh flex-col bg-gradient-to-b from-rose-50 to-white px-6 py-12">
        <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm mx-auto w-full">
          <ProgressDots total={questions.length} current={questionIndex} />

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 leading-snug">
              {currentQuestion.text}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {(currentQuestion.options?.length ? currentQuestion.options : DEFAULT_OPTIONS).map((option) => (
              <AnswerButton
                key={option.value}
                option={option}
                onClick={() =>
                  submitAnswer({
                    questionId: currentQuestion._id,
                    questionText: currentQuestion.text,
                    answer: option.value,
                    answerColor: option.color,
                  })
                }
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (step === 'confirm') {
    return (
      <main className="flex min-h-dvh flex-col bg-gradient-to-b from-rose-50 to-white px-6 py-12">
        <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm mx-auto w-full">
          <div className="text-center">
            <p className="text-3xl mb-3">📋</p>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Does this look right?</h1>
            <p className="text-sm text-gray-400">Tap Send when you're ready.</p>
          </div>

          <div className="flex flex-col gap-3">
            {answers.map((a) => {
              const style = ANSWER_STYLES[a.answerColor ?? 'rose'] ?? ANSWER_STYLES.rose
              const label =
                DEFAULT_OPTIONS.find((o) => o.value === a.answer)?.label ?? a.answer
              return (
                <div
                  key={a.questionId}
                  className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-3 shadow-sm"
                >
                  <p className="text-sm text-gray-700 leading-snug flex-1">{a.questionText}</p>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">
              Anything else on your mind? <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling overall…"
              rows={3}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
          </div>

          <button
            onClick={confirmSubmit}
            className="w-full rounded-2xl bg-rose-500 text-white font-semibold py-4 text-base active:scale-95 transition-transform shadow-md"
          >
            Send 💕
          </button>
        </div>
      </main>
    )
  }

  return null
}
