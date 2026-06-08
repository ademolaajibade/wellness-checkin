# wellness-checkin — Project Plan & Consistency Guide

## What This App Is

A personal daily wellness check-in PWA built for one person: Sarah (recovering from surgery).
Every morning she gets a push notification, opens the app, hears her brother's voice, answers
3 questions by tapping buttons, and hears a farewell message. No login friction. No App Store.
Just a link she adds to her home screen.

There are two users in this entire system:
- **Admin (brother)** — manages questions, uploads voice recordings, sees her responses
- **Patient (sister)** — does her daily check-in, that's it

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14, App Router, TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB Atlas via Mongoose |
| Auth | iron-session (PIN for sister, email+password for brother) |
| Push notifications | Firebase Cloud Messaging (FCM) Web Push |
| Audio storage | Firebase Storage |
| Offline support | Workbox (via next-pwa) + idb-keyval (IndexedDB) |
| Deployment | Vercel (free tier) |
| Cron | Vercel Cron Jobs |

---

## Folder Structure

```
wellness-checkin/
├── public/
│   ├── manifest.json              PWA manifest — makes it installable
│   ├── offline.html               Shown when fully offline
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png  Required for Android adaptive icons
├── src/
│   ├── app/
│   │   ├── layout.tsx             Root layout — manifest link, SW registration
│   │   ├── page.tsx               Redirects / → /checkin
│   │   ├── globals.css
│   │   ├── (patient)/             Sister's experience — no nav chrome
│   │   │   ├── layout.tsx         Requires patient session
│   │   │   ├── checkin/
│   │   │   │   └── page.tsx       The daily check-in flow
│   │   │   └── done/
│   │   │       └── page.tsx       Farewell screen after submission
│   │   ├── (admin)/               Brother's dashboard
│   │   │   ├── layout.tsx         Requires admin session
│   │   │   ├── admin/
│   │   │   │   └── page.tsx       Overview — calendar + stats
│   │   │   ├── responses/
│   │   │   │   └── page.tsx       Full response history
│   │   │   ├── questions/
│   │   │   │   └── page.tsx       Edit the 3 daily questions
│   │   │   ├── recordings/
│   │   │   │   └── page.tsx       Upload greeting + farewell audio
│   │   │   └── settings/
│   │   │       └── page.tsx       Notification time + send test
│   │   ├── auth/
│   │   │   └── page.tsx           PIN pad (sister) or email+password (brother)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── logout/route.ts
│   │       ├── checkin/
│   │       │   └── route.ts       POST — submit daily answers
│   │       ├── questions/
│   │       │   ├── route.ts       GET all questions
│   │       │   └── [id]/route.ts  PUT — edit question text
│   │       ├── recordings/
│   │       │   ├── route.ts       GET active greeting + farewell URLs
│   │       │   ├── upload/route.ts GET — signed Firebase upload URL
│   │       │   └── activate/route.ts POST — make recording live
│   │       ├── responses/
│   │       │   ├── route.ts       GET response history (admin)
│   │       │   └── [date]/route.ts GET single day detail
│   │       ├── notifications/
│   │       │   ├── subscribe/route.ts POST — register FCM token
│   │       │   ├── send/route.ts  POST — fire push (admin + cron)
│   │       │   └── schedule/route.ts GET/PUT notification time
│   │       └── settings/
│   │           └── route.ts       GET/PUT app settings
│   ├── components/
│   │   ├── patient/
│   │   │   ├── AudioPlayer.tsx    Plays voice recording, shows waveform animation
│   │   │   ├── AnswerButton.tsx   Great / Okay / Not well tap button
│   │   │   ├── ProgressDots.tsx   3 dots showing question progress
│   │   │   └── OfflineBanner.tsx  Yellow stripe when offline
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx        Nav links + logout
│   │   │   ├── StatCard.tsx       Today / Streak / Last seen cards
│   │   │   ├── ResponseCalendar.tsx Monthly heat map
│   │   │   ├── ResponseRow.tsx    Single day in history table
│   │   │   ├── QuestionEditor.tsx Textarea + save for one question
│   │   │   ├── RecordingUploader.tsx Drag-drop → Firebase upload
│   │   │   └── NotificationTimePicker.tsx Time input + timezone
│   │   └── shared/
│   │       ├── InstallPrompt.tsx  A2HS banner (Android) + Safari instructions (iOS)
│   │       ├── Spinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/
│   │   ├── db.ts                  Mongoose singleton
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── CheckinResponse.ts  Unique index: { userId, date }
│   │   │   ├── Question.ts
│   │   │   ├── Recording.ts
│   │   │   └── AppSettings.ts     Singleton document
│   │   ├── auth.ts                iron-session config + requireAuth()
│   │   ├── firebase-admin.ts      Server-side Firebase Admin SDK
│   │   ├── firebase-client.ts     Browser Firebase SDK
│   │   ├── fcm.ts                 sendPushToPatients() helper
│   │   └── idb.ts                 IndexedDB queue (saveToQueue, getQueue, removeFromQueue)
│   ├── hooks/
│   │   ├── useCheckin.ts          Drives the entire patient flow state machine
│   │   ├── useAudio.ts            HTMLAudioElement wrapper
│   │   ├── useFCMToken.ts         Request permission + register token
│   │   ├── useOnlineStatus.ts     navigator.onLine + events
│   │   └── useInstallPrompt.ts    beforeinstallprompt capture
│   ├── store/
│   │   └── checkinStore.ts        Zustand — step, answers, questions
│   ├── types/
│   │   └── index.ts               All shared TypeScript interfaces
│   └── workers/
│       └── sw-custom.ts           Service worker — cache, push, sync, audio
├── scripts/
│   └── seed.ts                    One-time DB seed (admin + patient + questions)
├── vercel.json                    Cron job config
├── next.config.ts                 next-pwa / Workbox config
└── .env.local                     All secrets (never commit this)
```

