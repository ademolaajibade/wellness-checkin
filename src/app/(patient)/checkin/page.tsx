'use client'

import { useEffect } from 'react'
import { useCheckin } from '@/hooks/useCheckin'
import AudioPlayer from '@/components/patient/AudioPlayer'
import AnswerButton from '@/components/patient/AnswerButton'
import ProgressDots from '@/components/patient/ProgressDots'
import Spinner from '@/components/shared/Spinner'
import { AnswerValue } from '@/types'

export default function CheckinPage() {
  const {
    step,
    questionIndex,
    questions,
    greetingUrl,
    greetingEnded,
    submitAnswer,
    error,
  } = useCheckin()

  const currentQuestion = questions[questionIndex]

  // Scroll to top on question change
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

  if (step === 'greeting') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6 gap-8">
        <div className="text-center">
          <p className="text-4xl mb-3">🌸</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Good morning!</h1>
          <p className="text-gray-400 text-sm">A message for you…</p>
        </div>
        <AudioPlayer url={greetingUrl} onEnded={greetingEnded} />
        {!greetingUrl && (
          <button
            onClick={greetingEnded}
            className="text-sm text-rose-400 underline"
          >
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
            {(['great', 'okay', 'not_well'] as AnswerValue[]).map((value) => (
              <AnswerButton
                key={value}
                value={value}
                onClick={(v) =>
                  submitAnswer({
                    questionId: currentQuestion._id,
                    questionText: currentQuestion.text,
                    answer: v,
                  })
                }
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return null
}
