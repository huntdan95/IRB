"use client";

import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  addMonths,
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
import type { Booking, Property } from "@/types";
import { getAllProperties, getBookings, createManualBlock } from "@/lib/firestore";
import { MOCK_BOOKINGS, MOCK_PROPERTY_IDS, getPropertyDisplayName } from "@/lib/mockData";

function toDate(v: { toDate?: () => Date } | Date): Date {
  return v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : (v as Date);
}

type DayStatus =
  | "available"
  | "confirmed"
  | "pending"
  | "blocked"
  | "current";

function getStatus(
  date: Date,
  bookings: Booking[],
  propertyId: string
): { status: DayStatus; booking?: Booking } {
  const now = new Date();
  const forDay = bookings.filter((b) => {
    if (b.propertyId !== propertyId) return false;
    const checkIn = toDate(b.checkIn);
    const checkOut = toDate(b.checkOut);
    return !isBefore(date, checkIn) && isBefore(date, checkOut);
  });
  const block = forDay.find((b) => b.isManualBlock);
  const confirmed = forDay.find(
    (b) => b.status === "confirmed" && !b.isManualBlock
  );
  const pending = forDay.find(
    (b) => b.status === "pending" && !b.isManualBlock
  );
  const current = forDay.find(
    (b) =>
      b.status === "confirmed" &&
      !b.isManualBlock &&
      isWithinInterval(now, {
        start: toDate(b.checkIn),
        end: toDate(b.checkOut),
      })
  );
  if (block) return { status: "blocked", booking: block };
  if (current) return { status: "current", booking: current };
  if (confirmed) return { status: "confirmed", booking: confirmed };
  if (pending) return { status: "pending", booking: pending };
  return { status: "available" };
}

const STATUS_CLASS: Record<
  DayStatus,
  string
> = {
  available: "bg-emerald-100 border-emerald-300 text-deep-ocean",
  confirmed: "bg-blue-200 border-blue-400 text-deep-ocean",
  pending: "bg-amber-200 border-amber-400 text-deep-ocean",
  blocked: "bg-gray-300 border-gray-400 text-deep-ocean",
  current: "bg-purple-200 border-purple-400 text-deep-ocean",
};

