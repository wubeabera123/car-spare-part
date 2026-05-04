import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} · Brands` };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) notFound();

  const products = await prisma.product.findMany({
    where: { brandId: brand.id, isActive: true },
    include: { brand: true },
    orderBy: { rating: "desc" },
    take: 60,
  });

  const cards: ProductCardData[] = products.map((p) => ({
    id: p.id, slug: p.slug, name: p.name,
    brand: p.brand?.name ?? null, image: p.images[0],
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    rating: p.rating, reviewCount: p.reviewCount, stock: p.stock,
    partType: p.partType, condition: p.condition,
  }));

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">{brand.name}</h1>
      {brand.description && (
        <p className="mt-2 max-w-2xl text-foreground-muted">{brand.description}</p>
      )}

      {cards.length === 0 ? (
        <p className="mt-10 text-center text-foreground-muted">
          No products from this brand yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
