import Link from "next/link";
import { ShieldCheck, Truck, Wrench } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { HeroVehicleSearch } from "@/components/home/hero-vehicle-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      {/* Decorative grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-accent-600/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 h-105 w-105 rounded-full bg-brand-500/30 blur-3xl"
      />

      <div className="container-page relative grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            Trusted automotive marketplace
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            The right part for{" "}
            <span className="text-accent-500">every ride.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-200">
            Shop millions of OEM and premium aftermarket spare parts from
            verified sellers. Fast delivery, fitment guaranteed.
          </p>

          {/* Vehicle search — DB-backed, client-side */}
          <HeroVehicleSearch />

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-brand-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-500" />
              <span>Verified sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-accent-500" />
              <span>Free shipping over $99</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-accent-500" />
              <span>Fitment guaranteed</span>
            </div>
          </div>
        </div>

        {/* Stat card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/0 p-8 shadow-2xl backdrop-blur">
            <div className="grid grid-cols-2 gap-6">
              {[
                { v: "2M+", l: "Parts in catalog" },
                { v: "50K+", l: "Verified sellers" },
                { v: "98%", l: "Fitment accuracy" },
                { v: "4.9★", l: "Customer rating" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-bold tracking-tight">{s.v}</p>
                  <p className="mt-1 text-sm text-brand-200">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-brand-800/60 p-5">
              <div>
                <p className="text-sm text-brand-200">Sell on AutoParts.Hub</p>
                <p className="text-lg font-semibold">Join 50K+ sellers</p>
              </div>
              <Link
                href="/seller/onboarding"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
