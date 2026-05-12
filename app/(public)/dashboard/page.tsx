import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/bookings" className="block p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="font-semibold text-lg">My Bookings</h2>
          <p className="text-sm text-gray-600">View and manage your bookings</p>
        </Link>
        <Link href="/venues" className="block p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="font-semibold text-lg">Browse Venues</h2>
          <p className="text-sm text-gray-600">Find and book new venues</p>
        </Link>
      </div>
    </div>
  )
}
