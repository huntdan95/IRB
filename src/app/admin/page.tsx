"use client";

import { useEffect, useState } from "react";
import { startOfMonth, endOfMonth, isAfter, isBefore, isWithinInterval } from "date-fns";
import type { Booking } from "@/types";
import { getBookings } from "@/lib/firestore";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getBookings();
      setBookings(all);
      setLoading(false);
    }
    load();
  }, []);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const upcoming = confirmed.filter((b) => (b.checkIn.toDate?.() ?? b.checkIn) > now);
  const active = confirmed.filter((b) => {
    const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
    const checkOut = b.checkOut.toDate?.() ?? b.checkOut;
    return isWithinInterval(now, { start: checkIn, end: checkOut });
  });

  const thisMonth = confirmed.filter((b) => {
    const created = b.createdAt.toDate?.() ?? b.createdAt;
    return isWithinInterval(created, { start: monthStart, end: monthEnd });
  });

  const revenueThisMonth = thisMonth.reduce((sum, b) => sum + b.totalPrice, 0);

  const totalNightsThisMonth = confirmed.reduce((sum, b) => {
    const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
    const checkOut = b.checkOut.toDate?.() ?? b.checkOut;
    const stayStart = isAfter(checkIn, monthStart) ? checkIn : monthStart;
    const stayEnd = isBefore(checkOut, monthEnd) ? checkOut : monthEnd;
    if (stayEnd <= stayStart) return sum;
    const nights = (stayEnd.getTime() - stayStart.getTime()) / (1000 * 60 * 60 * 24);
    return sum + nights;
  }, 0);

  const daysInMonth = (monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
  const numUnits = 2; // two condos
  const occupancyRate =
    numUnits > 0 && daysInMonth > 0
      ? Math.min(100, Math.round((totalNightsThisMonth / (numUnits * daysInMonth)) * 100))
      : 0;

  const nextCheckIns = upcoming
    .slice()
    .sort((a, b) => (a.checkIn.toDate?.().getTime?.() ?? 0) - (b.checkIn.toDate?.().getTime?.() ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-deep-ocean mb-2">Dashboard</h1>
        <p className="text-driftwood text-sm">
          At-a-glance view of upcoming stays, occupancy, and performance.
        </p>
      </div>

      {loading ? (
        <p className="text-driftwood">Loading bookings...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-warm p-4">
              <h2 className="text-xs uppercase tracking-wide text-driftwood mb-1">
                Upcoming check-ins (next 7 days)
              </h2>
              <p className="text-2xl font-semibold text-deep-ocean">
                {
                  confirmed.filter((b) => {
                    const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
                    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return checkIn > now && checkIn <= in7Days;
                  }).length
                }
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-warm p-4">
              <h2 className="text-xs uppercase tracking-wide text-driftwood mb-1">
                Active stays
              </h2>
              <p className="text-2xl font-semibold text-deep-ocean">{active.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-warm p-4">
              <h2 className="text-xs uppercase tracking-wide text-driftwood mb-1">
                Revenue this month
              </h2>
              <p className="text-2xl font-semibold text-deep-ocean">
                ${revenueThisMonth.toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-warm p-4">
              <h2 className="text-xs uppercase tracking-wide text-driftwood mb-1">
                Occupancy this month
              </h2>
              <p className="text-2xl font-semibold text-deep-ocean">{occupancyRate}%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-warm mt-6">
            <div className="px-4 py-3 border-b border-driftwood/20 flex items-center justify-between">
              <h2 className="font-display text-lg text-deep-ocean">Next check-ins</h2>
            </div>
            <div className="divide-y divide-driftwood/10">
              {nextCheckIns.length === 0 ? (
                <p className="px-4 py-4 text-sm text-driftwood">
                  No upcoming check-ins yet.
                </p>
              ) : (
                nextCheckIns.map((b) => {
                  const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
                  const checkOut = b.checkOut.toDate?.() ?? b.checkOut;
                  return (
                    <div key={b.id} className="px-4 py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-deep-ocean">
                          {b.guestName || "Unnamed guest"}
                        </p>
                        <p className="text-driftwood">
                          {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-driftwood">${b.totalPrice.toFixed(0)}</p>
                        <p className="text-xs text-driftwood/80 uppercase">
                          {b.status}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

