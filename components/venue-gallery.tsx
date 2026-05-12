'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function VenueGallery({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const main = images[0];
  const rest = images.slice(1, 5);

  function openAt(i: number) {
    setActive(i);
    setOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
        <button
          onClick={() => openAt(0)}
          className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto relative bg-muted"
        >
          <Image src={main} alt={alt} fill className="object-cover hover:opacity-90 transition" />
        </button>
        {rest.map((url, i) => (
          <button
            key={url + i}
            onClick={() => openAt(i + 1)}
            className="hidden md:block aspect-square relative bg-muted"
          >
            <Image src={url} alt={`${alt} ${i + 2}`} fill className="object-cover hover:opacity-90 transition" />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <div className="aspect-video relative">
            <Image src={images[active]} alt={alt} fill className="object-contain" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((url, i) => (
              <button
                key={url + i}
                onClick={() => setActive(i)}
                className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                  i === active ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image src={url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
