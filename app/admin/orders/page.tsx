import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/admin-actions";

export const metadata = { title: "Orders · Admin" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } }, items: true },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Latest {orders.length} orders.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-foreground-muted"
                >
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3 font-mono text-xs">
                  #{o.orderNumber}
                </td>
                <td className="px-5 py-3">{o.user.name ?? o.user.email}</td>
                <td className="px-5 py-3">
                  <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                </td>
                <td className="px-5 py-3">{o.items.length}</td>
                <td className="px-5 py-3 text-foreground-muted">
                  {o.createdAt.toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-right font-medium">
                  {formatCurrency(Number(o.total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
