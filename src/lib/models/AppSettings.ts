import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAppSettingsDoc extends Document {
  notificationTime: string
  timezone: string
  lastNotificationSent: Date | null
}

const AppSettingsSchema = new Schema<IAppSettingsDoc>({
  notificationTime: { type: String, default: '08:00' },
  timezone: { type: String, default: 'America/Chicago' },
  lastNotificationSent: { type: Date, default: null },
})

const AppSettings: Model<IAppSettingsDoc> =
  mongoose.models.AppSettings ??
  mongoose.model<IAppSettingsDoc>('AppSettings', AppSettingsSchema)

export default AppSettings
