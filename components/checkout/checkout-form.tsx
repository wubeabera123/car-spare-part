"use client";

import { useActionState } from "react";
import { placeOrder, type CheckoutState } from "@/actions/checkout";

export default function CheckoutForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState<
    CheckoutState | undefined,
    FormData
  >(placeOrder, undefined);

  const err = (k: string) => state?.errors?.[k]?.[0];

  return (
    <form
      action={action}
      className="rounded-2xl border border-border bg-surface p-6 space-y-5"
    >
      <h2 className="text-lg font-semibold">Shipping address</h2>

      {state?.message && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="fullName"
          label="Full name"
          defaultValue={defaultName}
          error={err("fullName")}
        />
        <Field name="phone" label="Phone" type="tel" error={err("phone")} />
        <Field
          name="line1"
          label="Address line 1"
          className="sm:col-span-2"
          error={err("line1")}
        />
        <Field
          name="line2"
          label="Address line 2 (optional)"
          className="sm:col-span-2"
        />
        <Field name="city" label="City" error={err("city")} />
        <Field name="state" label="State / Province" error={err("state")} />
        <Field
          name="postalCode"
          label="Postal code"
          error={err("postalCode")}
        />
        <Field
          name="country"
          label="Country"
          defaultValue="United States"
          error={err("country")}
        />
      </div>

      <div className="rounded-xl bg-surface-muted p-4 text-sm">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-600 text-white text-xs font-bold">
            ₿
          </span>
          Pay with Chapa
        </div>
        <p className="mt-1 text-foreground-muted">
          You will be redirected to Chapa to complete your payment (Telebirr,
          CBE, credit/debit card and more).
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-accent-600 font-medium text-white hover:bg-accent-700 disabled:opacity-60 transition-colors"
      >
        {pending ? "Redirecting to Chapa…" : "Pay with Chapa"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  className = "",
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  className?: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring"
      />
      {error && <p className="mt-1 text-xs text-accent-600">{error}</p>}
    </div>
  );
}