---

## Database Schema

### users
```ts
{
  _id: ObjectId
  email: string               // brother only
  role: "admin" | "patient"
  passwordHash: string        // brother only (bcrypt)
  pinHash: string             // sister only (bcrypt 4-digit PIN)
  fcmTokens: string[]         // web push tokens (can have multiple)
  createdAt: Date
}
```

### checkin_responses
```ts
{
  _id: ObjectId
  userId: ObjectId            // ref → users
  date: string                // "2026-06-08"
  answers: [{
    questionId: ObjectId
    questionText: string      // snapshot at time of answer
    answer: "great" | "okay" | "not_well"
  }]
  submittedAt: Date
  submittedOffline: boolean
  syncedAt: Date | null
}
// UNIQUE INDEX: { userId: 1, date: 1 }
```

### questions
```ts
{
  _id: ObjectId
  order: 1 | 2 | 3
  text: string                // "How did you sleep last night?"
  updatedAt: Date
}
```

### recordings
```ts
{
  _id: ObjectId
  type: "greeting" | "farewell"
  storageUrl: string          // gs://bucket/filename.mp3
  publicUrl: string           // https:// URL for playback
  uploadedAt: Date
  active: boolean             // only one active per type at a time
}
```

### app_settings (singleton)
```ts
{
  _id: ObjectId
  notificationTime: string    // "08:00" (24h)
  timezone: string            // "America/Chicago"
  lastNotificationSent: Date | null
}
```

---

## API Reference

### Auth
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/login` | none | `{ role, pin? }` or `{ role, email, password }` |
| POST | `/api/auth/logout` | any | Clears session cookie |

### Patient (checkin flow)
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/questions` | patient | Returns 3 questions sorted by order |
| GET | `/api/recordings` | patient | Returns `{ greeting: { publicUrl }, farewell: { publicUrl } }` |
| POST | `/api/checkin` | patient | Submit answers. Returns `{ alreadySubmitted }` if duplicate |
| POST | `/api/notifications/subscribe` | patient | Registers FCM token |

