import BookingDetailClient from "./BookingDetailClient";

// Booking IDs come from Firestore at runtime. With static export, only this
// placeholder is pre-rendered; real IDs (e.g. /admin/bookings/abc123) work
// when the host serves index.html for all routes (SPA fallback).
export function generateStaticParams() {
  return [{ id: "0" }];
}

export default function BookingDetailPage() {
  return <BookingDetailClient />;
}
