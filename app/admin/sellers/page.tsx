import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { SellerStatusButtons } from "@/components/admin/admin-actions";

export const metadata = { title: "Sellers · Admin" };

export default async function AdminSellersPage() {
  const sellers = await prisma.seller.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      _count: { select: { products: true } },
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Sellers</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Approve and manage seller accounts.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Store</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sellers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-foreground-muted"
                >
                  No sellers yet.
                </td>
              </tr>
            )}
            {sellers.map((s) => (
              <tr key={s.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3 font-medium">{s.storeName}</td>
                <td className="px-5 py-3">{s.user.email}</td>
                <td className="px-5 py-3">{s._count.products}</td>
                <td className="px-5 py-3">{s.rating.toFixed(1)}★</td>
                <td className="px-5 py-3">
                  <Badge
                    variant={
                      s.status === "APPROVED"
                        ? "success"
                        : s.status === "PENDING"
                          ? "warning"
                          : s.status === "SUSPENDED"
                            ? "accent"
                            : "neutral"
                    }
                  >
                    {s.status}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <SellerStatusButtons
                    sellerId={s.id}
                    currentStatus={s.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
