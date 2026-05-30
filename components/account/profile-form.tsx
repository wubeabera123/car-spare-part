"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateProfileAction, type ProfileState } from "@/actions/profile";

interface ProfileFormProps {
  initialName: string;
  initialPhone: string;
  initialEmail: string;
}

const initialState: ProfileState = {};

export function ProfileForm({
  initialName,
  initialPhone,
  initialEmail,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={initialName}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus-ring"
            placeholder="Your full name"
          />
          {state.errors?.name && (
            <p className="text-xs text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            defaultValue={initialPhone}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus-ring"
            placeholder="+251 91 234 5678"
          />
          {state.errors?.phone && (
            <p className="text-xs text-red-600">{state.errors.phone[0]}</p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label htmlFor="email-display" className="block text-sm font-medium">
            Email address
          </label>
          <input
            id="email-display"
            type="text"
            value={initialEmail}
            readOnly
            className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm text-foreground-muted cursor-not-allowed outline-none"
          />
          <p className="text-xs text-foreground-muted">
            Email cannot be changed here.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-60 transition-colors"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </button>

        {state.message && (
          <p className="text-sm font-medium text-green-600">{state.message}</p>
        )}
      </div>
    </form>
  );
}
