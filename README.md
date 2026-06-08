# Wellness Check-In

A personal daily wellness PWA built for just my sister, she recently did a surgery and she's in her recovering stage. Every morning she receives a push notification, opens the app, hears her brother's voice(which is me guys🤩), answers 3 questions by tapping buttons, and hears a farewell message. No login friction. No App Store — just a link she adds to her home screen.

## Users

- **Admin (brother)** — manages questions, uploads voice recordings, views responses
- **Patient (sister)** — completes her daily check-in

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14, App Router, TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB Atlas via Mongoose |
| Auth | iron-session (PIN for patient, email + password for admin) |
| Push notifications | Firebase Cloud Messaging (FCM) Web Push |
| Audio storage | Firebase Storage |
| Offline support | Workbox (via next-pwa) + idb-keyval |
| Deployment | Vercel |
| Cron | Vercel Cron Jobs |

## Features

- **Voice-first experience** — greeting and farewell audio recorded by her brother plays automatically
- **3-question daily check-in** — simple tap buttons: Great / Okay / Not well
- **Offline support** — answers queue locally and sync when back online
- **Push notifications** — scheduled daily reminder via Firebase Cloud Messaging
- **Admin dashboard** — response history, calendar heatmap, question editor, recording uploader
- **PWA installable** — works on iOS (16.4+) and Android via Add to Home Screen

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Firebase project (Firestore + Cloud Messaging + Storage)

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Auth
IRON_SESSION_SECRET=           # 32+ random characters

# Firebase (browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_VAPID_KEY=

# Firebase (server)
FIREBASE_SERVICE_ACCOUNT_JSON= # full JSON as single-line string

# Vercel Cron auth
CRON_SECRET=
```

### Seed the Database

```bash
npx ts-node scripts/seed.ts
```

Creates the admin user and patient user with default questions.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Patient Flow

1. Push notification arrives at scheduled time
2. She taps → `/checkin` opens
3. Greeting audio plays (her brother's voice)
4. 3 questions presented one at a time with answer buttons
5. Answers submitted → routed to `/done`
6. Farewell audio plays

## Deployment

Deploys to Vercel. See the deployment checklist in the project docs before going live:

- Set all env vars in Vercel dashboard
- Add production domain to Firebase Authorized Domains
- Allow `0.0.0.0/0` in MongoDB Atlas Network Access (Vercel uses dynamic IPs)
- Set Firebase Storage rules to allow public read on `recordings/*`
- Adjust Vercel cron time to match the patient's timezone

## Design

Warm, personal, and calm — like a message from someone who loves you.

- Rose/pink color palette
- Large touch targets (min 4rem height) — she may be groggy or in pain
- Offline-first — every patient action works without a network connection
