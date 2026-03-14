import AdminPropertyClient from "./AdminPropertyClient";

export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export default function AdminPropertyPage() {
  return <AdminPropertyClient />;
}