### Admin (dashboard)
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/responses` | admin | `?from=YYYY-MM-DD&to=YYYY-MM-DD` |
| GET | `/api/responses/[date]` | admin | Single day detail or null |
| PUT | `/api/questions/[id]` | admin | `{ text }` |
| GET | `/api/recordings/upload` | admin | `?type=greeting\|farewell` → signed upload URL |
| POST | `/api/recordings/activate` | admin | `{ recordingId, type }` |
| POST | `/api/notifications/send` | admin + cron | Fires push to sister |
| GET/PUT | `/api/notifications/schedule` | admin | Get or set `{ time, timezone }` |

---

## Environment Variables

```bash
# .env.local — never commit

# Database
MONGODB_URI=mongodb+srv://...

# Auth
IRON_SESSION_SECRET=          # 32+ random characters

# Firebase (browser — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_VAPID_KEY=        # from Firebase Console → Cloud Messaging → Web Push

# Firebase (server — never expose)
FIREBASE_SERVICE_ACCOUNT_JSON= # full JSON as single-line string

# Vercel Cron auth
CRON_SECRET=                  # random string — sent as header from vercel.json cron
```

---

## Auth Rules

| Route group | Required session | Redirect if missing |
|---|---|---|
| `(patient)/*` | `role === "patient"` | `/auth` |
| `(admin)/*` | `role === "admin"` | `/auth` |
| `/api/checkin` | patient | 401 |
| `/api/responses` | admin | 401 |
| `/api/notifications/send` | admin OR valid `CRON_SECRET` header | 401 |

Sister's session lasts **30 days** — she never has to log in again after the first time.
Brother's session lasts **7 days**.

---

## Patient Flow (step by step)

```
1. Notification arrives at 8:00 AM
2. She taps → /checkin opens
3. "loading"  → fetch /api/questions + /api/recordings
4. "greeting" → AudioPlayer plays greeting.publicUrl
                 audio ends → advance to "questions"
5. "questions" (index 0) → AudioPlayer plays (optional per-question audio)
                            question text shown
                            3 AnswerButtons shown after audio ends
                            she taps → answer saved → next question
6. "questions" (index 1) → same
7. "questions" (index 2) → same → submit()
8. "submitting" → POST /api/checkin
                   online: saved to DB
                   offline: saved to IndexedDB, background sync registered
9. router.push("/done")
10. "/done" → farewell audio plays → "See you tomorrow 💕"
```

---

## Offline Strategy

| What | Strategy |
|---|---|
| Questions | Cached by SW (StaleWhileRevalidate). Always available offline. |
| Audio files | Cached by SW (CacheFirst, 30 day TTL). Plays with zero network. |
| Answers | If offline: saved to IndexedDB via `idb.ts`. Auto-drained on `window online` event. |
| Duplicate safety | Unique DB index on `{ userId, date }` — safe to retry, 409 = already saved |
| New recordings | After upload, admin client sends `{ type: "CACHE_AUDIO", url }` message to SW → SW adds to cache |

---

## Push Notification Flow

```
Vercel Cron (vercel.json) → POST /api/notifications/send
  → fcm.ts: sendPushToPatients()
    → Firebase Admin: messaging.sendEachForMulticast({ tokens, ... })
      → FCM servers → her browser/PWA
        → sw-custom.ts: push event → showNotification()
          → she taps → notificationclick → openWindow("/checkin")
```

**iOS note:** Push only works if the PWA is added to Home Screen on iOS 16.4+.
The app shows a persistent "Add to Home Screen" banner on iOS Safari until installed.

---

## Build Stages

| # | Stage | What gets built | Done? |
|---|---|---|---|
| 1 | Scaffold + PWA | next-pwa config, manifest, SW registration, icons | [ ] |
| 2 | Database + Auth | Mongoose models, iron-session, login/logout, seed script | [ ] |
| 3 | Patient check-in flow | Questions API, recordings API, check-in UI, answer buttons, submit | [ ] |
| 4 | Admin dashboard | Sidebar, stats, calendar, response history, question editor | [ ] |
| 5 | Voice recordings | Firebase Storage upload, RecordingUploader, SW audio caching | [ ] |
| 6 | Push notifications | FCM token registration, send API, Vercel cron, SW push handler | [ ] |
| 7 | Offline + polish | Queue drain, install prompt, error boundaries, deploy to Vercel | [ ] |

---

## Coding Conventions

- **All API routes** — always call `requireAuth(request, role)` as the first line. Return early with `Response.json({ error }, { status: 401 })` if it throws.
- **Error handling** — wrap all API route bodies in try/catch. Return `500 { error: "Something went wrong" }` — never expose stack traces.
- **Database** — always call `await connectDB()` before any Mongoose query.
- **Client components** — only use `"use client"` when you need hooks or browser APIs. Keep server components as the default.
- **Audio** — always set `playsInline = true` on HTMLAudioElement. Handle `NotAllowedError` from autoplay policy by showing a "Tap to play" fallback button.
- **Tailwind** — use `min-h-dvh` (not `min-h-screen`) for full-height mobile layouts to account for browser chrome.
- **Offline first** — never assume the network is available. Every patient-side action must have an offline fallback.
- **One patient, one admin** — this is not a multi-tenant app. The seed script creates exactly two users. There is no sign-up flow.

---

## Design Language

The app should feel **warm, personal, and calm** — like a message from someone who loves you.

- **Colors** — rose/pink as primary (`rose-400`, `rose-500`). Soft gradients (`from-rose-50 to-white`).
- **Typography** — large, readable text. No small print. She may be in pain or groggy.
- **Buttons** — large touch targets (`min-h-[4rem]`). Generous padding. Rounded corners.
- **Animations** — subtle only. Pulsing audio waveform. `active:scale-95` on buttons. No spinning loaders on audio steps.
- **Tone** — every piece of copy should sound like it came from her brother. Warm, not clinical.

### Answer button colors
| Answer | Background | Border |
|---|---|---|
| Great | `green-50` | `green-400` |
| Okay | `amber-50` | `amber-400` |
| Not well | `rose-50` | `rose-400` |

---

## Deployment Checklist

- [ ] All env vars set in Vercel dashboard
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` is a single-line string (escape `\n` in private key)
- [ ] Production domain added to Firebase → Authorized Domains
- [ ] MongoDB Atlas → Network Access → `0.0.0.0/0` allowed (Vercel uses dynamic IPs)
- [ ] Firebase Storage rules: allow public read on `recordings/*`
- [ ] Seed script run against production DB
- [ ] Sister's PIN changed from default `1234`
- [ ] Lighthouse PWA score ≥ 90 on production URL
- [ ] Tested on real Android device (install + offline + push)
- [ ] Tested on real iPhone iOS 16.4+ (add to home screen + push)
- [ ] Vercel cron time adjusted to match sister's timezone

---

## Key Decisions & Why

| Decision | Reason |
|---|---|
| PWA over native app | No App Store, no install friction — she just opens a link once |
| PIN login for sister | She's recovering. No email, no passwords, no friction. |
| iron-session over NextAuth | Two hardcoded users, no OAuth needed. Simpler. |
| Firebase Storage for audio | Generous free tier, signed URLs, direct browser uploads (no server bandwidth) |
| idb-keyval for offline queue | 600 bytes. No IndexedDB boilerplate. Exactly what's needed. |
| next-pwa + Workbox | Handles SW generation + audio caching with minimal config |
| Unique index on {userId, date} | Makes offline sync safe to retry — duplicate = already saved |
| No multi-user | This is a personal app for one person. Over-engineering it would slow everything down. |
