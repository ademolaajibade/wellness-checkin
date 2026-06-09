import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local')

const UserSchema = new mongoose.Schema({
  email: String,
  role: { type: String, enum: ['admin', 'patient'] },
  passwordHash: String,
  pinHash: String,
  fcmTokens: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
})

const QuestionSchema = new mongoose.Schema({
  order: Number,
  text: String,
  updatedAt: { type: Date, default: Date.now },
})

const AppSettingsSchema = new mongoose.Schema({
  notificationTime: String,
  timezone: String,
  lastNotificationSent: Date,
})

const User = mongoose.models.User ?? mongoose.model('User', UserSchema)
const Question = mongoose.models.Question ?? mongoose.model('Question', QuestionSchema)
const AppSettings = mongoose.models.AppSettings ?? mongoose.model('AppSettings', AppSettingsSchema)

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123'
const PATIENT_PIN = process.env.SEED_PATIENT_PIN ?? '1234'

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false })
  console.log('Connected to MongoDB')

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await User.findOneAndUpdate(
    { role: 'admin' },
    { email: ADMIN_EMAIL, role: 'admin', passwordHash: adminHash, fcmTokens: [] },
    { upsert: true }
  )
  console.log(`Admin user: ${ADMIN_EMAIL}`)

  const pinHash = await bcrypt.hash(PATIENT_PIN, 4)
  await User.findOneAndUpdate(
    { role: 'patient' },
    { role: 'patient', pinHash, fcmTokens: [] },
    { upsert: true }
  )
  console.log(`Patient PIN: ${PATIENT_PIN}`)

  const defaultQuestions = [
    { order: 1, text: 'How did you sleep last night?' },
    { order: 2, text: 'How is your pain level today?' },
    { order: 3, text: 'How are you feeling emotionally?' },
  ]
  for (const q of defaultQuestions) {
    await Question.findOneAndUpdate({ order: q.order }, { ...q, updatedAt: new Date() }, { upsert: true })
  }
  console.log('3 questions seeded')

  await AppSettings.findOneAndUpdate(
    {},
    { notificationTime: '08:00', timezone: 'America/Chicago', lastNotificationSent: null },
    { upsert: true }
  )
  console.log('AppSettings seeded')

  await mongoose.disconnect()
  console.log('\nSeed complete! Change the admin password and patient PIN before going live.')
}

seed().catch((err) => { console.error(err); process.exit(1) })
