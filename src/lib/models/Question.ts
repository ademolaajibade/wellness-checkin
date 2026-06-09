import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IQuestionDoc extends Document {
  order: 1 | 2 | 3
  text: string
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestionDoc>({
  order: { type: Number, enum: [1, 2, 3], required: true },
  text: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
})

const Question: Model<IQuestionDoc> =
  mongoose.models.Question ?? mongoose.model<IQuestionDoc>('Question', QuestionSchema)

export default Question
