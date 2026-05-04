import { Quote } from "lucide-react";
import { Rating } from "@/components/ui/rating";

const TESTIMONIALS = [
  {
    name: "Marcus L.",
    role: "F-150 owner · Texas",
    rating: 5,
    quote:
      "Found exact OEM brake calipers for my 2019 F-150. Arrived in 2 days and fitment was perfect. This is now my go-to.",
  },
  {
    name: "Priya S.",
    role: "Indie shop owner · Oregon",
    rating: 5,
    quote:
      "We order daily for our shop. Pricing beats my distributor and the catalog accuracy is unreal. Huge time saver.",
  },
  {
    name: "Jordan K.",
    role: "BMW enthusiast · Florida",
    rating: 4,
    quote:
      "Great prices on aftermarket suspension. Loved the compatibility checker — no more guessing or wrong parts.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="container-page">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-accent-600">
            Reviews
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by mechanics &amp; enthusiasts
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="relative rounded-2xl border border-border bg-surface p-7 shadow-soft"
            >
              <Quote className="absolute right-6 top-6 h-7 w-7 text-brand-100" />
              <Rating value={t.rating} />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-foreground-muted">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
