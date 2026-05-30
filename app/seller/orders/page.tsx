import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MarkShippedButton } from "@/components/seller/seller-actions";

export const metadata = { title: "Orders · Seller" };

const STATUS_VARIANT: Record<
  string,
  "neutral" | "warning" | "success" | "accent" | "brand"
> = {
  PENDING: "warning",
  PAID: "brand",
  PROCESSING: "brand",
  SHIPPED: "brand",
  DELIVERED: "success",
  CANCELLED: "accent",
  REFUNDED: "neutral",
};

export default async function SellerOrdersPage() {
  const session = await auth();
  const seller = await prisma.seller.findUnique({
    where: { userId: session!.user.id },
  });

  const orders = seller
    ? await prisma.order.findMany({
        where: { items: { some: { product: { sellerId: seller.id } } } },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          user: { select: { email: true, name: true } },
          items: { where: { product: { sellerId: seller.id } } },
        },
      })
    : [];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Orders containing your products.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tracking</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-foreground-muted"
                >
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => {
              const itemTotal = o.items.reduce(
                (s, it) => s + Number(it.totalPrice),
                0,
              );
              return (
                <tr key={o.id} className="hover:bg-surface-muted/40">
                  <td className="px-5 py-3 font-mono text-xs">
                    #{o.orderNumber}
                  </td>
                  <td className="px-5 py-3">{o.user.name ?? o.user.email}</td>
                  <td className="px-5 py-3">{o.items.length}</td>
                  <td className="px-5 py-3">
                    <Badge variant={STATUS_VARIANT[o.status] ?? "neutral"}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-foreground-muted">
                    {o.trackingNumber ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {formatCurrency(itemTotal)}
                  </td>
                  <td className="px-5 py-3">
                    <MarkShippedButton
                      orderId={o.id}
                      currentStatus={o.status}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
