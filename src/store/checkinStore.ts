import { create } from 'zustand'
import { CheckinStep, IQuestion, IAnswer } from '@/types'

interface CheckinState {
  step: CheckinStep
  questionIndex: number
  questions: IQuestion[]
  answers: IAnswer[]
  notes: string
  greetingUrl: string | null
  farewellUrl: string | null
  error: string | null

  setStep: (step: CheckinStep) => void
  setQuestions: (questions: IQuestion[]) => void
  setRecordings: (greeting: string | null, farewell: string | null) => void
  addAnswer: (answer: IAnswer) => void
  nextQuestion: () => void
  setNotes: (notes: string) => void
  reset: () => void
}

const initialState = {
  step: 'loading' as CheckinStep,
  questionIndex: 0,
  questions: [],
  answers: [],
  notes: '',
  greetingUrl: null,
  farewellUrl: null,
  error: null,
}

export const useCheckinStore = create<CheckinState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setQuestions: (questions) => set({ questions }),

  setRecordings: (greeting, farewell) => set({ greetingUrl: greeting, farewellUrl: farewell }),

  addAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),

  nextQuestion: () =>
    set((state) => ({ questionIndex: state.questionIndex + 1 })),

  setNotes: (notes) => set({ notes }),

  reset: () => set(initialState),
}))
