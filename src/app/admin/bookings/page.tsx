"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Booking } from "@/types";
import { getBookings } from "@/lib/firestore";

type Filter = "upcoming" | "current" | "past" | "cancelled" | "all";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("upcoming");

  useEffect(() => {
    async function load() {
      const all = await getBookings();
      setBookings(all);
      setLoading(false);
    }
    load();
  }, []);

  const now = new Date();

  const filtered = bookings.filter((b) => {
    const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
    const checkOut = b.checkOut.toDate?.() ?? b.checkOut;

    if (filter === "cancelled") return b.status === "cancelled";
    if (filter === "current") {
      return checkIn <= now && checkOut >= now && b.status === "confirmed";
    }
    if (filter === "past") {
      return checkOut < now;
    }
    if (filter === "upcoming") {
      return checkIn > now && b.status === "confirmed";
    }
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "current", label: "Current" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
    { id: "all", label: "All" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">Bookings</h1>
          <p className="text-sm text-driftwood">
            View and manage all reservations across both condos.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === f.id
                ? "bg-sea-glass text-white border-sea-glass"
                : "bg-white text-driftwood border-driftwood/30 hover:bg-sand"
            } transition-warm`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-driftwood">Loading bookings...</p>
      ) : filtered.length === 0 ? (
        <p className="text-driftwood">No bookings match this filter yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-warm">
          <table className="min-w-full text-sm">
            <thead className="bg-shell/60 text-left text-xs uppercase tracking-wide text-driftwood">
              <tr>
                <th className="px-4 py-2">Guest</th>
                <th className="px-4 py-2">Dates</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-driftwood/10">
              {filtered.map((b) => {
                const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
                const checkOut = b.checkOut.toDate?.() ?? b.checkOut;
                const created = b.createdAt.toDate?.() ?? b.createdAt;
                return (
                  <tr key={b.id} className="hover:bg-sand/40">
                    <td className="px-4 py-2">
                      <div className="font-medium text-deep-ocean">
                        {b.guestName || "Unnamed guest"}
                      </div>
                      <div className="text-xs text-driftwood">{b.guestEmail}</div>
                    </td>
                    <td className="px-4 py-2 text-driftwood">
                      {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs capitalize bg-shell text-deep-ocean">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-deep-ocean">
                      ${b.totalPrice.toFixed(0)}
                    </td>
                    <td className="px-4 py-2 text-driftwood text-xs">
                      {created.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-sea-glass hover:text-sea-glass/80 text-xs font-semibold"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

