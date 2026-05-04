import Link from "next/link";
import {
  Cog,
  CircleDot,
  Zap,
  CarFront,
  Disc3,
  Wrench,
  Battery,
  Lightbulb,
} from "lucide-react";

const CATEGORIES = [
  { slug: "engine-parts", name: "Engine Parts", icon: Cog, count: "120k+" },
  { slug: "brakes", name: "Brake Parts", icon: Disc3, count: "45k+" },
  { slug: "suspension", name: "Suspension", icon: CircleDot, count: "30k+" },
  { slug: "electrical", name: "Electrical", icon: Zap, count: "60k+" },
  { slug: "body-parts", name: "Body Parts", icon: CarFront, count: "80k+" },
  {
    slug: "tires-wheels",
    name: "Tires & Wheels",
    icon: CircleDot,
    count: "25k+",
  },
  { slug: "batteries", name: "Batteries", icon: Battery, count: "12k+" },
  { slug: "lighting", name: "Lighting", icon: Lightbulb, count: "18k+" },
];

export function Categories() {
  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent-600">
            Shop by category
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Find parts for every job
          </h2>
        </div>
        <Link
          href="/categories"
          className="hidden text-sm font-medium text-brand-600 hover:text-accent-600 sm:inline-flex"
        >
          View all →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-accent-50 group-hover:text-accent-600">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {c.count} products
                </p>
              </div>
              <Wrench className="absolute right-4 top-4 h-3.5 w-3.5 text-brand-200 opacity-60" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
