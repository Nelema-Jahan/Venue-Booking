import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Users, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VenueGallery } from '@/components/venue-gallery';
import BookingForm from '@/components/booking-form';
import type { VenueWithImages } from '@/types/database';

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: venue } = await supabase
    .from('venues')
    .select('*, venue_images(*)')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('venue_id', id)
    .in('status', ['confirmed', 'pending'])

  if (!venue) return notFound();
  const v = venue as VenueWithImages;
  const images = v.venue_images?.length
    ? v.venue_images.map((i) => i.url)
    : ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600'];

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/venues" className="text-sm text-muted-foreground hover:underline">
        ← Back to venues
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mt-4">{v.title}</h1>
      <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{v.location}, {v.city}</span>
        <span className="flex items-center gap-1"><Users className="h-4 w-4" />Up to {v.capacity} guests</span>
      </div>

      <div className="mt-6">
        <VenueGallery images={images} alt={v.title} />
      </div>

      <div className="grid gap-10 lg:grid-cols-3 mt-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">About this venue</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {v.description}
            </p>
          </section>

          {v.amenities?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {v.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />{a}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Booking card */}
        <aside className="lg:col-span-1">
          <BookingForm
            venueId={v.id}
            pricePerDay={v.price_per_day}
            bookedRanges={bookings || []}
          />
        </aside>
      </div>
    </div>
  );
}
