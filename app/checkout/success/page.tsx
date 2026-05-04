import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

type SP = Promise<{ orderId?: string }>;

export const metadata = { title: "Order confirmed" };

export default async function CheckoutSuccess({ searchParams }: { searchParams: SP }) {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/");

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });
  if (!order) redirect("/account/orders");

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Order confirmed!</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Thank you for your purchase. We&apos;ve sent a confirmation email with the details.
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
            <dd className="font-semibold">{formatCurrency(Number(order.total))}</dd>
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
