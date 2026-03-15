import PropertyPageClient from "./PropertyPageClient";
import { BEACHFRONT_PROPERTIES } from "@/data/beachfrontProperties";

export function generateStaticParams() {
  return BEACHFRONT_PROPERTIES.map((p) => ({ slug: p.slug })).concat([
    { slug: "placeholder" },
  ]);
}

export default function PropertyPage() {
  return <PropertyPageClient />;
}
