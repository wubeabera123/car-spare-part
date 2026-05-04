import { prisma } from "@/lib/prisma";

export const metadata = { title: "Categories · Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage the catalog taxonomy.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3">Featured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-foreground-muted"
                >
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-surface-muted/40">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 font-mono text-xs">{c.slug}</td>
                <td className="px-5 py-3">{c._count.products}</td>
                <td className="px-5 py-3">{c.isFeatured ? "Yes" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
