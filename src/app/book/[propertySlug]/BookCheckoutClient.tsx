"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProperty } from "@/lib/firestore";
import type { Property } from "@/types";

export default function BookCheckoutClient() {
  const params = useParams();
  const propertySlug = typeof params.propertySlug === "string" ? params.propertySlug : "";
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!propertySlug) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const p = await getProperty(propertySlug);
        if (!p) setNotFound(true);
        else setProperty(p);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [propertySlug]);

  if (loading) {
    return (
      <div className="bg-sand min-h-screen flex items-center justify-center">
        <p className="text-driftwood">Loading…</p>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="bg-sand min-h-screen flex items-center justify-center px-4">
        <p className="text-driftwood">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen">
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-deep-ocean mb-4">
          Redirecting to secure checkout
        </h1>
        <p className="text-driftwood mb-6">
          We&apos;re preparing your booking for <span className="font-semibold">{property.name}</span>.
          You&apos;ll be taken to our payment partner to complete your reservation.
        </p>
        <p className="text-sm text-coral">
          Checkout will be available soon. For now, please contact us to complete your reservation.
        </p>
      </section>
    </div>
  );
}
