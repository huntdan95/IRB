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

  // Payment is not verified on this static/client-only page. Do not show a
  // success message that implies payment is confirmed; that would allow
  // anyone to fake the URL and see a false confirmation.
  return (
    <div className="bg-sand min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg bg-white rounded-xl shadow-warm-lg p-8 text-center">
        <h1 className="font-display text-3xl mb-4 text-deep-ocean">
          We&apos;ve received your booking reference
        </h1>
        <p className="text-driftwood mb-4">
          You will receive a confirmation email once your payment has been verified. If you did not
          complete payment, please return to the property page to finish your reservation.
        </p>
        <p className="text-sm text-driftwood mb-2">
          Reference: <span className="font-mono">{bookingId}</span>
        </p>
        <p className="text-sm text-driftwood/80">
          Questions? Check your email or contact us with the reference above.
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
