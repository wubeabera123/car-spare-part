import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { ProductCard } from "@/components/product/product-card";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, discountPercent } from "@/lib/utils";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { ReviewForm } from "@/components/product/review-form";
import { auth } from "@/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  return {
    title: product?.name ?? "Product",
    description: product?.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const related = await getRelatedProducts(product.id, product.categoryId);
  const price = Number(product.price);
  const compareAt = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const discount = discountPercent(price, compareAt);
  const inStock = product.stock > 0;

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-foreground-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-foreground-muted/40">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-lg border border-border bg-surface-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2">
            {product.brand && (
              <p className="text-sm font-medium uppercase tracking-wider text-foreground-muted">
                {product.brand.name}
              </p>
            )}
            <Badge variant={product.partType === "OEM" ? "brand" : "neutral"}>
              {product.partType}
            </Badge>
            {product.condition !== "NEW" && (
              <Badge variant="warning">{product.condition}</Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} count={product.reviewCount} />
            <span className="text-sm text-foreground-muted">
              SKU: {product.sku}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold tracking-tight">
              {formatCurrency(price)}
            </span>
            {compareAt && (
              <>
                <span className="text-lg text-foreground-muted line-through">
                  {formatCurrency(compareAt)}
                </span>
                <Badge variant="accent">-{discount}% off</Badge>
              </>
            )}
          </div>

          <p
            className={
              "mt-2 text-sm font-medium " +
              (inStock ? "text-emerald-600" : "text-accent-600")
            }
          >
            {inStock ? `In stock — ${product.stock} available` : "Out of stock"}
          </p>

          <p className="mt-6 text-foreground-muted leading-relaxed">
            {product.description}
          </p>

          <AddToCartForm
            productId={product.id}
            maxQuantity={product.stock}
            disabled={!inStock}
          />

          {/* Trust */}
          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-surface-muted p-5 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <span>Fitment guaranteed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-brand-600" />
              <span>Free shipping $99+</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-5 w-5 text-brand-600" />
              <span>30-day returns</span>
            </div>
          </div>

          {/* Seller */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {product.seller.storeName}
                </p>
                <p className="text-xs text-foreground-muted">
                  Verified seller · {product.seller.totalSales} sales
                </p>
              </div>
            </div>
            <Link
              href={`/sellers/${product.seller.storeSlug}`}
              className="text-sm font-medium text-brand-600 hover:text-accent-600"
            >
              View store →
            </Link>
          </div>
        </div>
      </div>

      {/* Specs / Compatibility */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
          <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface text-sm">
            {[
              ["Brand", product.brand?.name ?? "—"],
              ["SKU", product.sku],
              ["Condition", product.condition],
              ["Part type", product.partType],
              ["Warranty", product.warranty ?? "Manufacturer standard"],
              ["Weight", product.weight ? `${product.weight} kg` : "—"],
              ["Dimensions", product.dimensions ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-foreground-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight">
            Vehicle compatibility
          </h2>
          {product.compatibilities.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted p-6 text-sm text-foreground-muted">
              Compatibility data not yet listed. Contact seller for fitment.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface text-sm">
              {product.compatibilities.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <span className="font-medium">
                    {c.model.make.name} {c.model.name}
                  </span>
                  <span className="text-foreground-muted">
                    {c.yearStart}–{c.yearEnd}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Reviews */}
      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight">
          Reviews ({product.reviewCount})
        </h2>
        {product.reviews.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted p-6 text-sm text-foreground-muted">
            No reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {product.reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{r.user.name ?? "Anonymous"}</p>
                  <Rating value={r.rating} />
                </div>
                {r.title && <p className="mt-2 font-medium">{r.title}</p>}
                <p className="mt-1 text-sm text-foreground-muted">{r.body}</p>
              </li>
            ))}
          </ul>
        )}

        {session?.user ? (
          <div className="mt-8">
            <ReviewForm productId={product.id} productSlug={product.slug} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-foreground-muted">
            <Link href="/login" className="text-accent-600 hover:underline">
              Sign in
            </Link>{" "}
            to write a review.
          </p>
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight">Related products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
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
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
