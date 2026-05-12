'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function VenueFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get('q') ?? '');
  const [city, setCity] = useState(params.get('city') ?? '');
  const [minCapacity, setMinCapacity] = useState(params.get('minCapacity') ?? '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') ?? '');

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (city) sp.set('city', city);
    if (minCapacity) sp.set('minCapacity', minCapacity);
    if (maxPrice) sp.set('maxPrice', maxPrice);
    router.push(`/venues?${sp.toString()}`);
  }

  function clear() {
    setQ(''); setCity(''); setMinCapacity(''); setMaxPrice('');
    router.push('/venues');
  }

  return (
    <form onSubmit={apply} className="grid gap-3 md:grid-cols-5 p-4 border rounded-xl bg-card">
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="q">Search</Label>
        <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rooftop, garden..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="city">City</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cap">Min guests</Label>
        <Input id="cap" type="number" value={minCapacity} onChange={(e) => setMinCapacity(e.target.value)} placeholder="50" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="price">Max £/day</Label>
        <Input id="price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="1000" />
      </div>
      <div className="md:col-span-5 flex gap-2">
        <Button type="submit">Apply filters</Button>
        <Button type="button" variant="ghost" onClick={clear}>Clear</Button>
      </div>
    </form>
  );
}
