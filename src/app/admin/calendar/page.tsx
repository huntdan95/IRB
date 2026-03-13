"use client";

import { useEffect, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import type { Booking, Property } from "@/types";
import { getAllProperties, getBookings, createManualBlock } from "@/lib/firestore";
import DateRangePicker from "@/components/booking/DateRangePicker";
import type { DateRange } from "react-day-picker";

export default function AdminCalendarPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [blockRange, setBlockRange] = useState<DateRange | undefined>();
  const [blockNotes, setBlockNotes] = useState("");
  const [savingBlock, setSavingBlock] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      const props = await getAllProperties();
      setProperties(props);
      if (props[0]) {
        setSelectedPropertyId(props[0].id);
      }
    }
    loadInitial();
  }, []);

  useEffect(() => {
    async function loadBookings() {
      if (!selectedPropertyId) return;
      setLoading(true);
      const all = await getBookings(selectedPropertyId);
      setBookings(all);
      setLoading(false);
    }
    loadBookings();
  }, [selectedPropertyId]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
    end: endOfMonth(month),
  });

  async function handleCreateBlock() {
    if (!selectedPropertyId || !blockRange?.from || !blockRange.to) return;
    setSavingBlock(true);
    try {
      await createManualBlock({
        propertyId: selectedPropertyId,
        checkIn: blockRange.from,
        checkOut: blockRange.to,
        notes: blockNotes,
      });
      const all = await getBookings(selectedPropertyId);
      setBookings(all);
      setBlockRange(undefined);
      setBlockNotes("");
    } finally {
      setSavingBlock(false);
    }
  }

  function getDayStatus(date: Date) {
    const forDay = bookings.filter((b) => {
      const checkIn = b.checkIn.toDate?.() ?? b.checkIn;
      const checkOut = b.checkOut.toDate?.() ?? b.checkOut;
      return date >= checkIn && date < checkOut;
    });

    const hasManual = forDay.some((b) => b.isManualBlock);
    const hasConfirmed = forDay.some((b) => b.status === "confirmed" && !b.isManualBlock);

    if (hasManual) return "blocked";
    if (hasConfirmed) return "booked";
    return "available";
  }

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">Calendar</h1>
          <p className="text-sm text-driftwood">
            Visual overview of bookings and owner blocks. Use the form below to block off dates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-2 py-1 rounded-lg border border-driftwood/40 text-sm text-driftwood hover:bg-sand transition-warm"
            onClick={() => setMonth((m) => addMonths(m, -1))}
          >
            ← Prev
          </button>
          <span className="font-semibold text-deep-ocean text-sm">
            {format(month, "MMMM yyyy")}
          </span>
          <button
            type="button"
            className="px-2 py-1 rounded-lg border border-driftwood/40 text-sm text-driftwood hover:bg-sand transition-warm"
            onClick={() => setMonth((m) => addMonths(m, 1))}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-driftwood flex items-center gap-2">
          Property
          <select
            value={selectedPropertyId ?? ""}
            onChange={(e) => setSelectedPropertyId(e.target.value || null)}
            className="px-3 py-1.5 border border-driftwood/40 rounded-lg bg-sand/40 text-sm"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-3 text-xs text-driftwood">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-sea-glass" /> Booked
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-coral" /> Blocked
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-driftwood/20 border border-driftwood/40" /> Available
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-driftwood">Loading calendar…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-warm p-4">
          <div className="grid grid-cols-7 gap-1 text-xs text-driftwood mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center font-semibold">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const status = getDayStatus(day);
              const isToday = isSameDay(day, new Date());
              const baseClasses =
                "min-h-[64px] rounded-lg border text-xs flex flex-col items-start px-1.5 py-1.5";
              const statusClasses =
                status === "booked"
                  ? "bg-sea-glass/20 border-sea-glass/50 text-deep-ocean"
                  : status === "blocked"
                  ? "bg-coral/15 border-coral/60 text-deep-ocean"
                  : "bg-sand/40 border-driftwood/30 text-driftwood";

              return (
                <div key={day.toISOString()} className={`${baseClasses} ${statusClasses}`}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-[11px]">
                      {format(day, "d")}
                    </span>
                    {isToday && (
                      <span className="text-[9px] uppercase text-coral font-semibold">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.6fr,1fr] gap-6 items-start">
        <section className="bg-white rounded-xl shadow-warm p-5">
          <h2 className="font-display text-xl text-deep-ocean mb-2">Manual block</h2>
          <p className="text-xs text-driftwood mb-4">
            Block dates for personal stays, maintenance, or holds. These will appear as blocked on the guest calendar.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-driftwood mb-1">
                Date range
              </label>
              <DateRangePicker value={blockRange} onChange={setBlockRange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-driftwood mb-1">
                Notes (optional)
              </label>
              <textarea
                value={blockNotes}
                onChange={(e) => setBlockNotes(e.target.value)}
                className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[80px]"
                placeholder="e.g., Owner stay, deep clean, maintenance"
              />
            </div>
            <button
              type="button"
              disabled={!selectedProperty || !blockRange?.from || !blockRange.to || savingBlock}
              onClick={handleCreateBlock}
              className="px-4 py-2 rounded-lg bg-deep-ocean text-sand text-sm font-semibold hover:bg-deep-ocean/90 disabled:opacity-60"
            >
              {savingBlock ? "Saving block…" : "Create block"}
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-warm p-5">
          <h2 className="font-display text-xl text-deep-ocean mb-2">Quick stats</h2>
          <p className="text-sm text-driftwood mb-2">
            Viewing calendar for{" "}
            <span className="font-semibold">
              {selectedProperty ? selectedProperty.name : "—"}
            </span>
            .
          </p>
          <p className="text-xs text-driftwood/80">
            A more detailed calendar with individual booking details, iCal sync, and drag-and-drop
            blocks can be layered on later. For now, use this view to keep an eye on occupancy and
            block key dates.
          </p>
        </section>
      </div>
    </div>
  );
}

