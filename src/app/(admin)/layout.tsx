import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.userId || session.role !== 'admin') {
    redirect('/auth')
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 shrink-0 hidden md:flex flex-col">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
