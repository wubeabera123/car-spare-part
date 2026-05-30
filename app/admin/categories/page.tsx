import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CreateCategoryForm } from "@/components/admin/create-category-form";
import { DeleteCategoryButton } from "@/components/admin/admin-actions";

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface-muted text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
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
                  <td className="px-5 py-3">
                    <Badge variant={c.isFeatured ? "success" : "neutral"}>
                      {c.isFeatured ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <DeleteCategoryButton id={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CreateCategoryForm />
      </div>
    </>
  );
}
