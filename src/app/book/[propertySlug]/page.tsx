import { notFound } from "next/navigation";
import { getProperty } from "@/lib/firestore";

interface CheckoutPageProps {
  params: { propertySlug: string };
  searchParams?: { session_id?: string };
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const property = await getProperty(params.propertySlug);
  if (!property) {
    notFound();
  }

  const sessionId = searchParams?.session_id;

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
        {sessionId ? (
          <p className="text-xs text-driftwood/80">
            Session ID: <span className="font-mono">{sessionId}</span>
          </p>
        ) : (
          <p className="text-sm text-coral">
            If you are not redirected automatically, please go back and start your booking again.
          </p>
        )}
      </section>
    </div>
  );
}

