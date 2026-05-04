import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Products · Admin" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { brand: true, category: true, seller: true },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Products</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Showing latest {products.length} products.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Brand</th>
              <th className="px-5 py-3">Seller</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {p.category.name}
                  </p>
                </td>
                <td className="px-5 py-3">{p.brand?.name ?? "—"}</td>
                <td className="px-5 py-3">{p.seller.storeName}</td>
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
