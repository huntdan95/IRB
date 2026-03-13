"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Property } from "@/types";
import { getAllProperties } from "@/lib/firestore";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getAllProperties();
      setProperties(all);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">Properties</h1>
          <p className="text-sm text-driftwood">
            Manage details, photos, and pricing for each condo.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-driftwood">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-driftwood">
          No properties found. Add them directly in Firestore under the <code>properties</code> collection.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/admin/properties/${property.slug}`}
              className="bg-white rounded-xl shadow-warm p-4 flex flex-col justify-between hover:shadow-warm-lg transition-warm"
            >
              <div>
                <h2 className="font-display text-xl text-deep-ocean mb-1">{property.name}</h2>
                <p className="text-xs uppercase tracking-wide text-driftwood mb-2">
                  Slug: {property.slug}
                </p>
                <p className="text-sm text-driftwood mb-3">
                  {property.shortDescription}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-driftwood">
                <span>
                  {property.specs.bedrooms} bd • {property.specs.bathrooms} ba • sleeps{" "}
                  {property.specs.maxGuests}
                </span>
                <span className="text-sea-glass font-semibold">
                  Edit →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

