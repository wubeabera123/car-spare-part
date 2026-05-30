"use client";

import { useActionState } from "react";
import { createReviewAction, ReviewFormState } from "@/actions/reviews";
import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewFormProps {
  productId: string;
  productSlug: string;
}

export function ReviewForm({ productId, productSlug }: ReviewFormProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  const boundAction = createReviewAction.bind(null, productId, productSlug);
  const [state, action, pending] = useActionState<
    ReviewFormState | undefined,
    FormData
  >(boundAction, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-green-700">
        Thank you for your review!
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <h3 className="font-semibold">Write a review</h3>

      {state?.message && (
        <p className="mt-2 text-sm text-red-600">{state.message}</p>
      )}

      {/* Star picker */}
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHoveredStar(n)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setSelectedStar(n)}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                n <= (hoveredStar || selectedStar)
                  ? "fill-amber-400 text-amber-400"
                  : "text-border"
              }`}
            />
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={selectedStar} />
      {state?.errors?.rating && (
        <p className="text-xs text-red-600">{state.errors.rating[0]}</p>
      )}

      <div className="mt-3 space-y-3">
        <input
          name="title"
          placeholder="Summary (optional)"
          className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        />
        <textarea
          name="body"
          rows={4}
          required
          placeholder="Tell us what you think…"
          className="w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        />
        {state?.errors?.body && (
          <p className="text-xs text-red-600">{state.errors.body[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || selectedStar === 0}
        className="mt-4 h-10 rounded-lg bg-accent-600 px-5 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
