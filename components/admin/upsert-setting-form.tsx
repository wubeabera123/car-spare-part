"use client";

import { useActionState } from "react";
import { upsertSettingAction } from "@/actions/admin";

export function UpsertSettingForm() {
  const [state, action, pending] = useActionState<
    { message?: string } | undefined,
    FormData
  >(upsertSettingAction, undefined);

  return (
    <form
      action={action}
      className="rounded-xl border border-border bg-surface p-5 space-y-4"
    >
      <h3 className="font-semibold text-sm">Add / update setting</h3>

      {state?.message === "" && (
        <p className="text-sm text-emerald-600">Setting saved.</p>
      )}
      {state?.message && state.message !== "" && (
        <p className="text-sm text-accent-600">{state.message}</p>
      )}

      <div>
        <label className="text-xs font-medium" htmlFor="setting-key">
          Key
        </label>
        <input
          id="setting-key"
          name="key"
          placeholder="shipping_threshold"
          className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
        />
      </div>
      <div>
        <label className="text-xs font-medium" htmlFor="setting-value">
          Value (JSON or plain text)
        </label>
        <input
          id="setting-value"
          name="value"
          placeholder='99 or "free"'
          className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-lg bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save setting"}
      </button>
    </form>
  );
}
