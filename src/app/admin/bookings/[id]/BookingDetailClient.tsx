"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Booking } from "@/types";
import type { BookingStatus } from "@/types";
import { getBookingById, updateBooking } from "@/lib/firestore";
import { getPropertyDisplayName } from "@/lib/mockData";
import { useToast } from "@/context/ToastContext";

function toDate(v: { toDate?: () => Date } | Date): Date {
  return v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : (v as Date);
}

export default function BookingDetailClient() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const id = typeof params.id === "string" ? params.id : "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [ownerNotesDraft, setOwnerNotesDraft] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function load() {
      const b = await getBookingById(id);
      if (!b) {
        router.replace("/admin/bookings");
        return;
      }
      setBooking(b);
      setOwnerNotesDraft(b.ownerNotes ?? "");
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function saveOwnerNotes() {
    if (!booking) return;
    setSavingNotes(true);
    try {
      await updateBooking(booking.id, { ownerNotes: ownerNotesDraft });
      setBooking((prev) => (prev ? { ...prev, ownerNotes: ownerNotesDraft } : prev));
      showToast("Notes saved.");
    } catch (e: any) {
      showToast(e?.message ?? "Failed to save notes.", "error");
    } finally {
      setSavingNotes(false);
    }
  }

  async function updateStatus(newStatus: BookingStatus) {
    if (!booking) return;
    try {
      await updateBooking(booking.id, { status: newStatus });
      setBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
      showToast("Status updated.");
    } catch (e: any) {
      showToast(e?.message ?? "Failed to update status.", "error");
    }
  }

  async function handleCancel() {
    if (!booking) return;
    await updateStatus("cancelled");
    setShowCancelModal(false);
  }

  if (loading) {
    return <p className="text-driftwood">Loading booking…</p>;
  }

  if (!booking) {
    return null;
  }

  const checkIn = toDate(booking.checkIn);
  const checkOut = toDate(booking.checkOut);
  const propertyName = booking.propertyId
    ? getPropertyDisplayName(booking.propertyId, null)
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/bookings"
            className="text-sm text-sea-glass hover:underline mb-1 inline-block"
          >
            ← Back to Bookings
          </Link>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">
            Booking detail
          </h1>
          <p className="text-sm text-driftwood">
            Reference: <span className="font-mono">{booking.id}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <button
              type="button"
              onClick={() => updateStatus("completed")}
              className="px-3 py-1.5 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90"
            >
              Mark as completed
            </button>
          )}
          {booking.status !== "cancelled" && !booking.isManualBlock && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-1.5 rounded-lg border border-coral text-coral text-sm hover:bg-coral/10"
            >
              Cancel booking
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-warm p-5 space-y-3">
          <h2 className="font-display text-lg text-deep-ocean mb-1">Guest</h2>
          <p className="text-deep-ocean font-medium">
            {booking.guestName || "Unnamed guest"}
          </p>
          <p className="text-sm text-driftwood">{booking.guestEmail || "—"}</p>
          <p className="text-sm text-driftwood">{booking.guestPhone || "—"}</p>
          {booking.specialRequests && (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-driftwood mb-1">
                Special requests
              </p>
              <p className="text-sm text-driftwood whitespace-pre-line">
                {booking.specialRequests}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-warm p-5 space-y-3">
          <h2 className="font-display text-lg text-deep-ocean mb-1">Stay</h2>
          <p className="text-sm text-driftwood">
            {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}
          </p>
          <p className="text-sm text-driftwood">
            Property: {propertyName}
          </p>
          <p className="text-sm text-driftwood">Guests: {booking.numGuests}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-driftwood">Status:</span>
            <select
              value={booking.status}
              onChange={(e) =>
                updateStatus(e.target.value as BookingStatus)
              }
              className="px-2 py-1 border border-driftwood/30 rounded-lg bg-sand/40 text-sm capitalize"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-warm p-5 space-y-2 max-w-md">
        <h2 className="font-display text-lg text-deep-ocean mb-1">Pricing breakdown</h2>
        <div className="flex justify-between text-sm text-driftwood">
          <span>Nightly rate × {booking.numNights}</span>
          <span>${(booking.nightlyRate * booking.numNights).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-driftwood">
          <span>Cleaning fee</span>
          <span>${booking.cleaningFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-driftwood">
          <span>Taxes</span>
          <span>${booking.taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-deep-ocean font-semibold border-t border-driftwood/20 pt-2 mt-2">
          <span>Total</span>
          <span>${booking.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-warm p-5 space-y-3">
        <h2 className="font-display text-lg text-deep-ocean mb-1">Owner notes</h2>
        <textarea
          value={ownerNotesDraft}
          onChange={(e) => setOwnerNotesDraft(e.target.value)}
          className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
          placeholder="Private notes about this booking…"
        />
        <button
          type="button"
          onClick={saveOwnerNotes}
          disabled={savingNotes}
          className="px-3 py-1.5 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 disabled:opacity-70"
        >
          {savingNotes ? "Saving…" : "Save notes"}
        </button>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-warm-lg p-6 max-w-sm w-full">
            <h3 className="font-display text-lg text-deep-ocean mb-2">
              Cancel this booking?
            </h3>
            <p className="text-sm text-driftwood mb-4">
              This will mark the booking as cancelled. The guest will not be charged again if payment was already made.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-3 py-2 rounded-lg border border-driftwood/40 text-driftwood text-sm hover:bg-sand"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 rounded-lg bg-coral text-white text-sm font-semibold hover:bg-coral/90"
              >
                Cancel booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
