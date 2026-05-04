import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Sign in to your AutoParts.Hub account.
        </p>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-foreground-muted">
          New to AutoParts.Hub?{" "}
          <Link
            href="/register"
            className="font-medium text-accent-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
