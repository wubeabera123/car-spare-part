"use client";

import { useActionState } from "react";
import {
  createPromotionAction,
  type PromotionFormState,
} from "@/actions/admin";

export function CreatePromotionForm() {
  const [state, action, pending] = useActionState<
    PromotionFormState | undefined,
    FormData
  >(createPromotionAction, undefined);

  if (state?.message === "") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Promotion created.{" "}
        <button onClick={() => window.location.reload()} className="underline">
          Reload
        </button>
      </div>
    );
  }

  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form
      action={action}
      className="rounded-xl border border-border bg-surface p-5 space-y-4"
    >
      <h3 className="font-semibold text-sm">Add promotion</h3>

      {state?.message && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium" htmlFor="promo-code">
            Code
          </label>
          <input
            id="promo-code"
            name="code"
            placeholder="SAVE20"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm uppercase focus-ring"
          />
          {err("code") && (
            <p className="mt-1 text-xs text-accent-600">{err("code")}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="promo-percent">
            % Off (or leave blank)
          </label>
          <input
            id="promo-percent"
            name="percentOff"
            type="number"
            min="1"
            max="100"
            placeholder="20"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="promo-amount">
            Amount Off (or leave blank)
          </label>
          <input
            id="promo-amount"
            name="amountOff"
            type="number"
            step="0.01"
            placeholder="5.00"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="promo-ends">
            Expires At
          </label>
          <input
            id="promo-ends"
            name="endsAt"
            type="date"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium" htmlFor="promo-desc">
            Description
          </label>
          <input
            id="promo-desc"
            name="description"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-lg bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create promotion"}
      </button>
    </form>
  );
}
