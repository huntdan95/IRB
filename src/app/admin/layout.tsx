"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, loading, router, pathname]);

  if (!user && pathname !== "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-driftwood/20 bg-white/70 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <span className="font-display text-xl text-deep-ocean">IRB Admin</span>
          </div>
          <div className="text-xs text-driftwood">Signed in as owner</div>
        </header>
        <main className="flex-1 overflow-y-auto bg-sand/60 px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

