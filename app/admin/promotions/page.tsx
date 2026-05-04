import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

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

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Usage</th>
              <th className="px-5 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promotions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-foreground-muted"
                >
                  No promotions yet.
                </td>
              </tr>
            )}
            {promotions.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3 font-mono">{p.code}</td>
                <td className="px-5 py-3">{p.type}</td>
                <td className="px-5 py-3">
                  {p.type === "PERCENTAGE"
                    ? `${Number(p.value)}%`
                    : formatCurrency(Number(p.value))}
                </td>
                <td className="px-5 py-3">
                  {p.usageCount}
                  {p.usageLimit ? ` / ${p.usageLimit}` : ""}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={p.isActive ? "success" : "neutral"}>
                    {p.isActive ? "Active" : "Inactive"}
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
