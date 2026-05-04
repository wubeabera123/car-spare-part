import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 p-10 text-white sm:p-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
              <Mail className="h-3.5 w-3.5" /> Newsletter
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Save 10% on your first order
            </h2>
            <p className="mt-3 max-w-md text-brand-200">
              Get fitment guides, deal drops and new product alerts. No spam —
              unsubscribe anytime.
            </p>
          </div>
          <form
            action="/api/newsletter"
            method="post"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-lg bg-white/10 px-4 text-sm text-white placeholder:text-brand-300 focus-ring backdrop-blur"
            />
            <button
              type="submit"
              className="h-12 rounded-lg bg-accent-600 px-6 text-sm font-semibold hover:bg-accent-700 transition-colors focus-ring"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
