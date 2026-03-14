"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Booking } from "@/types";
import { getBookingById } from "@/lib/firestore";

export default function BookingDetailClient() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function load() {
      const b = await getBookingById(id);
      if (!b) {
        router.replace("/admin/bookings");
        return;
      }
      setBooking(b);
      setLoading(false);
    }
    load();
  }, [id, router]);

  if (loading) {
    return <p className="text-driftwood">Loading booking...</p>;
  }

  if (!booking) {
    return null;
  }

  const checkIn = booking.checkIn.toDate?.() ?? booking.checkIn;
  const checkOut = booking.checkOut.toDate?.() ?? booking.checkOut;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">
            Booking detail
          </h1>
          <p className="text-sm text-driftwood">
            Reference: <span className="font-mono">{booking.id}</span>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-warm p-5 space-y-3">
          <h2 className="font-display text-lg text-deep-ocean mb-1">Guest</h2>
          <p className="text-deep-ocean font-medium">
            {booking.guestName || "Unnamed guest"}
          </p>
          <p className="text-sm text-driftwood">{booking.guestEmail}</p>
          <p className="text-sm text-driftwood">{booking.guestPhone}</p>
          {booking.specialRequests && (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-driftwood mb-1">
                Special requests
              </p>
              <p className="text-sm text-driftwood whitespace-pre-line">
                {booking.specialRequests}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-warm p-5 space-y-3">
          <h2 className="font-display text-lg text-deep-ocean mb-1">Stay</h2>
          <p className="text-sm text-driftwood">
            {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}
          </p>
          <p className="text-sm text-driftwood">
            Guests: {booking.numGuests}
          </p>
          <p className="text-sm text-driftwood">
            Status:{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs capitalize bg-shell text-deep-ocean">
              {booking.status}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-warm p-5 space-y-2 max-w-md">
        <h2 className="font-display text-lg text-deep-ocean mb-1">Payment</h2>
        <div className="flex justify-between text-sm text-driftwood">
          <span>
            Nightly × {booking.numNights}
          </span>
          <span>${(booking.nightlyRate * booking.numNights).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-driftwood">
          <span>Cleaning fee</span>
          <span>${booking.cleaningFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-driftwood">
          <span>Taxes</span>
          <span>${booking.taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-deep-ocean font-semibold border-t border-driftwood/20 pt-2 mt-2">
          <span>Total</span>
          <span>${booking.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
