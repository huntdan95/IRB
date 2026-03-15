"use client";

import { useEffect, useState, Fragment } from "react";
import { Timestamp } from "firebase/firestore";
import type { Review } from "@/types";
import type { Property } from "@/types";
import { getAllReviews, updateReview, createReview, getAllProperties } from "@/lib/firestore";
import { MOCK_REVIEWS, getPropertyDisplayName } from "@/lib/mockData";
import { useToast } from "@/context/ToastContext";

type Filter = "pending" | "approved" | "all";

function toDate(v: { toDate?: () => Date } | Date): Date {
  return v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : (v as Date);
}

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addGuestName, setAddGuestName] = useState("");
  const [addPropertyId, setAddPropertyId] = useState("");
  const [addRating, setAddRating] = useState(5);
  const [addText, setAddText] = useState("");
  const [addDate, setAddDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [savingAdd, setSavingAdd] = useState(false);

  useEffect(() => {
    async function load() {
      const [allReviews, props] = await Promise.all([
        getAllReviews(),
        getAllProperties(),
      ]);
      setProperties(props);
      if (allReviews.length > 0) {
        setReviews(allReviews);
        setUseMock(false);
      } else {
        setReviews(MOCK_REVIEWS);
        setUseMock(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const propertyName = (id: string) =>
    getPropertyDisplayName(id, properties.find((p) => p.id === id)?.name);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
  ];

  async function handleToggleApprove(review: Review) {
    setSavingId(review.id);
    try {
      const nextApproved = !review.approved;
      await updateReview(review.id, { approved: nextApproved });
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, approved: nextApproved } : r))
      );
      showToast(nextApproved ? "Review approved." : "Review hidden.");
    } catch (e: any) {
      showToast(e?.message ?? "Failed to update.", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveResponse(review: Review, response: string) {
    setSavingId(review.id);
    try {
      await updateReview(review.id, { ownerResponse: response });
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, ownerResponse: response } : r))
      );
      showToast("Response saved.");
    } catch (e: any) {
      showToast(e?.message ?? "Failed to save.", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!addPropertyId || !addText.trim()) {
      showToast("Property and review text are required.", "error");
      return;
    }
    setSavingAdd(true);
    try {
      const date = new Date(addDate);
      await createReview({
        propertyId: addPropertyId,
        guestName: addGuestName.trim() || "Guest",
        rating: addRating,
        text: addText.trim(),
        approved: false,
        source: "manual",
        createdAt: Timestamp.fromDate(date),
      });
      const all = await getAllReviews();
      setReviews(all.length > 0 ? all : MOCK_REVIEWS);
      setUseMock(all.length === 0);
      setAddModalOpen(false);
      setAddGuestName("");
      setAddPropertyId(properties[0]?.id ?? "");
      setAddText("");
      setAddRating(5);
      setAddDate(new Date().toISOString().slice(0, 10));
      showToast("Review added.");
    } catch (err: any) {
      showToast(err?.message ?? "Failed to add review.", "error");
    } finally {
      setSavingAdd(false);
    }
  }

  const displayProperties = properties.length > 0
    ? properties
    : [{ id: "mock-sunrise", name: "Sunrise Suite" }, { id: "mock-sunset", name: "Sunset Suite" }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">Reviews</h1>
          <p className="text-sm text-driftwood">
            Approve reviews, add responses, or import from Airbnb/VRBO. {useMock && "(Sample data)"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddPropertyId(displayProperties[0]?.id ?? "");
            setAddModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 transition-warm"
        >
          Add Review
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`px-3 py-1.5 rounded-full text-sm border transition-warm ${
              filter === f.id
                ? "bg-sea-glass text-white border-sea-glass"
                : "bg-white text-driftwood border-driftwood/30 hover:bg-sand"
            }`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-driftwood">Loading reviews…</p>
      ) : (
        <div className="bg-white rounded-xl shadow-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-shell/60 text-left text-xs uppercase tracking-wide text-driftwood">
                <tr>
                  <th className="px-4 py-2">Guest Name</th>
                  <th className="px-4 py-2">Property</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Review</th>
                  <th className="px-4 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-driftwood/10">
                {filtered.map((review) => {
                  const created = toDate(review.createdAt);
                  const isExpanded = expandedId === review.id;
                  const responseDraft = responseDrafts[review.id] ?? review.ownerResponse ?? "";
                  const isSaving = savingId === review.id;
                  return (
                    <Fragment key={review.id}>
                      <tr
                        className="hover:bg-sand/40 cursor-pointer"
                        onClick={() => setExpandedId((id) => (id === review.id ? null : review.id))}
                      >
                        <td className="px-4 py-2 font-medium text-deep-ocean">
                          {review.guestName}
                        </td>
                        <td className="px-4 py-2 text-driftwood">
                          {propertyName(review.propertyId)}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-amber-500">
                            {"★".repeat(review.rating)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-driftwood">
                          {created.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                              review.approved
                                ? "bg-sea-glass/15 text-sea-glass"
                                : "bg-shell text-driftwood"
                            }`}
                          >
                            {review.approved ? "Approved" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-driftwood max-w-[200px] truncate">
                          &ldquo;{review.text.slice(0, 60)}
                          {review.text.length > 60 ? "…" : ""}&rdquo;
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-driftwood">
                            {isExpanded ? "▼" : "▶"}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${review.id}-exp`} className="bg-sand/30">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="space-y-3 max-w-2xl">
                              <p className="text-sm text-deep-ocean italic">
                                &ldquo;{review.text}&rdquo;
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleApprove(review);
                                  }}
                                  disabled={isSaving}
                                  className="px-2 py-1 rounded-lg text-xs border border-driftwood/40 hover:bg-sand"
                                >
                                  {review.approved ? "Hide from site" : "Approve for site"}
                                </button>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-driftwood mb-1">
                                  Owner response
                                </label>
                                <textarea
                                  value={responseDraft}
                                  onChange={(e) =>
                                    setResponseDrafts((prev) => ({
                                      ...prev,
                                      [review.id]: e.target.value,
                                    }))
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-white text-sm min-h-[80px]"
                                  placeholder="Thank you for staying with us…"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveResponse(review, responseDraft);
                                  }}
                                  disabled={isSaving}
                                  className="mt-2 px-3 py-1.5 rounded-lg bg-sea-glass text-white text-xs font-semibold hover:bg-sea-glass/90 disabled:opacity-60"
                                >
                                  {isSaving ? "Saving…" : "Save response"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-driftwood">No reviews match.</p>
          )}
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-warm-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-driftwood/20 px-4 py-3 flex items-center justify-between">
              <h2 className="font-display text-xl text-deep-ocean">Add review</h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-2 rounded-lg text-driftwood hover:bg-sand"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleAddReview} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Guest name</label>
                <input
                  type="text"
                  value={addGuestName}
                  onChange={(e) => setAddGuestName(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Property</label>
                <select
                  value={addPropertyId}
                  onChange={(e) => setAddPropertyId(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                  required
                >
                  {displayProperties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Rating (1–5)</label>
                <select
                  value={addRating}
                  onChange={(e) => setAddRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} stars</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Review text</label>
                <textarea
                  value={addText}
                  onChange={(e) => setAddText(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-driftwood mb-1">Date</label>
                <input
                  type="date"
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                  className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-driftwood/40 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdd}
                  className="px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold hover:bg-sea-glass/90 disabled:opacity-70"
                >
                  {savingAdd ? "Saving…" : "Add review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
