"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/types";
import { getProperty, updateProperty } from "@/lib/firestore";
import PhotoManager from "@/components/admin/PhotoManager";
import PricingEditor from "@/components/admin/PricingEditor";

interface AdminPropertyPageProps {
  params: { slug: string };
}

export default function AdminPropertyPage({ params }: AdminPropertyPageProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const p = await getProperty(params.slug);
      if (!p) {
        router.replace("/admin/properties");
        return;
      }
      setProperty(p);
      setLoading(false);
    }
    load();
  }, [params.slug, router]);

  if (loading || !property) {
    return <p className="text-driftwood">Loading property…</p>;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated: Partial<Property> = {
        name: property.name,
        shortDescription: property.shortDescription,
        description: property.description,
        cancellationPolicy: property.cancellationPolicy,
        specs: property.specs,
        location: property.location,
        pricing: property.pricing,
        houseRules: property.houseRules,
      };
      await updateProperty(property.id, updated);
      setMessage("Property saved.");
    } finally {
      setSaving(false);
    }
  }

  const handleFieldChange = <K extends keyof Property>(key: K, value: Property[K]) => {
    setProperty((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleHouseRulesChange = (value: string) => {
    const rules = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    handleFieldChange("houseRules", rules as any);
  };

  const handleNearbyChange = (value: string) => {
    const items = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    handleFieldChange("location", { ...property.location, nearbyAttractions: items } as any);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">
            {property.name}
          </h1>
          <p className="text-xs uppercase tracking-wide text-driftwood">
            Slug: {property.slug}
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold shadow-warm hover:bg-sea-glass/90 disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {message && (
        <p className="text-xs text-sea-glass">{message}</p>
      )}

      <div className="grid lg:grid-cols-[2fr,1.2fr] gap-10 items-start">
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Basics</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Property name
                </label>
                <input
                  type="text"
                  value={property.name}
                  onChange={(e) => handleFieldChange("name", e.target.value as any)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Short description
                </label>
                <textarea
                  value={property.shortDescription}
                  onChange={(e) => handleFieldChange("shortDescription", e.target.value as any)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[60px]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Full description
                </label>
                <textarea
                  value={property.description}
                  onChange={(e) => handleFieldChange("description", e.target.value as any)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[120px]"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Specs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={property.specs.bedrooms}
                  onChange={(e) =>
                    handleFieldChange("specs", {
                      ...property.specs,
                      bedrooms: Number(e.target.value || 0),
                    } as any)
                  }
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={property.specs.bathrooms}
                  onChange={(e) =>
                    handleFieldChange("specs", {
                      ...property.specs,
                      bathrooms: Number(e.target.value || 0),
                    } as any)
                  }
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Max guests
                </label>
                <input
                  type="number"
                  value={property.specs.maxGuests}
                  onChange={(e) =>
                    handleFieldChange("specs", {
                      ...property.specs,
                      maxGuests: Number(e.target.value || 0),
                    } as any)
                  }
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Sqft
                </label>
                <input
                  type="number"
                  value={property.specs.sqft}
                  onChange={(e) =>
                    handleFieldChange("specs", {
                      ...property.specs,
                      sqft: Number(e.target.value || 0),
                    } as any)
                  }
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Location</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={property.location.address}
                  onChange={(e) =>
                    handleFieldChange("location", {
                      ...property.location,
                      address: e.target.value,
                    } as any)
                  }
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-driftwood mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    value={property.location.lat}
                    onChange={(e) =>
                      handleFieldChange("location", {
                        ...property.location,
                        lat: Number(e.target.value || 0),
                      } as any)
                    }
                    className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-driftwood mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    value={property.location.lng}
                    onChange={(e) =>
                      handleFieldChange("location", {
                        ...property.location,
                        lng: Number(e.target.value || 0),
                      } as any)
                    }
                    className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">
                  Nearby attractions (one per line)
                </label>
                <textarea
                  value={property.location.nearbyAttractions.join("\n")}
                  onChange={(e) => handleNearbyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[80px]"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">House rules</h2>
            <textarea
              value={property.houseRules.join("\n")}
              onChange={(e) => handleHouseRulesChange(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
            />
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Cancellation policy</h2>
            <textarea
              value={property.cancellationPolicy}
              onChange={(e) => handleFieldChange("cancellationPolicy", e.target.value as any)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-warm p-5">
            <PricingEditor
              value={property.pricing}
              onChange={(pricing) => handleFieldChange("pricing", pricing as any)}
            />
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5">
            <PhotoManager
              propertyId={property.id}
              photos={property.photos}
              onChange={(photos) =>
                setProperty((prev) => (prev ? { ...prev, photos } : prev))
              }
            />
          </section>
        </div>
      </div>
    </form>
  );
}

