import { stripe } from "@/lib/stripe";
import { notFound } from "next/navigation";

interface ConfirmationPageProps {
  searchParams?: { session_id?: string; booking_id?: string };
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const sessionId = searchParams?.session_id;
  const bookingId = searchParams?.booking_id;

  if (!sessionId || !bookingId) {
    notFound();
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return (
      <div className="bg-sand min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg bg-white rounded-xl shadow-warm-lg p-8 text-center">
          <h1 className="font-display text-3xl mb-4 text-deep-ocean">Payment pending</h1>
          <p className="text-driftwood mb-4">
            We haven&apos;t received a completed payment for this booking yet. If you believe this is
            an error, please check your email or try the booking again.
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

