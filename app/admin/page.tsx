import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Admin dashboard" };

export default async function AdminOverview() {
  const [userCount, productCount, orderCount, sellerCount, ordersAgg] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.seller.count({ where: { status: "APPROVED" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
    ]);

  const revenue = Number(ordersAgg._sum.total ?? 0);

  const stats = [
    {
      label: "Total revenue",
      value: formatCurrency(revenue),
      icon: DollarSign,
      accent: "text-emerald-600",
    },
    {
      label: "Orders",
      value: orderCount.toLocaleString(),
      icon: ShoppingBag,
      accent: "text-brand-600",
    },
    {
      label: "Products",
      value: productCount.toLocaleString(),
      icon: Package,
      accent: "text-amber-600",
    },
    {
      label: "Customers",
      value: userCount.toLocaleString(),
      icon: Users,
      accent: "text-purple-600",
    },
    {
      label: "Active sellers",
      value: sellerCount.toLocaleString(),
      icon: TrendingUp,
      accent: "text-sky-600",
    },
  ];

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Site-wide metrics and recent activity.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-foreground-muted">{s.label}</p>
                <Icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold">Recent orders</h2>
        </div>
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentOrders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-foreground-muted"
                >
                  No orders yet.
                </td>
              </tr>
            )}
            {recentOrders.map((o) => (
              <tr key={o.id} className="hover:bg-surface-muted/40">
                <td className="px-6 py-3 font-mono text-xs">
                  #{o.orderNumber}
                </td>
                <td className="px-6 py-3">{o.user.name ?? o.user.email}</td>
                <td className="px-6 py-3">{o.status}</td>
                <td className="px-6 py-3 text-right font-medium">
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
