import {
  ProductCard,
  type ProductCardData,
} from "@/components/product/product-card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Fallback demo data shown when DB is empty / unavailable.
const FALLBACK: ProductCardData[] = [
  {
    id: "1",
    slug: "bosch-iridium-spark-plugs-set",
    name: "Bosch Iridium Spark Plugs (Set of 4)",
    brand: "Bosch",
    price: 42.99,
    compareAtPrice: 59.99,
    rating: 4.8,
    reviewCount: 1284,
    stock: 230,
    partType: "OEM",
    condition: "NEW",
  },
  {
    id: "2",
    slug: "brembo-front-brake-pads-ceramic",
    name: "Brembo Ceramic Front Brake Pads",
    brand: "Brembo",
    price: 89.5,
    compareAtPrice: 110,
    rating: 4.9,
    reviewCount: 642,
    stock: 64,
    partType: "OEM",
    condition: "NEW",
  },
  {
    id: "3",
    slug: "k-and-n-performance-air-filter",
    name: "K&N Performance Air Filter — Reusable",
    brand: "K&N",
    price: 54.0,
    rating: 4.7,
    reviewCount: 320,
    stock: 12,
    partType: "AFTERMARKET",
    condition: "NEW",
  },
  {
    id: "4",
    slug: "monroe-quick-strut-front-assembly",
    name: "Monroe Quick-Strut Complete Front Assembly",
    brand: "Monroe",
    price: 219.99,
    compareAtPrice: 279.99,
    rating: 4.6,
    reviewCount: 158,
    stock: 8,
    partType: "OEM",
    condition: "NEW",
  },
];

async function loadFeatured(): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { brand: true },
      take: 8,
      orderBy: { rating: "desc" },
    });
    if (products.length === 0) return FALLBACK;
    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? null,
      image: p.images[0],
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      partType: p.partType,
      condition: p.condition,
    }));
  } catch {
    return FALLBACK;
  }
}

export async function FeaturedProducts() {
  const products = await loadFeatured();
  return (
    <section className="container-page py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent-600">
            Best sellers
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured products
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-brand-600 hover:text-accent-600"
        >
          Shop all →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
