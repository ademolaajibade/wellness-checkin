import { getApps, initializeApp, cert, App } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { getMessaging } from 'firebase-admin/messaging'

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? '{}')
  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  })
}

export function getAdminStorage() {
  return getStorage(getAdminApp())
}

export function getAdminMessaging() {
  return getMessaging(getAdminApp())
}
