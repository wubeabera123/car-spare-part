import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PromotionActions } from "@/components/admin/admin-actions";
import { CreatePromotionForm } from "@/components/admin/create-promotion-form";

export const metadata = { title: "Promotions · Admin" };

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Promotions</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Discount codes and campaigns.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Expires</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promotions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-foreground-muted"
                  >
                    No promotions yet.
                  </td>
                </tr>
              )}
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-surface-muted/40">
                  <td className="px-5 py-3 font-mono">{p.code}</td>
                  <td className="px-5 py-3">
                    {p.percentOff != null ? "Percent" : "Amount"}
                  </td>
                  <td className="px-5 py-3">
                    {p.percentOff != null
                      ? `${p.percentOff}%`
                      : p.amountOff != null
                        ? formatCurrency(Number(p.amountOff))
                        : "—"}
                  </td>
                  <td className="px-5 py-3">
                    {p.endsAt ? p.endsAt.toLocaleDateString() : "No expiry"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={p.active ? "success" : "neutral"}>
                      {p.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <PromotionActions id={p.id} active={p.active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CreatePromotionForm />
      </div>
    </>
  );
}
