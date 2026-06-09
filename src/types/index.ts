export type AnswerValue = 'great' | 'okay' | 'not_well'
export type UserRole = 'admin' | 'patient'
export type RecordingType = 'greeting' | 'farewell'
export type CheckinStep = 'loading' | 'greeting' | 'questions' | 'submitting' | 'error'

export interface SessionData {
  userId: string
  role: UserRole
}

export interface IQuestion {
  _id: string
  order: 1 | 2 | 3
  text: string
  updatedAt: string
}

export interface IAnswer {
  questionId: string
  questionText: string
  answer: AnswerValue
}

export interface ICheckinResponse {
  _id: string
  userId: string
  date: string
  answers: IAnswer[]
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
  queuedAt: number
}
