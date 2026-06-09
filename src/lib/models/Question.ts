import mongoose, { Schema, Document, Model } from 'mongoose'

interface IOption {
  value: string
  label: string
  color: string
}

export interface IQuestionDoc extends Document {
  order: 1 | 2 | 3
  text: string
  options: IOption[]
  updatedAt: Date
}

const OptionSchema = new Schema<IOption>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, enum: ['green', 'amber', 'rose', 'blue', 'purple'], required: true },
  },
  { _id: false }
)

const DEFAULT_OPTIONS: IOption[] = [
  { value: 'great', label: 'Great', color: 'green' },
  { value: 'okay', label: 'Okay', color: 'amber' },
  { value: 'not_well', label: 'Not well', color: 'rose' },
]

const QuestionSchema = new Schema<IQuestionDoc>({
  order: { type: Number, enum: [1, 2, 3], required: true },
  text: { type: String, required: true },
  options: { type: [OptionSchema], default: DEFAULT_OPTIONS },
  updatedAt: { type: Date, default: Date.now },
})

const Question: Model<IQuestionDoc> =
  mongoose.models.Question ?? mongoose.model<IQuestionDoc>('Question', QuestionSchema)

export default Question
