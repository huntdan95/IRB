"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { differenceInCalendarDays, isWithinInterval } from "date-fns";
import type { Property } from "@/types";
import { calculatePricingForStay } from "@/lib/pricing";
import type { BlockedRange } from "@/lib/availability";
import DateRangePicker from "./DateRangePicker";

interface BookingWidgetProps {
  property: Property;
  blockedRanges: BlockedRange[];
}

export default function BookingWidget({ property, blockedRanges }: BookingWidgetProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!dateRange?.from || !dateRange.to) return 0;
    return differenceInCalendarDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const breakdown = useMemo(() => {
    if (!dateRange?.from || !dateRange.to || nights <= 0) return null;
    return calculatePricingForStay(property.pricing, dateRange.from, dateRange.to);
  }, [property.pricing, dateRange, nights]);

  const isDateDisabled = (date: Date) => {
    return blockedRanges.some((range) =>
      isWithinInterval(date, { start: range.start, end: range.end })
    );
  };

  async function handleBookNow() {
    setError(null);

    if (!dateRange?.from || !dateRange.to || !breakdown) {
      setError("Please select your check-in and check-out dates.");
      return;
    }

    if (nights < property.pricing.minNights) {
      setError(`Minimum stay is ${property.pricing.minNights} nights.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          propertySlug: property.slug,
          checkIn: dateRange.from.toISOString(),
          checkOut: dateRange.to.toISOString(),
          numGuests: guests,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to start checkout. Please try again.");
      }

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.sessionId) {
        router.push(`/book/${property.slug}?session_id=${data.sessionId}`);
      } else {
        throw new Error("Missing checkout session data.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <aside className="bg-white rounded-xl shadow-warm-lg p-6 sticky top-24 space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-semibold text-coral">
            ${property.pricing.baseRate}
          </span>
          <span className="text-sm text-driftwood"> / night</span>
        </div>
        <span className="text-xs uppercase tracking-wide text-driftwood">
          No service fees
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Dates
          </label>
          <DateRangePicker value={dateRange} onChange={setDateRange} disabled={isDateDisabled} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Guests
          </label>
          <div className="flex items-center justify-between border rounded-lg px-3 py-2">
            <span className="text-sm text-deep-ocean">
              {guests} guest{guests !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-driftwood/40 flex items-center justify-center text-lg text-driftwood hover:bg-sand transition-warm disabled:opacity-40"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
              >
                −
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-driftwood/40 flex items-center justify-center text-lg text-driftwood hover:bg-sand transition-warm disabled:opacity-40"
                onClick={() =>
                  setGuests((g) => Math.min(property.specs.maxGuests, g + 1))
                }
                disabled={guests >= property.specs.maxGuests}
              >
                +
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-driftwood">
            Maximum {property.specs.maxGuests} guests.
          </p>
        </div>

        {breakdown && (
          <div className="border-t border-driftwood/20 pt-3 text-sm text-driftwood space-y-1">
            <div className="flex justify-between">
              <span>
                ${property.pricing.baseRate} × {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span>${breakdown.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${breakdown.cleaningFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${breakdown.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-deep-ocean pt-2 border-t border-driftwood/20 mt-2">
              <span>Total</span>
              <span>${breakdown.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-coral mt-2">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleBookNow}
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm shadow-warm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Starting checkout..." : "Book now"}
      </button>

      <p className="mt-2 text-xs text-driftwood">
        You&apos;ll be redirected to a secure payment page to complete your booking.
      </p>
    </aside>
  );
}

