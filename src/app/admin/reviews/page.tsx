"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/types";
import { getAllReviews, updateReview } from "@/lib/firestore";

type Filter = "pending" | "approved" | "all";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const all = await getAllReviews();
      setReviews(all);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "all", label: "All" },
  ];

  async function handleToggleApprove(review: Review) {
    setSavingId(review.id);
    try {
      const nextApproved = !review.approved;
      await updateReview(review.id, { approved: nextApproved } as any);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, approved: nextApproved } : r))
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveResponse(review: Review, response: string) {
    setSavingId(review.id);
    try {
      await updateReview(review.id, { ownerResponse: response } as any);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, ownerResponse: response } : r))
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-deep-ocean mb-1">Reviews</h1>
          <p className="text-sm text-driftwood">
            Approve guest reviews and add personal responses that will appear on the site.
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
        <p className="text-driftwood">Loading reviews…</p>
      ) : filtered.length === 0 ? (
        <p className="text-driftwood">No reviews match this filter yet.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => {
            const created = review.createdAt.toDate?.() ?? review.createdAt;
            const [responseDraft, setResponseDraft] = useState(review.ownerResponse ?? "");
            const isSaving = savingId === review.id;

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-warm p-4 space-y-3 border border-driftwood/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-coral text-sm">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-driftwood">
                        {review.rating}/5 from {review.guestName}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-driftwood italic">"{review.text}"</p>
                    <p className="mt-2 text-xs text-driftwood/80">
                      Submitted {created.toLocaleDateString()} • Source: {review.source}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                        review.approved
                          ? "bg-sea-glass/15 text-sea-glass"
                          : "bg-shell text-driftwood"
                      }`}
                    >
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleApprove(review)}
                      className="block w-full mt-1 px-2 py-1 rounded-lg text-xs border border-driftwood/40 text-driftwood hover:bg-sand transition-warm"
                    >
                      {review.approved ? "Hide from site" : "Approve for site"}
                    </button>
                  </div>
                </div>

                <div className="border-t border-driftwood/10 pt-3">
                  <label className="block text-xs font-semibold text-driftwood mb-1">
                    Owner response (optional)
                  </label>
                  <textarea
                    value={responseDraft}
                    onChange={(e) => setResponseDraft(e.target.value)}
                    className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[80px]"
                    placeholder="Thank you for staying with us! We loved hosting you…"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveResponse(review, responseDraft)}
                      disabled={isSaving}
                      className="px-3 py-1.5 rounded-lg bg-sea-glass text-white text-xs font-semibold hover:bg-sea-glass/90 disabled:opacity-60"
                    >
                      {isSaving ? "Saving…" : "Save response"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

