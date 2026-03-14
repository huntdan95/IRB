import BookingDetailClient from "./BookingDetailClient";

export function generateStaticParams() {
  return [{ id: "0" }];
}

export default function BookingDetailPage() {
  return <BookingDetailClient />;
}
