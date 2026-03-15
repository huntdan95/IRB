"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Property, Amenity } from "@/types";
import { getProperty, updateProperty } from "@/lib/firestore";
import { getAmenitiesByCategory } from "@/lib/amenityOptions";
import PhotoManager from "@/components/admin/PhotoManager";
import PricingEditor from "@/components/admin/PricingEditor";
import { useToast } from "@/context/ToastContext";

type TabId = "details" | "photos" | "pricing";

export default function AdminPropertyClient() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabId>("details");

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    async function load() {
      const p = await getProperty(slug);
      if (!p) {
        router.replace("/admin/properties");
        return;
      }
      setProperty(p);
      setLoading(false);
    }
    load();
  }, [slug, router]);

  if (loading || !property) {
    return <p className="text-driftwood">Loading property…</p>;
  }

  async function handleSaveDetails(e?: React.FormEvent) {
    e?.preventDefault();
    if (!property) return;
    setSaving(true);
    try {
      await updateProperty(property.id, {
        name: property.name,
        shortDescription: property.shortDescription,
        description: property.description,
        cancellationPolicy: property.cancellationPolicy,
        specs: property.specs,
        location: property.location,
        houseRules: property.houseRules,
        amenities: property.amenities,
      });
      showToast("Details saved.");
    } catch (err: any) {
      showToast(err?.message ?? "Failed to save.", "error");
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
    handleFieldChange("houseRules", rules as Property["houseRules"]);
  };

  const handleNearbyChange = (value: string) => {
    if (!property) return;
    const items = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    handleFieldChange("location", { ...property.location, nearbyAttractions: items });
  };

  const toggleAmenity = (amenity: Amenity) => {
    if (!property) return;
    const has = property.amenities.some((a) => a.name === amenity.name && a.category === amenity.category);
    const next = has
      ? property.amenities.filter((a) => !(a.name === amenity.name && a.category === amenity.category))
      : [...property.amenities, amenity];
    handleFieldChange("amenities", next);
  };

  const hasAmenity = (a: Amenity) =>
    property!.amenities.some((x) => x.name === a.name && x.category === a.category);

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "photos", label: "Photos" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">
            {property.name}
          </h1>
          <p className="text-xs uppercase tracking-wide text-driftwood">
            Slug: {property.slug}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-driftwood/30 overflow-hidden">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-medium transition-warm ${
                  tab === t.id
                    ? "bg-deep-ocean text-sand"
                    : "bg-white text-driftwood hover:bg-sand/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === "details" && (
            <button
              type="button"
              onClick={() => handleSaveDetails()}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold shadow-warm hover:bg-sea-glass/90 disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </div>

      {tab === "details" && (
        <form onSubmit={handleSaveDetails} className="space-y-6">
          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Basics</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Property name</label>
                <input
                  type="text"
                  value={property.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Short description</label>
                <textarea
                  value={property.shortDescription}
                  onChange={(e) => handleFieldChange("shortDescription", e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[60px]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Full description</label>
                <textarea
                  value={property.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[120px]"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Specs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["bedrooms", "bathrooms", "maxGuests", "sqft"] as const).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-driftwood mb-1">
                    {key === "sqft" ? "Square footage" : key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={property.specs[key]}
                    onChange={(e) =>
                      handleFieldChange("specs", {
                        ...property.specs,
                        [key]: Number(e.target.value || 0),
                      })
                    }
                    className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Amenities</h2>
            <p className="text-xs text-driftwood">Check all that apply.</p>
            <div className="space-y-4">
              {getAmenitiesByCategory().map(({ category, amenities }) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-deep-ocean mb-2">{category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {amenities.map((a) => (
                      <label
                        key={`${a.category}-${a.name}`}
                        className="flex items-center gap-2 text-sm text-driftwood cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={hasAmenity(a)}
                          onChange={() => toggleAmenity(a)}
                          className="rounded border-driftwood/40"
                        />
                        {a.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">House rules</h2>
            <textarea
              value={property.houseRules.join("\n")}
              onChange={(e) => handleHouseRulesChange(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
              placeholder="One rule per line"
            />
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Cancellation policy</h2>
            <textarea
              value={property.cancellationPolicy}
              onChange={(e) => handleFieldChange("cancellationPolicy", e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
            />
          </section>

          <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
            <h2 className="font-display text-xl text-deep-ocean">Location</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Address</label>
                <input
                  type="text"
                  value={property.location.address}
                  onChange={(e) =>
                    handleFieldChange("location", {
                      ...property.location,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-driftwood mb-1">Latitude</label>
                  <input
                    type="number"
                    value={property.location.lat}
                    onChange={(e) =>
                      handleFieldChange("location", {
                        ...property.location,
                        lat: Number(e.target.value || 0),
                      })
                    }
                    className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-driftwood mb-1">Longitude</label>
                  <input
                    type="number"
                    value={property.location.lng}
                    onChange={(e) =>
                      handleFieldChange("location", {
                        ...property.location,
                        lng: Number(e.target.value || 0),
                      })
                    }
                    className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Nearby attractions (one per line)</label>
                <textarea
                  value={property.location.nearbyAttractions.join("\n")}
                  onChange={(e) => handleNearbyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[80px]"
                />
              </div>
            </div>
          </section>
        </form>
      )}

      {tab === "photos" && (
        <div className="bg-white rounded-xl shadow-warm p-5">
          <PhotoManager
            propertyId={property.id}
            photos={property.photos}
            heroImage={property.heroImage}
            onChange={(photos) => setProperty((prev) => (prev ? { ...prev, photos } : prev))}
            onSetHero={async (url) => {
              handleFieldChange("heroImage", url);
              await updateProperty(property.id, { heroImage: url });
              showToast("Cover photo updated.");
            }}
          />
        </div>
      )}

      {tab === "pricing" && (
        <div className="bg-white rounded-xl shadow-warm p-5">
          <PricingEditor
            value={property.pricing}
            onChange={(pricing) => handleFieldChange("pricing", pricing)}
          />
          <div className="mt-4">
            <button
              type="button"
              onClick={async () => {
                setSaving(true);
                try {
                  await updateProperty(property.id, { pricing: property.pricing });
                  showToast("Pricing saved.");
                } catch (err: any) {
                  showToast(err?.message ?? "Failed to save.", "error");
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save pricing"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
