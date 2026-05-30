"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    undefined,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Enter your email and we&apos;ll send a reset link.
        </p>

        {state?.message && (
          <div className="mt-4 rounded-lg border border-border bg-surface-muted p-3 text-sm text-foreground-muted">
            {state.message}
          </div>
        )}

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent-600 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Remember it?{" "}
          <Link href="/login" className="text-accent-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
