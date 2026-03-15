import BookCheckoutClient from "./BookCheckoutClient";
import { BEACHFRONT_PROPERTIES } from "@/data/beachfrontProperties";

export function generateStaticParams() {
  return BEACHFRONT_PROPERTIES.map((p) => ({ propertySlug: p.slug }));
}

export default function CheckoutPage() {
  return <BookCheckoutClient />;
}
