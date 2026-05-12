'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  venueId: string
  pricePerDay: number
  bookedRanges: { start_date: string; end_date: string }[]
}

export default function BookingForm({ venueId, pricePerDay, bookedRanges }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const days =
    start && end
      ? Math.max(
          0,
          Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1
        )
      : 0
  const total = days * pricePerDay

  const overlaps = (s: string, e: string) =>
    bookedRanges.some(
      (r) => !(new Date(e) < new Date(r.start_date) || new Date(s) > new Date(r.end_date))
    )

  const handleBook = async () => {
    setError('')
    if (!start || !end) return setError('Pick both dates')
    if (new Date(end) < new Date(start)) return setError('End must be after start')
    if (overlaps(start, end)) return setError('Those dates are already booked')

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId, start, end, guests, total }),
    })
    const { url, error: err } = await res.json()
    if (err) {
      setError(err)
      setLoading(false)
      return
    }
    window.location.href = url
  }

  return (
    <div className="border rounded-lg p-6 sticky top-6 space-y-4">
      <div className="text-2xl font-bold">${pricePerDay}<span className="text-sm font-normal">/day</span></div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs">Check-in</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="text-xs">Check-out</label>
          <input
            type="date"
            min={start || new Date().toISOString().split('T')[0]}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div>
        <label className="text-xs">Guests</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      {days > 0 && (
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>${pricePerDay} × {days} days</span><span>${total}</span></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>${total}</span></div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleBook}
        disabled={loading || days === 0}
        className="w-full bg-black text-white py-3 rounded font-medium disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Reserve'}
      </button>
    </div>
  )
}
