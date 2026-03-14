import BookCheckoutClient from "./BookCheckoutClient";

export function generateStaticParams() {
  return [{ propertySlug: "placeholder" }];
}

export default function CheckoutPage() {
  return <BookCheckoutClient />;
}
