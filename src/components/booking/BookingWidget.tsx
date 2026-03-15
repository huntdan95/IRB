"use client";

import { useState, useMemo } from "react";
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
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

  function handleBookNow() {
    setError(null);

    if (!dateRange?.from || !dateRange.to || !breakdown) {
      setError("Please select your check-in and check-out dates.");
      return;
    }

    if (nights < property.pricing.minNights) {
      setError(`Minimum stay is ${property.pricing.minNights} nights.`);
      return;
    }

    // Checkout will be handled later via Firebase Cloud Functions
    setError("Online checkout is coming soon. Please contact us to complete your reservation.");
  }

  return (
    <aside className="bg-white rounded-xl shadow-warm-lg p-6 sticky top-24 space-y-4 overflow-hidden min-w-0 max-w-full">
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
        <div className="min-w-0 w-full">
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
        className="w-full px-4 py-3 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm shadow-warm font-semibold"
      >
        Reserve
      </button>

      <p className="mt-2 text-xs text-driftwood">
        You won&apos;t be charged yet.
      </p>
    </aside>
  );
}

