"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Booking, Property } from "@/types";
import { getBookings, getAllProperties } from "@/lib/firestore";
import { MOCK_BOOKINGS, getPropertyDisplayName } from "@/lib/mockData";
import AddBookingModal from "@/components/admin/AddBookingModal";

type Filter = "all" | "upcoming" | "current" | "past" | "cancelled";

function toDate(v: { toDate?: () => Date } | Date): Date {
  return v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : (v as Date);
}

export default function AdminBookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") setAddModalOpen(true);
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      const [all, props] = await Promise.all([
        getBookings(),
        getAllProperties(),
      ]);
      setProperties(props);
      if (all.length > 0) {
        setBookings(all);
        setUseMock(false);
      } else {
        setBookings(MOCK_BOOKINGS);
        setUseMock(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const nowDate = new Date();
    let list = bookings.filter((b) => {
      const checkIn = toDate(b.checkIn);
      const checkOut = toDate(b.checkOut);
      if (filter === "cancelled") return b.status === "cancelled";
      if (filter === "current")
        return checkIn <= nowDate && checkOut >= nowDate && b.status === "confirmed" && !b.isManualBlock;
      if (filter === "past") return checkOut < nowDate;
      if (filter === "upcoming")
        return checkIn > nowDate && (b.status === "confirmed" || b.status === "pending") && !b.isManualBlock;
      return true;
    });
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.guestName?.toLowerCase().includes(q) ||
          b.guestEmail?.toLowerCase().includes(q) ||
          getPropertyDisplayName(b.propertyId, properties.find((p) => p.id === b.propertyId)?.name).toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filter, search, properties]);

  const propertyName = (id: string) =>
    getPropertyDisplayName(id, properties.find((p) => p.id === id)?.name);

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "current", label: "Current" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const statusBadge = (status: Booking["status"]) => {
    const c =
      status === "confirmed"
        ? "bg-sea-glass/15 text-sea-glass"
        : status === "pending"
        ? "bg-amber-100 text-amber-800"
        : status === "cancelled"
        ? "bg-coral/15 text-coral"
        : "bg-driftwood/20 text-driftwood";
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs capitalize ${c}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">Bookings</h1>
          <p className="text-sm text-driftwood">
            View and manage all reservations. {useMock && "(Using sample data)"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 transition-warm"
        >
          Add Booking
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-warm ${
              filter === t.id
                ? "bg-sea-glass text-white border-sea-glass"
                : "bg-white text-driftwood border-driftwood/30 hover:bg-sand"
            }`}
          >
            {t.label}
          </button>
        ))}
        <input
          type="search"
          placeholder="Search guest or property…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto min-w-[200px] px-3 py-1.5 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
        />
      </div>

      {loading ? (
        <p className="text-driftwood">Loading bookings…</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-warm">
          <table className="min-w-full text-sm">
            <thead className="bg-shell/60 text-left text-xs uppercase tracking-wide text-driftwood">
              <tr>
                <th className="px-4 py-2">Guest Name</th>
                <th className="px-4 py-2">Property</th>
                <th className="px-4 py-2">Check-in</th>
                <th className="px-4 py-2">Check-out</th>
                <th className="px-4 py-2">Guests</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Total Paid</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2 w-0"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-driftwood/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-driftwood">
                    No bookings match.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const checkIn = toDate(b.checkIn);
                  const checkOut = toDate(b.checkOut);
                  const created = toDate(b.createdAt);
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-sand/40 cursor-pointer"
                      onClick={() => window.location.assign(`/admin/bookings/${b.id}`)}
                    >
                      <td className="px-4 py-2 font-medium text-deep-ocean">
                        {b.isManualBlock ? "Owner block" : b.guestName || "—"}
                      </td>
                      <td className="px-4 py-2 text-driftwood">
                        {propertyName(b.propertyId)}
                      </td>
                      <td className="px-4 py-2 text-driftwood">
                        {checkIn.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-driftwood">
                        {checkOut.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-driftwood">{b.numGuests}</td>
                      <td className="px-4 py-2">{statusBadge(b.status)}</td>
                      <td className="px-4 py-2 text-right text-deep-ocean font-medium">
                        ${b.totalPrice.toFixed(0)}
                      </td>
                      <td className="px-4 py-2 text-driftwood text-xs">
                        {created.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-sea-glass hover:text-sea-glass/80 text-xs font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {addModalOpen && (
        <AddBookingModal
          properties={properties}
          onClose={() => setAddModalOpen(false)}
          onSaved={async () => {
            const all = await getBookings();
            if (all.length > 0) {
              setBookings(all);
              setUseMock(false);
            }
          }}
        />
      )}
    </div>
  );
}
