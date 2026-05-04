import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Brands" };

export default async function BrandsPage() {
  let brands: {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
  }[] = [];
  try {
    brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch {
    /* empty */
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Find parts from trusted manufacturers.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/brands/${b.slug}`}
            className="rounded-xl border border-border bg-surface p-5 text-center transition hover:border-accent-300 hover:shadow-soft"
          >
            <p className="font-semibold">{b.name}</p>
            <p className="mt-1 text-xs text-foreground-muted">
              {b._count.products} products
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
