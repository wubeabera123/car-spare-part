import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Wrench,
  Cog,
  Battery,
  Disc,
  Lightbulb,
  CircleGauge,
  Cylinder,
  Zap,
} from "lucide-react";

export const metadata = { title: "Shop by category" };

const ICONS = [
  Wrench,
  Cog,
  Battery,
  Disc,
  Lightbulb,
  CircleGauge,
  Cylinder,
  Zap,
];

export default async function CategoriesPage() {
  let categories: {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
  }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { parentId: null },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch {
    /* fallback to empty */
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Shop by category</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Browse all part categories.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-accent-300 hover:shadow-soft"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-accent-50 group-hover:text-accent-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-foreground-muted">
                {c._count.products} products
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
