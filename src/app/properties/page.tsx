import Link from "next/link";
import Image from "next/image";
import { getAllProperties } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function PropertiesIndexPage() {
  const properties = await getAllProperties();

  return (
    <div className="bg-sand min-h-screen">
      <section className="bg-shell/60 border-b border-driftwood/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-deep-ocean mb-3">
            Our Beachfront Condos
          </h1>
          <p className="text-driftwood max-w-2xl">
            Two side-by-side beachfront condos on Indian Rocks Beach, thoughtfully designed for
            relaxed, modern coastal living.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {properties.length === 0 ? (
          <p className="text-driftwood">
            We&apos;re setting up our properties. Check back soon, or reach out via the contact
            details in the footer.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-warm-lg hover:shadow-warm transition-warm flex flex-col"
              >
                <div className="relative h-64 bg-driftwood/10">
                  {property.heroImage ? (
                    <Image
                      src={property.heroImage}
                      alt={property.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-driftwood">
                      Property image coming soon
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-2xl mb-2 text-deep-ocean">
                      {property.name}
                    </h2>
                    <p className="text-sm text-driftwood mb-3">
                      {property.specs.bedrooms} bd • {property.specs.bathrooms} ba • sleeps{" "}
                      {property.specs.maxGuests} • {property.specs.sqft.toLocaleString()} sqft
                    </p>
                    <p className="text-driftwood mb-4">{property.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-semibold text-coral">
                        ${property.pricing.baseRate}
                      </span>
                      <span className="text-driftwood"> / night</span>
                    </div>
                    <span className="text-sea-glass font-semibold text-sm">
                      View property →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

