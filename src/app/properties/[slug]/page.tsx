import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { getProperty, getReviews } from "@/lib/firestore";
import { getBlockedRangesForProperty } from "@/lib/availability";
import PhotoGallery from "@/components/property/PhotoGallery";
import AmenityGrid from "@/components/property/AmenityGrid";
import ReviewCard from "@/components/property/ReviewCard";
import BookingWidget from "@/components/booking/BookingWidget";

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.slug);

  if (!property) {
    notFound();
  }

  const reviews = await getReviews(property.id);
  const blockedRanges = await getBlockedRangesForProperty(property.id);

  const nightSummary = `${property.specs.bedrooms} bd • ${property.specs.bathrooms} ba • sleeps ${property.specs.maxGuests} • ${property.specs.sqft.toLocaleString()} sqft`;
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
        <section className="bg-shell/60 border-b border-driftwood/20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-sm text-driftwood mb-2">Indian Rocks Beach, Florida</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-deep-ocean mb-3">
              {property.name}
            </h1>
            <p className="text-driftwood mb-4">{property.shortDescription}</p>
            <p className="text-sm text-driftwood/90">{nightSummary}</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8 lg:py-10 space-y-10">
          <PhotoGallery photos={property.photos} propertyName={property.name} />

          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-10 lg:items-start">
            <div className="space-y-10">
              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">About this property</h2>
                <p className="text-driftwood leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">Amenities</h2>
                <AmenityGrid amenities={property.amenities} />
              </section>

              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">Location</h2>
                <p className="text-driftwood mb-4">{property.location.address}</p>
                <div className="w-full h-64 rounded-xl overflow-hidden bg-driftwood/10 flex items-center justify-center text-driftwood">
                  Map coming soon – {property.location.lat.toFixed(4)}, {property.location.lng.toFixed(4)}
                </div>
                {property.location.nearbyAttractions?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-display text-lg mb-2 text-deep-ocean">
                      Nearby attractions
                    </h3>
                    <ul className="list-disc list-inside text-driftwood text-sm space-y-1">
                      {property.location.nearbyAttractions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">House rules</h2>
                {property.houseRules && property.houseRules.length > 0 ? (
                  <ul className="list-disc list-inside text-driftwood space-y-1">
                    {property.houseRules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-driftwood">
                    Detailed house rules will be added soon. Please reach out if you have any
                    questions.
                  </p>
                )}
              </section>

              <section>
                <h2 className="font-display text-2xl mb-4 text-deep-ocean">Cancellation policy</h2>
                <p className="text-driftwood leading-relaxed whitespace-pre-line">
                  {property.cancellationPolicy}
                </p>
              </section>

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

            <BookingWidget property={property} blockedRanges={blockedRanges} />
          </div>
        </section>
      </div>
    </>
  );
}

