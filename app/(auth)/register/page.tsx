import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <h1 className="text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Join thousands of drivers and shops on AutoParts.Hub.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
