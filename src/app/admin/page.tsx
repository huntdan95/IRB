"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  isWithinInterval,
  addDays,
} from "date-fns";
import type { Booking, Property } from "@/types";
import { getBookings, getAllProperties } from "@/lib/firestore";
import { MOCK_BOOKINGS, getPropertyDisplayName } from "@/lib/mockData";

function toDate(v: { toDate?: () => Date } | Date): Date {
  return v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : (v as Date);
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    async function load() {
      const [allBookings, allProps] = await Promise.all([
        getBookings(),
        getAllProperties(),
      ]);
      setProperties(allProps);
      if (allBookings.length > 0) {
        setBookings(allBookings);
        setUseMock(false);
      } else {
        setBookings(MOCK_BOOKINGS);
        setUseMock(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const next7 = addDays(now, 7);

  const confirmed = bookings.filter((b) => b.status === "confirmed" && !b.isManualBlock);
  const upcoming = confirmed.filter((b) => {
    const checkIn = toDate(b.checkIn);
    return checkIn > now && checkIn <= next7;
  });
  const currentlyOccupied = confirmed.filter((b) => {
    const checkIn = toDate(b.checkIn);
    const checkOut = toDate(b.checkOut);
    return isWithinInterval(now, { start: checkIn, end: checkOut });
  });
  const thisMonthBookings = confirmed.filter((b) => {
    const checkIn = toDate(b.checkIn);
    return isWithinInterval(checkIn, { start: monthStart, end: monthEnd });
  });
  const revenueThisMonth = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const recentBookings = [...bookings]
    .filter((b) => !b.isManualBlock)
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .slice(0, 10);

  const propertyName = (id: string) =>
    getPropertyDisplayName(id, properties.find((p) => p.id === id)?.name);

  const statCards = [
    {
      label: "Upcoming Check-ins (next 7 days)",
      value: upcoming.length,
      icon: "check-in",
      color: "bg-sea-glass text-white",
    },
    {
      label: "Currently Occupied",
      value: currentlyOccupied.length,
      icon: "occupancy",
      color: "bg-deep-ocean text-sand",
    },
    {
      label: "Total Bookings This Month",
      value: thisMonthBookings.length,
      icon: "bookings",
      color: "bg-driftwood/80 text-white",
    },
    {
      label: "Revenue This Month",
      value: `$${revenueThisMonth.toFixed(0)}`,
      icon: "revenue",
      color: "bg-coral/90 text-white",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-deep-ocean mb-2">Dashboard</h1>
        <p className="text-driftwood text-sm">
          At-a-glance view of upcoming stays, occupancy, and performance.
        </p>
      </div>

      {loading ? (
        <p className="text-driftwood">Loading…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-xl shadow-warm p-4 ${card.color}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-90">
                      {card.label}
                    </p>
                    <p className="text-2xl font-semibold mt-1">{card.value}</p>
                  </div>
                  <span className="text-3xl opacity-80" aria-hidden>
                    {card.icon === "check-in" && "📅"}
                    {card.icon === "occupancy" && "🏠"}
                    {card.icon === "bookings" && "📋"}
                    {card.icon === "revenue" && "💰"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/bookings?action=add"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 transition-warm shadow-warm"
            >
              Add Manual Booking
            </Link>
            <Link
              href="/admin/calendar?action=block"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-deep-ocean text-sand text-sm font-semibold hover:bg-deep-ocean/90 transition-warm shadow-warm"
            >
              Block Dates
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-warm overflow-hidden">
            <div className="px-4 py-3 border-b border-driftwood/20 flex items-center justify-between">
              <h2 className="font-display text-lg text-deep-ocean">
                Recent Bookings
              </h2>
              {useMock && (
                <span className="text-xs text-driftwood">Using sample data</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-shell/60 text-left text-xs uppercase tracking-wide text-driftwood">
                  <tr>
                    <th className="px-4 py-2">Guest Name</th>
                    <th className="px-4 py-2">Property</th>
                    <th className="px-4 py-2">Check-in</th>
                    <th className="px-4 py-2">Check-out</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-driftwood/10">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-driftwood">
                        No bookings yet.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => {
                      const checkIn = toDate(b.checkIn);
                      const checkOut = toDate(b.checkOut);
                      const statusClass =
                        b.status === "confirmed"
                          ? "bg-sea-glass/15 text-sea-glass"
                          : b.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : b.status === "cancelled"
                          ? "bg-coral/15 text-coral"
                          : "bg-driftwood/20 text-driftwood";
                      return (
                        <tr
                          key={b.id}
                          className="hover:bg-sand/40"
                        >
                          <td className="px-4 py-2">
                            <Link
                              href={`/admin/bookings/${b.id}`}
                              className="font-medium text-deep-ocean hover:text-sea-glass"
                            >
                              {b.guestName || "—"}
                            </Link>
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
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs capitalize ${statusClass}`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right text-deep-ocean font-medium">
                            ${b.totalPrice.toFixed(0)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
