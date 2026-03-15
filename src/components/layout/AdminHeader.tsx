"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminHeader() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <header className="h-14 shrink-0 border-b border-driftwood/20 bg-white/70 backdrop-blur-sm flex items-center justify-between pl-14 md:pl-6 pr-4 md:pr-6">
      <div className="md:hidden font-display text-xl text-deep-ocean">
        IRB Admin
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm text-driftwood hidden sm:inline">
          Welcome, Owner
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="px-3 py-1.5 rounded-lg text-sm bg-deep-ocean text-sand hover:bg-deep-ocean/90 transition-warm"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
