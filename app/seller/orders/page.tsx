import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Orders · Seller" };

export default async function SellerOrdersPage() {
  const session = await auth();
  const seller = await prisma.seller.findUnique({
    where: { userId: session!.user.id },
  });

  const orderItems = seller
    ? await prisma.orderItem.findMany({
        where: { product: { sellerId: seller.id } },
        orderBy: { order: { createdAt: "desc" } },
        take: 50,
        include: { order: { include: { user: { select: { email: true, name: true } } } } },
      })
    : [];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Items sold from your store.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Qty</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orderItems.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-foreground-muted">No orders yet.</td></tr>
            )}
            {orderItems.map((it) => (
              <tr key={it.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3 font-mono text-xs">#{it.order.orderNumber}</td>
                <td className="px-5 py-3">{it.order.user.name ?? it.order.user.email}</td>
                <td className="px-5 py-3">{it.name}</td>
                <td className="px-5 py-3">{it.quantity}</td>
                <td className="px-5 py-3">{it.order.status}</td>
                <td className="px-5 py-3 text-right font-medium">
                  {formatCurrency(Number(it.totalPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
