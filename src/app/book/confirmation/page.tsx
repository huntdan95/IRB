"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  if (!sessionId || !bookingId) {
    return (
      <div className="bg-sand min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg bg-white rounded-xl shadow-warm-lg p-8 text-center">
          <h1 className="font-display text-3xl mb-4 text-deep-ocean">Booking not found</h1>
          <p className="text-driftwood">
            Missing session or booking reference. If you just completed a booking, please check your
            email for confirmation details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg bg-white rounded-xl shadow-warm-lg p-8 text-center">
        <h1 className="font-display text-3xl mb-4 text-deep-ocean">Thank you for your booking</h1>
        <p className="text-driftwood mb-4">
          Your reservation is confirmed. We&apos;re excited to host your stay on the Gulf Coast.
        </p>
        <p className="text-sm text-driftwood mb-2">
          Booking reference: <span className="font-mono">{bookingId}</span>
        </p>
        <p className="text-sm text-driftwood/80">
          A confirmation email with your stay details will arrive shortly.
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-sand min-h-screen flex items-center justify-center">
          <p className="text-driftwood">Loading…</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
