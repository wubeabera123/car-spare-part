import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";
import { verifyChapaPayment } from "@/lib/chapa";
import { Badge } from "@/components/ui/badge";

type SP = Promise<{ orderId?: string; tx_ref?: string }>;

export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { orderId, tx_ref } = await searchParams;
  if (!orderId) redirect("/");

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });
  if (!order) redirect("/account/orders");

  // Verify payment with Chapa if tx_ref provided and order still unpaid
  if (tx_ref && order.paymentStatus === "UNPAID") {
    try {
      const verify = await verifyChapaPayment(tx_ref);
      if (verify.data?.status === "success") {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID", status: "PROCESSING" },
        });
        order.paymentStatus = "PAID";
        order.status = "PROCESSING";
      }
    } catch {
      // Verification failed silently — webhook will handle it
    }
  }

  const paid = order.paymentStatus === "PAID";

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${paid ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
        >
          {paid ? (
            <CheckCircle2 className="h-7 w-7" />
          ) : (
            <Clock className="h-7 w-7" />
          )}
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          {paid ? "Payment confirmed!" : "Order received!"}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          {paid
            ? "Thank you for your purchase. Your order is now being processed."
            : "Your order has been placed. Complete payment to confirm processing."}
        </p>

        <dl className="mt-6 grid gap-3 rounded-xl bg-surface-muted p-5 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-foreground-muted">Order number</dt>
            <dd className="font-mono">#{order.orderNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground-muted">Items</dt>
            <dd>{order.items.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground-muted">Total</dt>
            <dd className="font-semibold">
              {formatCurrency(Number(order.total))}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground-muted">Payment</dt>
            <dd>
              <Badge variant={paid ? "success" : "warning"}>
                {order.paymentStatus}
              </Badge>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/account/orders"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium hover:bg-surface-muted"
          >
            View orders
          </Link>
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-accent-600 px-5 text-sm font-medium text-white hover:bg-accent-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
