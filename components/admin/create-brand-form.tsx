"use client";

import { useActionState } from "react";
import { createBrandAction, type BrandFormState } from "@/actions/admin";

export function CreateBrandForm() {
  const [state, action, pending] = useActionState<
    BrandFormState | undefined,
    FormData
  >(createBrandAction, undefined);

  if (state?.message === "") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Brand created.{" "}
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
      <h3 className="font-semibold text-sm">Add new brand</h3>

      {state?.message && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium" htmlFor="brand-name">
            Name
          </label>
          <input
            id="brand-name"
            name="name"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
          {err("name") && (
            <p className="mt-1 text-xs text-accent-600">{err("name")}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="brand-slug">
            Slug
          </label>
          <input
            id="brand-slug"
            name="slug"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
          {err("slug") && (
            <p className="mt-1 text-xs text-accent-600">{err("slug")}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="brand-logo">
            Logo URL
          </label>
          <input
            id="brand-logo"
            name="logo"
            type="url"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="brand-country">
            Country
          </label>
          <input
            id="brand-country"
            name="country"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-lg bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create brand"}
      </button>
    </form>
  );
}
