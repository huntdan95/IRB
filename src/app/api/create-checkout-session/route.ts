import { NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";
import { stripe } from "@/lib/stripe";
import { getProperty, createBooking } from "@/lib/firestore";
import { getBlockedRangesForProperty, isRangeAvailable } from "@/lib/availability";
import { calculatePricingForStay } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, propertySlug, checkIn, checkOut, numGuests } = body as {
      propertyId: string;
      propertySlug: string;
      checkIn: string;
      checkOut: string;
      numGuests: number;
    };

    if (!propertyId || !checkIn || !checkOut || !numGuests) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const property = await getProperty(propertySlug);
    if (!property || property.id !== propertyId) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const blockedRanges = await getBlockedRangesForProperty(propertyId);
    const available = isRangeAvailable(checkInDate, checkOutDate, blockedRanges);
    if (!available) {
      return NextResponse.json(
        { error: "Selected dates are no longer available. Please choose new dates." },
        { status: 409 }
      );
    }

    const breakdown = calculatePricingForStay(property.pricing, checkInDate, checkOutDate);

    const pendingBookingId = await createBooking({
      propertyId: property.id,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      checkIn: Timestamp.fromDate(checkInDate),
      checkOut: Timestamp.fromDate(checkOutDate),
      numGuests,
      nightlyRate: property.pricing.baseRate,
      numNights: breakdown.nights.length,
      cleaningFee: breakdown.cleaningFee,
      taxes: breakdown.taxes,
      totalPrice: breakdown.total,
      status: "pending",
      stripeSessionId: undefined,
      stripePaymentIntentId: undefined,
      specialRequests: "",
      ownerNotes: "",
      isManualBlock: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(breakdown.total * 100),
            product_data: {
              name: `${property.name} — ${breakdown.nights.length} nights`,
              description: `${checkInDate.toLocaleDateString()} – ${checkOutDate.toLocaleDateString()}`,
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/book/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${pendingBookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/properties/${property.slug}`,
      metadata: {
        bookingId: pendingBookingId,
        propertyId: property.id,
        propertySlug,
        checkIn,
        checkOut,
        numGuests: String(numGuests),
      },
    });

    return NextResponse.json({ sessionId: session.id, checkoutUrl: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}

