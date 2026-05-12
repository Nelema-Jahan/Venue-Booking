import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { VenueCard } from '@/components/venue-card';
import type { VenueWithImages } from '@/types/database';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: venues } = await supabase
    .from('venues')
    .select('*, venue_images(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <>
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
          Find the perfect venue. Book in minutes.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          From rooftop lofts to garden pavilions — discover spaces hand-picked
          for weddings, launches, photoshoots, and everything in between.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/venues">Browse venues</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/signup">List your venue</Link>
          </Button>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured venues</h2>
          <Link href="/venues" className="text-sm hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(venues as VenueWithImages[] | null)?.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      </section>
    </>
  );
}
