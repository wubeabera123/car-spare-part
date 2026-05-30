import { prisma } from "@/lib/prisma";
import { CreateBrandForm } from "@/components/admin/create-brand-form";
import { DeleteBrandButton } from "@/components/admin/admin-actions";

export const metadata = { title: "Brands · Admin" };

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage automotive brands.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Brand</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brands.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-foreground-muted"
                  >
                    No brands yet.
                  </td>
                </tr>
              )}
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-surface-muted/40">
                  <td className="px-5 py-3 font-medium">{b.name}</td>
                  <td className="px-5 py-3 font-mono text-xs">{b.slug}</td>
                  <td className="px-5 py-3">{b.country ?? "—"}</td>
                  <td className="px-5 py-3">{b._count.products}</td>
                  <td className="px-5 py-3">
                    <DeleteBrandButton id={b.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CreateBrandForm />
      </div>
    </>
  );
}
