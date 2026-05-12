'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

type Booking = {
  id: string
  venue_id: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  venues: { title: string; location: string; city: string }
}

export default function BookingsPage() {
  const supabase = createClient()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error: err } = await supabase
      .from('bookings')
      .select('id, venue_id, start_date, end_date, total_price, status, venues(title, location, city)')
      .eq('customer_id', user.id)
      .order('start_date', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  async function handleCancel(bookingId: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (error) {
      setError(error.message)
    } else {
      fetchBookings()
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-red-600 py-4">{error}</div>
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-gray-600">No bookings yet</p>
        <Link href="/venues" className="inline-block bg-black text-white px-6 py-2 rounded">
          Browse venues
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div>
                <h3 className="font-semibold text-lg">{booking.venues?.title}</h3>
                <p className="text-sm text-gray-600">{booking.venues?.location}, {booking.venues?.city}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Dates</p>
                <p className="font-medium">
                  {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Total</p>
                <p className="font-medium">${booking.total_price}</p>
              </div>
              <div className="text-right space-x-2">
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status}
                </span>
                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
