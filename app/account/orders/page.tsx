import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export const metadata = { title: "Orders" };

const STATUS_VARIANT: Record<string, "neutral" | "warning" | "success" | "accent" | "brand"> = {
  PENDING: "warning",
  PAID: "brand",
  PROCESSING: "brand",
  SHIPPED: "brand",
  DELIVERED: "success",
  CANCELLED: "accent",
  REFUNDED: "neutral",
};

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Track and review past orders.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
          <Package className="h-9 w-9 text-foreground-muted" />
          <p className="mt-3 font-semibold">No orders yet</p>
          <Link
            href="/products"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-accent-600 px-5 text-sm font-medium text-white hover:bg-accent-700"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-foreground-muted">Order #{o.orderNumber}</p>
                  <p className="text-sm">
                    {o.createdAt.toLocaleDateString()} ·{" "}
                    {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[o.status]}>{o.status}</Badge>
                  <p className="font-semibold">{formatCurrency(Number(o.total))}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