export default function AdminCalendarPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [month, setMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragPropertyId, setDragPropertyId] = useState<string | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [rangePopup, setRangePopup] = useState<{
    from: Date;
    to: Date;
    propertyId: string;
  } | null>(null);
  const [blockNotes, setBlockNotes] = useState("");
  const [savingBlock, setSavingBlock] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const [allBookings, props] = await Promise.all([
        getBookings(),
        getAllProperties(),
      ]);
      setProperties(props);
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

  const displayProperties = useMemo(() => {
    if (properties.length >= 2)
      return properties.slice(0, 2);
    return [
      { id: MOCK_PROPERTY_IDS.SUNRISE, name: "Sunrise Suite" },
      { id: MOCK_PROPERTY_IDS.SUNSET, name: "Sunset Suite" },
    ] as { id: string; name: string }[];
  }, [properties]);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
        end: endOfMonth(month),
      }),
    [month]
  );

  const goToToday = useCallback(() => {
    setMonth(startOfMonth(new Date()));
  }, []);

  const handleDayMouseDown = useCallback(
    (day: Date, propertyId: string) => {
      setDragStart(day);
      setDragPropertyId(propertyId);
      setDragEnd(day);
      setRangePopup(null);
      setDetailBooking(null);
    },
    []
  );

  const handleDayMouseEnter = useCallback(
    (day: Date) => {
      if (dragStart) setDragEnd(day);
    },
    [dragStart]
  );


  useEffect(() => {
    if (!dragStart || !dragEnd) return;
    const onUp = () => {
      const from = isBefore(dragStart, dragEnd) ? dragStart : dragEnd;
      const to = isAfter(dragStart, dragEnd) ? dragStart : dragEnd;
      const propertyId = dragPropertyId ?? displayProperties[0]?.id ?? "";
      if (isSameDay(from, to)) {
        const { booking } = getStatus(to, bookings, propertyId);
        if (booking) setDetailBooking(booking);
      } else {
        setRangePopup({ from, to, propertyId });
      }
      setDragStart(null);
      setDragEnd(null);
      setDragPropertyId(null);
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [dragStart, dragEnd, dragPropertyId, displayProperties, bookings]);

  const isInDragRange = useCallback(
    (day: Date) => {
      if (!dragStart || !dragEnd) return false;
      const from = isBefore(dragStart, dragEnd) ? dragStart : dragEnd;
      const to = isAfter(dragStart, dragEnd) ? dragStart : dragEnd;
      return !isBefore(day, from) && !isAfter(day, to);
    },
    [dragStart, dragEnd]
  );

  const handleBlockRange = async () => {
    if (!rangePopup) return;
    setSavingBlock(true);
    try {
      const checkOut = addDays(rangePopup.to, 1);
      await createManualBlock({
        propertyId: rangePopup.propertyId,
        checkIn: rangePopup.from,
        checkOut,
        notes: blockNotes || undefined,
      });
      const all = await getBookings();
      setBookings(all.length > 0 ? all : MOCK_BOOKINGS);
      setRangePopup(null);
      setBlockNotes("");
    } finally {
      setSavingBlock(false);
    }
  };

  const monthYearOptions = useMemo(() => {
    const out: { label: string; value: string }[] = [];
    const start = addMonths(new Date(), -12);
    for (let i = 0; i < 24; i++) {
      const d = addMonths(start, i);
      out.push({
        label: format(d, "MMMM yyyy"),
        value: format(d, "yyyy-MM"),
      });
    }
    return out;
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">
            Availability Calendar
          </h1>
          <p className="text-sm text-driftwood">
            View both properties. Drag across dates to block or add a booking.{" "}
            {useMock && "(Sample data)"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            className="px-2 py-1 rounded-lg border border-driftwood/40 text-sm text-driftwood hover:bg-sand"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="px-2 py-1 rounded-lg border border-driftwood/40 text-sm text-driftwood hover:bg-sand"
          >
            Today
          </button>
          <select
            value={format(month, "yyyy-MM")}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-").map(Number);
              setMonth(new Date(y, m - 1, 1));
            }}
            className="px-2 py-1 rounded-lg border border-driftwood/40 text-sm bg-white"
          >
            {monthYearOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="px-2 py-1 rounded-lg border border-driftwood/40 text-sm text-driftwood hover:bg-sand"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-driftwood">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-emerald-300 bg-emerald-100" />{" "}
          Available
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-blue-400 bg-blue-200" />{" "}
          Confirmed
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-amber-400 bg-amber-200" />{" "}
          Pending
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-purple-400 bg-purple-200" />{" "}
          Current stay
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-gray-400 bg-gray-300" />{" "}
          Blocked
        </span>
      </div>

      {loading ? (
        <p className="text-driftwood">Loading calendar…</p>
      ) : (
        <div className="space-y-8">
          {displayProperties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-xl shadow-warm p-4">
              <h2 className="font-display text-lg text-deep-ocean mb-3">
                {prop.name}
              </h2>
              <div
                className="grid grid-cols-7 gap-1 text-xs text-driftwood mb-2"
                onMouseLeave={() => setDragStart(null)}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center font-semibold">
                    {d}
                  </div>
                ))}
                {days.map((day) => {
                  const { status, booking } = getStatus(
                    day,
                    bookings,
                    prop.id
                  );
                  const isToday = isSameDay(day, new Date());
                  const inRange = isInDragRange(day);
                  return (
                    <div
                      key={`${prop.id}-${day.toISOString()}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleDayMouseDown(day, prop.id);
                      }}
                      onMouseEnter={() => handleDayMouseEnter(day)}
                      title={
                        booking
                          ? booking.isManualBlock
                            ? "Blocked"
                            : booking.guestName
                          : "Available"
                      }
                      className={`min-h-[56px] md:min-h-[64px] rounded-lg border text-xs flex flex-col items-start px-1.5 py-1.5 cursor-pointer select-none ${STATUS_CLASS[status]} ${inRange ? "ring-2 ring-deep-ocean ring-offset-1" : ""}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold">{format(day, "d")}</span>
                        {isToday && (
                          <span className="text-[9px] uppercase text-coral font-semibold">
                            Today
                          </span>
                        )}
                      </div>
                      {booking && !booking.isManualBlock && (
                        <span className="truncate w-full text-[10px] mt-0.5">
                          {booking.guestName || "Guest"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {rangePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-warm-lg p-6 max-w-sm w-full">
            <h3 className="font-display text-lg text-deep-ocean mb-2">
              Selected: {format(rangePopup.from, "MMM d")} –{" "}
              {format(rangePopup.to, "MMM d")}
            </h3>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-driftwood mb-1">
                Property
              </label>
              <select
                value={rangePopup.propertyId}
                onChange={(e) =>
                  setRangePopup((p) =>
                    p ? { ...p, propertyId: e.target.value } : p
                  )
                }
                className="w-full px-3 py-2 border border-driftwood/30 rounded-lg text-sm"
              >
                {displayProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-driftwood mb-1">
                Notes (optional)
              </label>
              <textarea
                value={blockNotes}
                onChange={(e) => setBlockNotes(e.target.value)}
                className="w-full px-3 py-2 border border-driftwood/30 rounded-lg text-sm min-h-[60px]"
                placeholder="e.g., Owner stay"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRangePopup(null);
                  setBlockNotes("");
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-driftwood/40 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockRange}
                disabled={savingBlock}
                className="flex-1 px-3 py-2 rounded-lg bg-deep-ocean text-sand text-sm font-semibold hover:bg-deep-ocean/90 disabled:opacity-70"
              >
                {savingBlock ? "Saving…" : "Block dates"}
              </button>
              <a
                href={`/admin/bookings?action=add`}
                className="flex-1 px-3 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 text-center"
              >
                Add booking
              </a>
            </div>
          </div>
        </div>
      )}

      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-warm-lg p-6 max-w-sm w-full">
            <h3 className="font-display text-lg text-deep-ocean mb-2">
              {detailBooking.isManualBlock ? "Blocked" : detailBooking.guestName}
            </h3>
            <p className="text-sm text-driftwood mb-4">
              {format(toDate(detailBooking.checkIn), "MMM d")} –{" "}
              {format(toDate(detailBooking.checkOut), "MMM d")}
            </p>
            <div className="flex gap-2">
              <a
                href={`/admin/bookings/${detailBooking.id}`}
                className="flex-1 px-3 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 text-center"
              >
                View details
              </a>
              <button
                type="button"
                onClick={() => setDetailBooking(null)}
                className="flex-1 px-3 py-2 rounded-lg border border-driftwood/40 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
