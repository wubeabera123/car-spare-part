const BRANDS = [
  "Bosch",
  "Brembo",
  "Denso",
  "K&N",
  "Michelin",
  "Monroe",
  "NGK",
  "ACDelco",
  "Akebono",
  "Mahle",
  "Continental",
  "Valeo",
];

export function PopularBrands() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="container-page">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-accent-600">
            Trusted by drivers
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Popular brands
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground-muted">
            We carry parts from the world&apos;s leading automotive
            manufacturers.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {BRANDS.map((b) => (
            <a
              key={b}
              href={`/brands/${b.toLowerCase().replace(/\W+/g, "-")}`}
              className="group flex h-20 items-center justify-center rounded-xl border border-border bg-surface text-lg font-semibold tracking-tight text-foreground-muted transition-all hover:border-accent-300 hover:text-accent-600 hover:shadow-soft"
            >
              {b}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
