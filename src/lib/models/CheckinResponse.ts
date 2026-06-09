import mongoose, { Schema, Document, Model } from 'mongoose'

interface IAnswer {
  questionId: mongoose.Types.ObjectId
  questionText: string
  answer: string
  answerColor?: string
}

export interface ICheckinResponseDoc extends Document {
  userId: mongoose.Types.ObjectId
  date: string
  answers: IAnswer[]
  notes?: string
  submittedAt: Date
  submittedOffline: boolean
  syncedAt: Date | null
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  answerColor: { type: String },
})

const CheckinResponseSchema = new Schema<ICheckinResponseDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  answers: [AnswerSchema],
  notes: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  submittedOffline: { type: Boolean, default: false },
  syncedAt: { type: Date, default: null },
})

CheckinResponseSchema.index({ userId: 1, date: 1 }, { unique: true })

const CheckinResponse: Model<ICheckinResponseDoc> =
  mongoose.models.CheckinResponse ??
  mongoose.model<ICheckinResponseDoc>('CheckinResponse', CheckinResponseSchema)

export default CheckinResponse
