"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyPhoto } from "@/types";

interface PhotoGalleryProps {
  photos: PropertyPhoto[];
  propertyName: string;
}

export default function PhotoGallery({ photos, propertyName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-driftwood/10 rounded-xl flex items-center justify-center text-driftwood">
        Photo gallery coming soon
      </div>
    );
  }

  const hero = photos[0];
  const thumbnails = photos.slice(1, 5);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          className="relative md:col-span-2 aspect-[16/10] overflow-hidden rounded-xl shadow-warm-lg group"
          onClick={() => setActiveIndex(0)}
        >
          <Image
            src={hero.url}
            alt={hero.caption || propertyName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </button>

        <div className="grid grid-cols-2 gap-4">
          {thumbnails.map((photo, index) => (
            <button
              key={photo.url}
              type="button"
              className="relative aspect-square overflow-hidden rounded-xl shadow-warm group"
              onClick={() => setActiveIndex(index + 1)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || propertyName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[activeIndex].url}
              alt={photos[activeIndex].caption || propertyName}
              fill
              className="object-cover rounded-xl shadow-warm-lg"
              sizes="100vw"
            />
            {photos[activeIndex].caption && (
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-sand text-sm px-4 py-3 rounded-b-xl">
                {photos[activeIndex].caption}
              </div>
            )}
            <button
              type="button"
              className="absolute top-4 right-4 bg-black/70 text-sand rounded-full px-3 py-1 text-sm hover:bg-black transition-warm"
              onClick={() => setActiveIndex(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

