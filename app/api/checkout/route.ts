import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const { venueId, start, end, guests, total } = await req.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: venue, error: vErr } = await supabase
    .from('venues').select('title, price_per_day').eq('id', venueId).single()
  if (vErr || !venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 })

  // Re-check availability server-side
  const { data: clashes } = await supabase
    .from('bookings')
    .select('id')
    .eq('venue_id', venueId)
    .in('status', ['confirmed', 'pending'])
    .or(`and(start_date.lte.${end},end_date.gte.${start})`)
  if (clashes && clashes.length > 0) {
    return NextResponse.json({ error: 'Dates no longer available' }, { status: 409 })
  }

  // Create pending booking
  const { data: booking, error: bErr } = await supabase
    .from('bookings')
    .insert({
      venue_id: venueId,
      customer_id: user.id,
      start_date: start,
      end_date: end,
      guests,
      total_price: total,
      status: 'pending',
    })
    .select()
    .single()
  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 })

  // Create Stripe Checkout session
  const origin = req.headers.get('origin')!
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: venue.title, description: `${start} → ${end}` },
        unit_amount: Math.round(total * 100),
      },
      quantity: 1,
    }],
    success_url: `${origin}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/venues/${venueId}`,
    metadata: { booking_id: booking.id },
  })

  // Save session id on booking
  await supabase.from('bookings').update({ stripe_session_id: session.id }).eq('id', booking.id)

  return NextResponse.json({ url: session.url })
}
