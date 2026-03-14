import PropertyPageClient from "./PropertyPageClient";

export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export default function PropertyPage() {
  return <PropertyPageClient />;
}
