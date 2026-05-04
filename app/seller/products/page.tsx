import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Products · Seller" };

export default async function SellerProductsPage() {
  const session = await auth();
  const seller = await prisma.seller.findUnique({
    where: { userId: session!.user.id },
  });
  const products = seller
    ? await prisma.product.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      })
    : [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Manage your inventory.
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-foreground-muted"
                >
                  No products yet. Add your first listing to get started.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3">
                  <Link
                    href={`/products/${p.slug}`}
                    className="font-medium hover:text-accent-600"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-foreground-muted">
                    {p.category.name}
                  </p>
                </td>
                <td className="px-5 py-3 font-mono text-xs">{p.sku}</td>
                <td className="px-5 py-3">{formatCurrency(Number(p.price))}</td>
                <td className="px-5 py-3">{p.stock}</td>
                <td className="px-5 py-3">
                  <Badge variant={p.isActive ? "success" : "neutral"}>
                    {p.isActive ? "Active" : "Hidden"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
