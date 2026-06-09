'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckinStore } from '@/store/checkinStore'
import { saveToQueue, getQueue, removeFromQueue } from '@/lib/idb'
import { useOnlineStatus } from './useOnlineStatus'
import { IAnswer } from '@/types'

export function useCheckin() {
  const router = useRouter()
  const isOnline = useOnlineStatus()
  const store = useCheckinStore()

  useEffect(() => {
    async function loadData() {
      try {
        const [qRes, rRes, statusRes] = await Promise.all([
          fetch('/api/questions'),
          fetch('/api/recordings'),
          fetch('/api/checkin'),
        ])
        if (!qRes.ok || !rRes.ok) throw new Error('Failed to load')

        const [questions, recordings] = await Promise.all([qRes.json(), rRes.json()])
        store.setQuestions(questions)
        store.setRecordings(recordings.greeting?.publicUrl ?? null, recordings.farewell?.publicUrl ?? null)

        if (statusRes.ok) {
          const { submitted } = await statusRes.json()
          if (submitted) {
            store.setStep('already_done')
            return
          }
        }

        store.setStep('greeting')
      } catch {
        store.setStep('error')
      }
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isOnline) return
    async function drainQueue() {
      const queue = await getQueue()
      for (const item of queue) {
        try {
          const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: item.date, answers: item.answers, submittedOffline: true }),
          })
          if (res.ok) await removeFromQueue(item.id)
        } catch {
          // will retry on next online event
        }
      }
    }
    drainQueue()
  }, [isOnline])

  const greetingEnded = useCallback(() => {
    store.setStep('questions')
  }, [store])

  const submitAnswer = useCallback((answer: IAnswer) => {
    store.addAnswer(answer)
    const isLast = store.questionIndex >= store.questions.length - 1
    if (!isLast) {
      store.nextQuestion()
    } else {
      store.setStep('confirm')
    }
  }, [store])

  const confirmSubmit = useCallback(async () => {
    const { answers, notes } = store
    const today = new Date().toISOString().split('T')[0]

    store.setStep('submitting')

    if (isOnline) {
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today, answers, notes }),
        })
      } catch {
        await saveToQueue({ date: today, answers, notes, queuedAt: Date.now() })
      }
    } else {
      await saveToQueue({ date: today, answers, notes, queuedAt: Date.now() })
    }

    router.push('/done')
  }, [store, isOnline, router])

  return { ...store, greetingEnded, submitAnswer, confirmSubmit }
}
