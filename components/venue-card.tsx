import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import type { VenueWithImages } from '@/types/database';

export function VenueCard({ venue }: { venue: VenueWithImages }) {
  const cover = venue.venue_images?.[0]?.url ?? 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200';

  return (
    <Link href={`/venues/${venue.id}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <Image
          src={cover}
          alt={venue.title}
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-semibold text-lg leading-tight">{venue.title}</h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{venue.city}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {venue.capacity}</span>
        </div>
        <p className="text-sm pt-1">
          <span className="font-semibold">£{venue.price_per_day}</span>
          <span className="text-muted-foreground"> / day</span>
        </p>
      </div>
    </Link>
  );
}
