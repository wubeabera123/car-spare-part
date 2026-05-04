import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrCreateCart, cartTotals } from "@/lib/queries/cart";
import { formatCurrency } from "@/lib/utils";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { ShoppingCart } from "lucide-react";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cart");

  const cart = await getOrCreateCart(session.user.id);
  const totals = cartTotals(cart.items);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>

      {cart.items.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-surface-muted p-16 text-center">
          <ShoppingCart className="h-10 w-10 text-foreground-muted" />
          <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Browse parts and add some to get started.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-accent-600 px-6 font-medium text-white hover:bg-accent-700 transition-colors"
          >
            Shop parts
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={{
                  id: item.id,
                  productId: item.product.id,
                  slug: item.product.slug,
                  name: item.product.name,
                  brand: item.product.brand?.name ?? null,
                  image: item.product.images[0] ?? null,
                  unitPrice: Number(item.product.price),
                  quantity: item.quantity,
                  stock: item.product.stock,
                }}
              />
            ))}
          </ul>

          <aside>
            <div className="sticky top-28 rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Subtotal</dt>
                  <dd className="font-medium">
                    {formatCurrency(totals.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Shipping</dt>
                  <dd className="font-medium">
                    {totals.shipping === 0
                      ? "Free"
                      : formatCurrency(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Tax (est.)</dt>
                  <dd className="font-medium">{formatCurrency(totals.tax)}</dd>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatCurrency(totals.total)}</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent-600 font-semibold text-white hover:bg-accent-700 transition-colors"
              >
                Proceed to checkout
              </Link>
              <Link
                href="/products"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-border text-sm hover:bg-surface-muted"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
