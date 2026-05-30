"use client";

import { useActionState } from "react";
import {
  createProductAction,
  type ProductFormState,
} from "@/actions/seller-products";

type Option = { id: string; name: string };

export default function NewProductForm({
  categories,
  brands,
}: {
  categories: Option[];
  brands: Option[];
}) {
  const [state, action, pending] = useActionState<
    ProductFormState | undefined,
    FormData
  >(createProductAction, undefined);
  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form
      action={action}
      className="mt-6 max-w-3xl space-y-5 rounded-2xl border border-border bg-surface p-6"
    >
      {state?.message && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Product name"
          error={err("name")}
          className="sm:col-span-2"
        />
        <Field name="sku" label="SKU" error={err("sku")} />
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <select id="categoryId" name="categoryId" className={selectCx}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {err("categoryId") && <Hint>{err("categoryId")}</Hint>}
        </div>
        <div>
          <Label htmlFor="brandId">Brand (optional)</Label>
          <select id="brandId" name="brandId" className={selectCx}>
            <option value="">None</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="partType">Part type</Label>
          <select
            id="partType"
            name="partType"
            className={selectCx}
            defaultValue="OEM"
          >
            <option value="OEM">OEM</option>
            <option value="AFTERMARKET">Aftermarket</option>
            <option value="PERFORMANCE">Performance</option>
            <option value="USED">Used</option>
          </select>
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <select
            id="condition"
            name="condition"
            className={selectCx}
            defaultValue="NEW"
          >
            <option value="NEW">New</option>
            <option value="REFURBISHED">Refurbished</option>
            <option value="USED">Used</option>
          </select>
        </div>
        <Field
          name="price"
          label="Price (ETB)"
          type="number"
          step="0.01"
          error={err("price")}
        />
        <Field
          name="compareAtPrice"
          label="Compare-at price (optional)"
          type="number"
          step="0.01"
        />
        <Field
          name="stock"
          label="Stock"
          type="number"
          defaultValue="1"
          error={err("stock")}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus-ring"
        />
        {err("description") && <Hint>{err("description")}</Hint>}
      </div>

      <div>
        <Label htmlFor="images">Image URLs (one per line)</Label>
        <textarea
          id="images"
          name="images"
          rows={3}
          placeholder="https://..."
          className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus-ring"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-accent-600 px-6 font-medium text-white hover:bg-accent-700 disabled:opacity-60 transition-colors"
      >
        {pending ? "Saving…" : "Create product"}
      </button>
    </form>
  );
}

const selectCx =
  "mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring";

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label className="text-sm font-medium" htmlFor={htmlFor}>
      {children}
    </label>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-accent-600">{children}</p>;
}
function Field({
  name,
  label,
  type = "text",
  step,
  defaultValue,
  className = "",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  defaultValue?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring"
      />
      {error && <Hint>{error}</Hint>}
    </div>
  );
}
