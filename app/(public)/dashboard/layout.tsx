import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-4 gap-6">
        <aside className="col-span-1 space-y-2">
          <Link href="/dashboard/bookings" className="block px-4 py-2 rounded hover:bg-gray-100">
            My Bookings
          </Link>
          <button
            onClick={async () => {
              'use server'
              await supabase.auth.signOut()
              redirect('/login')
            }}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-red-600"
          >
            Sign out
          </button>
        </aside>
        <main className="col-span-3">
          {children}
        </main>
      </div>
    </div>
  )
}
