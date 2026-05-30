"use client";

import { useActionState } from "react";
import { createCategoryAction, type CategoryFormState } from "@/actions/admin";

export function CreateCategoryForm() {
  const [state, action, pending] = useActionState<
    CategoryFormState | undefined,
    FormData
  >(createCategoryAction, undefined);

  if (state?.message === "") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Category created successfully.{" "}
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
      <h3 className="font-semibold text-sm">Add new category</h3>

      {state?.message && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
          {err("name") && (
            <p className="mt-1 text-xs text-accent-600">{err("name")}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
          {err("slug") && (
            <p className="mt-1 text-xs text-accent-600">{err("slug")}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            name="description"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="text-xs font-medium" htmlFor="image">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
          />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            className="h-4 w-4 rounded border-border"
          />
          <label className="text-xs font-medium" htmlFor="isFeatured">
            Featured on homepage
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-lg bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Create category"}
      </button>
    </form>
  );
}
