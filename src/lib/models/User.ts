import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserDoc extends Document {
  email?: string
  role: 'admin' | 'patient'
  passwordHash?: string
  pinHash?: string
  fcmTokens: string[]
  createdAt: Date
}

const UserSchema = new Schema<IUserDoc>({
  email: { type: String },
  role: { type: String, enum: ['admin', 'patient'], required: true },
  passwordHash: { type: String },
  pinHash: { type: String },
  fcmTokens: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
})

const User: Model<IUserDoc> =
  mongoose.models.User ?? mongoose.model<IUserDoc>('User', UserSchema)

export default User
