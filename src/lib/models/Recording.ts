import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IRecordingDoc extends Document {
  type: 'greeting' | 'farewell'
  storageUrl: string
  publicUrl: string
  uploadedAt: Date
  active: boolean
}

const RecordingSchema = new Schema<IRecordingDoc>({
  type: { type: String, enum: ['greeting', 'farewell'], required: true },
  storageUrl: { type: String, required: true },
  publicUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
})

const Recording: Model<IRecordingDoc> =
  mongoose.models.Recording ?? mongoose.model<IRecordingDoc>('Recording', RecordingSchema)

export default Recording
