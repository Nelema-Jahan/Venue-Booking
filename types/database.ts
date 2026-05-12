export type VenueStatus = 'pending' | 'approved' | 'rejected';

export type Venue = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  capacity: number;
  price_per_day: number;
  amenities: string[];
  status: VenueStatus;
  created_at: string;
};

export type VenueImage = {
  id: string;
  venue_id: string;
  url: string;
  sort_order: number;
};

export type VenueWithImages = Venue & {
  venue_images: VenueImage[];
};
