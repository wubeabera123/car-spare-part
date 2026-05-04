import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { Heart } from "lucide-react";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { product: { include: { brand: true } } },
  });

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-surface-muted p-16 text-center">
          <Heart className="h-10 w-10 text-foreground-muted" />
          <p className="mt-4 text-lg font-semibold">No saved items yet</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent-600 px-6 font-medium text-white hover:bg-accent-700 transition-colors"
          >
            Browse parts
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(({ product: p }) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id, slug: p.slug, name: p.name,
                brand: p.brand?.name ?? null, image: p.images[0],
                price: Number(p.price),
                compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
                rating: p.rating, reviewCount: p.reviewCount, stock: p.stock,
                partType: p.partType, condition: p.condition,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
