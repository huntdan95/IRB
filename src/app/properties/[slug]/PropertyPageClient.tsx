"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import {
  getStaticPropertyBySlug,
  getStaticReviewsForProperty,
} from "@/data/beachfrontProperties";
import { getProperty, getReviews } from "@/lib/firestore";
import { getBlockedRangesForProperty } from "@/lib/availability";
import PhotoGallery from "@/components/property/PhotoGallery";
import AmenityGrid from "@/components/property/AmenityGrid";
import ReviewCard from "@/components/property/ReviewCard";
import BookingWidget from "@/components/booking/BookingWidget";
import type { Property } from "@/types";
import type { Review } from "@/types";
import type { BlockedRange } from "@/lib/availability";

const LOCATION_COPY =
  "Indian Rocks Beach is a charming, laid-back Gulf Coast town known for its beautiful white sand beaches, stunning sunsets, and local dining scene. Our condos are located steps from the beach with easy access to restaurants, shops, and attractions.";

export default function PropertyPageClient() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const staticProp = getStaticPropertyBySlug(slug);
    if (staticProp) {
      setProperty(staticProp);
      setReviews(getStaticReviewsForProperty(staticProp.id));
      setBlockedRanges([]);
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const p = await getProperty(slug);
        if (!p) {
          setNotFound(true);
          return;
        }
        setProperty(p);
        const [revs, blocked] = await Promise.all([
          getReviews(p.id),
          getBlockedRangesForProperty(p.id),
        ]);
        setReviews(revs);
        setBlockedRanges(blocked);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-sand min-h-screen flex items-center justify-center">
        <p className="text-driftwood">Loading property…</p>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="bg-sand min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-deep-ocean mb-2">Property not found</h1>
          <p className="text-driftwood mb-4">This property may no longer be available.</p>
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className="px-4 py-2 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90"
          >
            View all properties
          </button>
        </div>
      </div>
    );
  }

  const nightSummary = `${property.specs.bedrooms} Bedrooms · ${property.specs.bathrooms} Bathrooms · Sleeps ${property.specs.maxGuests} · Gulf View`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: property.name,
    description: property.shortDescription,
    url: `${siteUrl}/properties/${property.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location.address,
      addressLocality: "Indian Rocks Beach",
      addressRegion: "FL",
      addressCountry: "US",
    },
    numberOfRooms: property.specs.bedrooms,
    maximumAttendeeCapacity: property.specs.maxGuests,
  };

  return (
    <>
      <Script
        id={`ld-json-property-${property.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="bg-sand">
        {/* Property Header */}
        <section className="bg-shell/60 border-b border-driftwood/20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-sm text-driftwood mb-2">Indian Rocks Beach, Florida</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-deep-ocean mb-3">
              {property.name}
            </h1>
            <p className="text-sm text-driftwood/90">{nightSummary}</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8 lg:py-10 pb-24 md:pb-10 space-y-10">
          {/* Photo Gallery */}
          <PhotoGallery photos={property.photos} propertyName={property.name} />

          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-10 lg:items-start">
            <div className="space-y-10">
              {/* Description */}
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">
                  About this property
                </h2>
                <p className="text-driftwood leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </section>

              {/* Amenities */}
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">Amenities</h2>
                <AmenityGrid amenities={property.amenities} />
              </section>

              {/* Location */}
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">Location</h2>
                <p className="text-driftwood leading-relaxed mb-4">{LOCATION_COPY}</p>
                <div className="w-full h-64 rounded-xl overflow-hidden bg-driftwood/10 border border-driftwood/20 flex flex-col items-center justify-center text-driftwood p-4 mb-4">
                  <p className="font-semibold text-deep-ocean mb-1">Indian Rocks Beach, Florida</p>
                  <p className="text-sm">Map placeholder — full map coming soon</p>
                </div>
                <h3 className="font-display text-lg mb-2 text-deep-ocean">Nearby highlights</h3>
                <ul className="grid sm:grid-cols-2 gap-2 text-driftwood text-sm">
                  {property.location.nearbyAttractions.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sea-glass shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* House Rules */}
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">House rules</h2>
                <ul className="list-disc list-inside text-driftwood space-y-1">
                  {property.houseRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </section>

              {/* Cancellation Policy */}
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">
                  Cancellation policy
                </h2>
                <p className="text-driftwood leading-relaxed whitespace-pre-line">
                  {property.cancellationPolicy}
                </p>
              </section>

              {/* Reviews */}
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">Guest reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-driftwood">
                    Reviews will appear here once guests start sharing their stays.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Booking Widget - sticky on desktop; mobile has fixed bottom bar */}
            <div id="booking-widget" className="lg:sticky lg:top-24">
              <BookingWidget property={property} blockedRanges={blockedRanges} />
            </div>
          </div>

          {/* Mobile sticky bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-driftwood/20 shadow-warm-lg px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xl font-semibold text-coral">
                ${property.pricing.baseRate}
              </span>
              <span className="text-sm text-driftwood"> / night</span>
            </div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 bg-sea-glass text-white rounded-lg font-semibold shadow-warm shrink-0"
            >
              Reserve
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
