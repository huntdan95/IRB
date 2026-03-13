"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  // Future: properties, calendar, reviews, settings
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex h-screen bg-sand">
      <aside className="w-64 border-r border-driftwood/20 bg-white/80 backdrop-blur-sm hidden md:flex flex-col">
        <div className="px-6 py-4 border-b border-driftwood/20">
          <h1 className="font-display text-2xl text-deep-ocean">IRB Admin</h1>
          <p className="text-xs text-driftwood mt-1">Owner dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-sea-glass text-white"
                    : "text-driftwood hover:bg-sand hover:text-deep-ocean"
                } transition-warm`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-driftwood/20">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full px-3 py-2 rounded-lg text-sm bg-deep-ocean text-sand hover:bg-deep-ocean/90 transition-warm"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-driftwood/20 bg-white/70 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <span className="font-display text-xl text-deep-ocean">IRB Admin</span>
          </div>
          <div className="text-xs text-driftwood">
            Signed in as owner
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-sand/60 px-4 md:px-8 py-6">
          {/* Children are rendered by admin layout */}
        </main>
      </div>
    </div>
  );
}

