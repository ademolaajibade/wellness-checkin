import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import OfflineBanner from '@/components/patient/OfflineBanner'
import InstallPrompt from '@/components/shared/InstallPrompt'

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.userId || session.role !== 'patient') {
    redirect('/auth')
  }
  return (
    <>
      <OfflineBanner />
      <InstallPrompt />
      {children}
    </>
  )
}
