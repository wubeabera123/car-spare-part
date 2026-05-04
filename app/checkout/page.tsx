import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrCreateCart, cartTotals } from "@/lib/queries/cart";
import { formatCurrency } from "@/lib/utils";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const cart = await getOrCreateCart(session.user.id);
  if (cart.items.length === 0) redirect("/cart");
  const totals = cartTotals(cart.items);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Complete your purchase securely.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <CheckoutForm defaultName={session.user.name ?? ""} />
        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {cart.items.map((it) => (
              <li key={it.id} className="flex justify-between gap-3 text-sm">
                <span className="line-clamp-1">
                  {it.product.name}{" "}
                  <span className="text-foreground-muted">× {it.quantity}</span>
                </span>
                <span className="font-medium">
                  {formatCurrency(Number(it.product.price) * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-border" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground-muted">Subtotal</dt>
              <dd>{formatCurrency(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground-muted">Shipping</dt>
              <dd>
                {totals.shipping === 0
                  ? "Free"
                  : formatCurrency(totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground-muted">Tax (7%)</dt>
              <dd>{formatCurrency(totals.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCurrency(totals.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
