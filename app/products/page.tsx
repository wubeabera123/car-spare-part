import Link from "next/link";
import { getProducts, getCategories, getBrands } from "@/lib/queries/products";
import { ProductCard } from "@/components/product/product-card";
import { SortSelect } from "@/components/product/sort-select";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: "NEW" | "USED" | "REFURBISHED";
  partType?: "OEM" | "AFTERMARKET";
  inStock?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  page?: string;
  make?: string;
  model?: string;
  year?: string;
};

export const metadata = { title: "Shop all parts" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice) : undefined;

  const [data, categories, brands, session] = await Promise.all([
    getProducts({
      q: sp.q,
      category: sp.category,
      brand: sp.brand,
      minPrice,
      maxPrice,
      condition: sp.condition,
      partType: sp.partType,
      inStock: sp.inStock === "1",
      sort: sp.sort,
      page,
      make: sp.make,
      model: sp.model,
      year: sp.year ? parseInt(sp.year, 10) : undefined,
    }),
    getCategories(),
    getBrands(),
    auth(),
  ]);

  // Build a Set of wishlisted product IDs for the current user
  const wishlistedIds = new Set<string>();
  if (session?.user?.id) {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    wishlistItems.forEach((w) => wishlistedIds.add(w.productId));
  }

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {sp.q ? `Results for "${sp.q}"` : "Shop all parts"}
        </h1>
        <p className="mt-2 text-foreground-muted">
          {data.total} {data.total === 1 ? "product" : "products"}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside>
          <form className="space-y-6 rounded-xl border border-border bg-surface p-5 shadow-soft sticky top-28">
            <input type="hidden" name="q" defaultValue={sp.q ?? ""} />

            <div>
              <h3 className="text-sm font-semibold">Category</h3>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    defaultChecked={!sp.category}
                  />
                  All categories
                </label>
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.slug}
                      defaultChecked={sp.category === c.slug}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Brand</h3>
              <select
                name="brand"
                defaultValue={sp.brand ?? ""}
                className="mt-2 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
              >
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Price</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  min="0"
                  defaultValue={sp.minPrice ?? ""}
                  className="h-10 rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  min="0"
                  defaultValue={sp.maxPrice ?? ""}
                  className="h-10 rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Condition</h3>
              <select
                name="condition"
                defaultValue={sp.condition ?? ""}
                className="mt-2 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
              >
                <option value="">Any</option>
                <option value="NEW">New</option>
                <option value="USED">Used</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Part type</h3>
              <select
                name="partType"
                defaultValue={sp.partType ?? ""}
                className="mt-2 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
              >
                <option value="">All</option>
                <option value="OEM">OEM</option>
                <option value="AFTERMARKET">Aftermarket</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                value="1"
                defaultChecked={sp.inStock === "1"}
              />
              In stock only
            </label>

            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-brand-900 font-medium text-white hover:bg-brand-800 transition-colors focus-ring"
            >
              Apply filters
            </button>
          </form>
        </aside>

        {/* Results */}
        <section>
          {/* Sort */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-foreground-muted">
              Page {data.page} of {data.pageCount}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-foreground-muted">
                Sort by
              </label>
              <SortSelect defaultValue={sp.sort ?? "newest"} />
            </div>
          </div>

          {data.items.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-border bg-surface-muted p-16 text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="mt-1 text-sm text-foreground-muted">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {data.items.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    slug: p.slug,
                    name: p.name,
                    brand: p.brand?.name ?? null,
                    image: p.images[0],
                    price: Number(p.price),
                    compareAtPrice: p.compareAtPrice
                      ? Number(p.compareAtPrice)
                      : null,
                    rating: p.rating,
                    reviewCount: p.reviewCount,
                    stock: p.stock,
                    partType: p.partType,
                    condition: p.condition,
                    wishlisted: wishlistedIds.has(p.id),
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.pageCount > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: data.pageCount }).map((_, i) => {
                const n = i + 1;
                const params = new URLSearchParams();
                Object.entries(sp).forEach(([k, v]) => {
                  if (v && k !== "page") params.set(k, String(v));
                });
                params.set("page", String(n));
                return (
                  <Link
                    key={n}
                    href={`/products?${params}`}
                    className={
                      "grid h-10 min-w-10 place-items-center rounded-lg px-3 text-sm focus-ring " +
                      (n === data.page
                        ? "bg-brand-900 text-white"
                        : "border border-border hover:bg-surface-muted")
                    }
                  >
                    {n}
                  </Link>
                );
              })}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
