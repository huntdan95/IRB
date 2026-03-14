import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-warm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex text-coral text-lg">
          {Array.from({ length: review.rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <span className="text-sm text-driftwood">
          {review.rating.toFixed(1)} / 5.0
        </span>
      </div>
      <p className="text-driftwood italic">&ldquo;{review.text}&rdquo;</p>
      <div className="mt-2 text-sm text-deep-ocean font-semibold">— {review.guestName}</div>
      {review.ownerResponse && (
        <div className="mt-3 border-t border-driftwood/20 pt-3 text-sm text-driftwood">
          <span className="font-semibold text-deep-ocean">Owner response:</span> {review.ownerResponse}
        </div>
      )}
    </div>
  );
}

