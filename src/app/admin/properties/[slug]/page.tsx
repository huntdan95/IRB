import AdminPropertyClient from "./AdminPropertyClient";
import { BEACHFRONT_PROPERTIES } from "@/data/beachfrontProperties";

export function generateStaticParams() {
  return BEACHFRONT_PROPERTIES.map((p) => ({ slug: p.slug }));
}

export default function AdminPropertyPage() {
  return <AdminPropertyClient />;
}
