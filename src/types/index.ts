export type OptionColor = 'green' | 'amber' | 'rose' | 'blue' | 'purple'
export type AnswerValue = string
export type UserRole = 'admin' | 'patient'
export type RecordingType = 'greeting' | 'farewell'
export type CheckinStep = 'loading' | 'greeting' | 'questions' | 'confirm' | 'submitting' | 'already_done' | 'error'

export interface IQuestionOption {
  value: string
  label: string
  color: OptionColor
}

export const DEFAULT_OPTIONS: IQuestionOption[] = [
  { value: 'great', label: 'Great', color: 'green' },
  { value: 'okay', label: 'Okay', color: 'amber' },
  { value: 'not_well', label: 'Not well', color: 'rose' },
]

export interface SessionData {
  userId: string
  role: UserRole
}

export interface IQuestion {
  _id: string
  order: 1 | 2 | 3
  text: string
  options: IQuestionOption[]
  updatedAt: string
}

export interface IAnswer {
  questionId: string
  questionText: string
  answer: AnswerValue
  answerColor?: string
}

export interface ICheckinResponse {
  _id: string
  userId: string
  date: string
  answers: IAnswer[]
  notes?: string
  submittedAt: string
  submittedOffline: boolean
  syncedAt: string | null
}

export interface IRecording {
  _id: string
  type: RecordingType
  storageUrl: string
  publicUrl: string
  uploadedAt: string
  active: boolean
}

export interface IAppSettings {
  notificationTime: string
  timezone: string
  lastNotificationSent: string | null
}

export interface QueuedCheckin {
  id: string
  date: string
  answers: IAnswer[]
  notes?: string
  queuedAt: number
}
