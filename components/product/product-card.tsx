import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatCurrency, discountPercent } from "@/lib/utils";
import { WishlistButton } from "@/components/product/wishlist-button";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  image?: string;
  price: number;
  compareAtPrice?: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  partType?: "OEM" | "AFTERMARKET";
  condition?: "NEW" | "USED" | "REFURBISHED";
  wishlisted?: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const inStock = product.stock > 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-surface-muted"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-foreground-muted/40 text-sm">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="accent">-{discount}%</Badge>}
          {product.partType === "OEM" && <Badge variant="brand">OEM</Badge>}
          {product.condition === "USED" && (
            <Badge variant="warning">Used</Badge>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton
            productId={product.id}
            initialWishlisted={product.wishlisted ?? false}
          />
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-accent-600"
          >
            {product.name}
          </Link>
        </h3>
        <Rating
          value={product.rating}
          count={product.reviewCount}
          className="mt-2"
        />

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-xs text-foreground-muted line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
            </div>
            <p
              className={
                "mt-1 text-xs font-medium " +
                (inStock ? "text-emerald-600" : "text-accent-600")
              }
            >
              {inStock ? `In stock · ${product.stock}` : "Out of stock"}
            </p>
          </div>
          <button
            type="button"
            disabled={!inStock}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-900 text-white hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-ring"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
