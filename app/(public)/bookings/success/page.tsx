import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4">
      <div className="text-6xl">✓</div>
      <h1 className="text-2xl font-bold">Booking confirmed!</h1>
      <p className="text-gray-600">Check your email for details. You can view all your bookings in your dashboard.</p>
      <Link href="/dashboard/bookings" className="inline-block bg-black text-white px-6 py-2 rounded">
        My bookings
      </Link>
    </div>
  )
}
