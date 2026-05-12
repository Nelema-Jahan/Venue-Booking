import { createClient } from '@/lib/supabase/server';
import { VenueCard } from '@/components/venue-card';
import { VenueFilters } from '@/components/venue-filters';
import type { VenueWithImages } from '@/types/database';

type SearchParams = {
  q?: string;
  city?: string;
  minCapacity?: string;
  maxPrice?: string;
};

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('venues')
    .select('*, venue_images(*)')
    .eq('status', 'approved');

  if (params.q) query = query.ilike('title', `%${params.q}%`);
  if (params.city) query = query.ilike('city', `%${params.city}%`);
  if (params.minCapacity) query = query.gte('capacity', Number(params.minCapacity));
  if (params.maxPrice) query = query.lte('price_per_day', Number(params.maxPrice));

  const { data: venues } = await query.order('created_at', { ascending: false });
  const list = (venues ?? []) as VenueWithImages[];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Browse venues</h1>
      <p className="text-muted-foreground mb-8">{list.length} venues available</p>

      <VenueFilters />

      {list.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          No venues match your search. Try widening your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {list.map((v) => <VenueCard key={v.id} venue={v} />)}
        </div>
      )}
    </div>
  );
}
