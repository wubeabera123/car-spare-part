"use client";

import { useActionState, useTransition } from "react";
import {
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  AddressFormState,
} from "@/actions/addresses";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star } from "lucide-react";
import { Address } from "@prisma/client";

function AddressForm({
  address,
  onSuccess,
}: {
  address?: Address;
  onSuccess: () => void;
}) {
  const action = address
    ? updateAddressAction.bind(null, address.id)
    : createAddressAction;

  const [state, formAction, pending] = useActionState<
    AddressFormState,
    FormData
  >(action, undefined);

  if (state?.success) {
    onSuccess();
    return null;
  }

  const field = (name: keyof Address, label: string, required = false) => (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        name={name as string}
        defaultValue={(address?.[name] as string) ?? ""}
        required={required}
        className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
      />
      {state?.errors?.[name as string] && (
        <p className="text-xs text-red-600">
          {state.errors[name as string]![0]}
        </p>
      )}
    </div>
  );

  return (
    <form
      action={formAction}
      className="mt-4 space-y-3 rounded-xl border border-border bg-surface p-5"
    >
      {state?.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      {field("label", "Label (e.g. Home)")}
      {field("line1", "Address line 1", true)}
      {field("line2", "Address line 2")}
      <div className="grid gap-3 sm:grid-cols-2">
        {field("city", "City", true)}
        {field("state", "State / Region")}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {field("postalCode", "Postal code")}
        {field("country", "Country", true)}
      </div>
      {field("phone", "Phone")}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isDefault"
          value="true"
          defaultChecked={address?.isDefault}
        />
        Set as default address
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent-600 px-5 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : address ? "Update address" : "Add address"}
      </button>
    </form>
  );
}

export function AddressActions({ address }: { address: Address }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this address?")) return;
    startTransition(async () => {
      const res = await deleteAddressAction(address.id);
      if (res.error) toast.error(res.error);
      else router.refresh();
    });
  }

  function handleDefault() {
    startTransition(async () => {
      const res = await setDefaultAddressAction(address.id);
      if (res.error) toast.error(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="mt-2 flex gap-3">
        {!address.isDefault && (
          <button
            onClick={handleDefault}
            disabled={pending}
            className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground"
          >
            <Star className="h-3.5 w-3.5" /> Set default
          </button>
        )}
        <button
          onClick={() => setEditing((v) => !v)}
          className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
      {editing && (
        <AddressForm
          address={address}
          onSuccess={() => {
            setEditing(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

export function NewAddressForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center rounded-lg bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700"
      >
        + Add address
      </button>
      {open && (
        <AddressForm
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
