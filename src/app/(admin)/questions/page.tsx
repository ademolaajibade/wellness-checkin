'use client'

import { useEffect, useState } from 'react'
import QuestionEditor from '@/components/admin/QuestionEditor'
import Spinner from '@/components/shared/Spinner'
import { IQuestion } from '@/types'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/questions')
      .then((r) => r.json())
      .then((data) => { setQuestions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleSaved(updated: IQuestion) {
    setQuestions((qs) => qs.map((q) => q._id === updated._id ? updated : q))
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Daily Questions</h2>
      <p className="text-sm text-gray-400">These are the 3 questions Sarah answers each morning.</p>
      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => <QuestionEditor key={q._id} question={q} onSaved={handleSaved} />)}
        </div>
      )}
    </div>
  )
}
