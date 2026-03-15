"use client";

import Link from "next/link";
import Image from "next/image";
import { BEACHFRONT_PROPERTIES } from "@/data/beachfrontProperties";

export default function PropertiesIndexPage() {
  return (
    <div className="bg-sand min-h-screen">
      <section className="bg-shell/60 border-b border-driftwood/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-deep-ocean mb-3">
            Our Properties
          </h1>
          <p className="text-driftwood max-w-2xl text-lg">
            Two beautifully updated beachfront condos in Indian Rocks Beach, Florida — steps from the
            Gulf of Mexico.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {BEACHFRONT_PROPERTIES.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.slug}`}
              className="bg-white rounded-xl overflow-hidden shadow-warm-lg hover:shadow-warm transition-warm flex flex-col group"
            >
              <div className="relative h-72 md:h-80 bg-driftwood/10 overflow-hidden">
                <Image
                  src={property.heroImage}
                  alt={property.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl mb-2 text-deep-ocean">
                    {property.name}
                  </h2>
                  <p className="text-sm text-driftwood mb-3">
                    2 BR · 2 BA · Gulf View · Sleeps 6
                  </p>
                  <p className="text-driftwood mb-4">{property.shortDescription}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-2xl font-semibold text-coral">
                      ${property.pricing.baseRate}
                    </span>
                    <span className="text-driftwood"> / night</span>
                  </div>
                  <span className="text-sea-glass font-semibold text-sm group-hover:underline">
                    View Property →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
