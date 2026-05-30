"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { resetPasswordAction } from "@/actions/auth";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    undefined,
  );

  if (!token) {
    return (
      <div className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-red-600">
        Invalid reset link. Please{" "}
        <Link href="/forgot-password" className="underline">
          request a new one
        </Link>
        .
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state?.message && (
        <div className="rounded-lg border border-border bg-surface-muted p-3 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
        />
        {state?.errors?.password && (
          <p className="mt-1 text-xs text-red-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent-600 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Choose a new password for your account.
        </p>
        <div className="mt-6">
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm text-foreground-muted">
          <Link href="/login" className="text-accent-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
