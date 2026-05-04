import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Package, ShoppingBag, Star } from "lucide-react";

export const metadata = { title: "Seller dashboard" };

export default async function SellerDashboard() {
  const session = await auth();
  const seller = await prisma.seller.findUnique({
    where: { userId: session!.user.id },
    include: { products: true },
  });

  const productCount = seller?.products.length ?? 0;
  const totalStock = seller?.products.reduce((s, p) => s + p.stock, 0) ?? 0;
  const avgRating = productCount
    ? (
        seller!.products.reduce((s, p) => s + p.rating, 0) / productCount
      ).toFixed(1)
    : "0.0";

  const stats = [
    {
      label: "Total revenue",
      value: formatCurrency(seller?.totalSales ?? 0),
      icon: DollarSign,
    },
    { label: "Active products", value: productCount.toString(), icon: Package },
    {
      label: "Inventory units",
      value: totalStock.toString(),
      icon: ShoppingBag,
    },
    { label: "Avg rating", value: `${avgRating}★`, icon: Star },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Overview of your store performance.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-foreground-muted">{s.label}</p>
                <Icon className="h-4 w-4 text-foreground-muted" />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Welcome to your seller portal</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          From here you can manage products, fulfill orders, and update your
          store profile.
        </p>
      </div>
    </>
  );
}
