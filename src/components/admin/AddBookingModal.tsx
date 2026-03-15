"use client";

import { useState, FormEvent } from "react";
import type { Property } from "@/types";
import { Timestamp } from "firebase/firestore";
import { createBooking, createManualBlock } from "@/lib/firestore";
import { useToast } from "@/context/ToastContext";

interface AddBookingModalProps {
  properties: Property[];
  onClose: () => void;
  onSaved: () => void;
}

export default function AddBookingModal({
  properties,
  onClose,
  onSaved,
}: AddBookingModalProps) {
  const { showToast } = useToast();
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [numGuests, setNumGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [isPersonalBlock, setIsPersonalBlock] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!propertyId || !checkIn || !checkOut) {
      showToast("Please select property and dates.", "error");
      return;
    }
    const from = new Date(checkIn);
    const to = new Date(checkOut);
    if (from >= to) {
      showToast("Check-out must be after check-in.", "error");
      return;
    }
    setSaving(true);
    try {
      if (isPersonalBlock) {
        await createManualBlock({
          propertyId,
          checkIn: from,
          checkOut: to,
          notes: notes || undefined,
        });
        showToast("Dates blocked successfully.");
      } else {
        const numNights = Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
        const prop = properties.find((p) => p.id === propertyId);
        const nightlyRate = prop?.pricing?.baseRate ?? 0;
        const cleaningFee = prop?.pricing?.cleaningFee ?? 0;
        const subtotal = nightlyRate * numNights + cleaningFee;
        const taxRate = (prop?.pricing?.taxRate ?? 0) / 100;
        const taxes = Math.round(subtotal * taxRate * 100) / 100;
        await createBooking({
          propertyId,
          guestName: guestName || "Guest",
          guestEmail: guestEmail || "",
          guestPhone: guestPhone || "",
          checkIn: Timestamp.fromDate(from),
          checkOut: Timestamp.fromDate(to),
          numGuests,
          nightlyRate,
          numNights,
          cleaningFee,
          taxes,
          totalPrice: subtotal + taxes,
          status: "confirmed",
          specialRequests: notes || undefined,
          ownerNotes: "",
          isManualBlock: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        showToast("Booking added successfully.");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-warm-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-driftwood/20 px-4 py-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-deep-ocean">
            {isPersonalBlock ? "Block dates" : "Add booking"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-driftwood hover:bg-sand"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPersonalBlock}
              onChange={(e) => setIsPersonalBlock(e.target.checked)}
              className="rounded border-driftwood/40"
            />
            <span className="text-sm text-deep-ocean">This is a personal block (not a guest booking)</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">Property</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
              required
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-driftwood mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-driftwood mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                required
              />
            </div>
          </div>

          {!isPersonalBlock && (
            <>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Guest name (optional)</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  placeholder="Leave blank for personal block"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Guest email (optional)</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Guest phone (optional)</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Number of guests</label>
                <input
                  type="number"
                  min={1}
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[80px]"
              placeholder={isPersonalBlock ? "e.g., Owner stay, maintenance" : "Special requests or notes"}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-driftwood/40 text-driftwood text-sm hover:bg-sand"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
