import Link from "next/link";
import { ArrowRight, Tag, Timer } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export function FeaturedDeals() {
  return (
    <section className="container-page py-16">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Big banner */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-900 p-10 text-white lg:col-span-2 min-h-[260px]">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-600/30 blur-3xl"
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Tag className="h-3.5 w-3.5" /> Limited time
          </span>
          <h3 className="mt-5 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
            Up to 40% off premium brake systems
          </h3>
          <p className="mt-3 max-w-md text-brand-200">
            Brembo, Akebono &amp; EBC pads, rotors and kits — pro-grade stopping
            power, shipped fast.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link href="/categories/brakes" className={buttonStyles()}>
              Shop deals <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm text-brand-200">
              <Timer className="h-4 w-4" /> Ends in 3 days
            </span>
          </div>
        </div>

        {/* Side card */}
        <div className="relative overflow-hidden rounded-2xl bg-accent-600 p-10 text-white min-h-[260px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            New arrivals
          </span>
          <h3 className="mt-5 text-2xl font-bold tracking-tight">
            Performance air intakes
          </h3>
          <p className="mt-2 text-white/80">
            More airflow, more power. From $99.
          </p>
          <Link
            href="/categories/engine-parts?type=air-intake"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Shop now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
