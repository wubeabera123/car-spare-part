"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthFormState } from "@/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      {state?.message && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          {state.message}
        </div>
      )}
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="text"
          autoComplete="email"
          className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring"
        />
        {state?.errors?.email && (
          <p className="mt-1 text-xs text-accent-600">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm focus-ring"
        />
        {state?.errors?.password && (
          <p className="mt-1 text-xs text-accent-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-accent-600 font-medium text-white hover:bg-accent-700 transition-colors focus-ring disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-foreground-muted">
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
