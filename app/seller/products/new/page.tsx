import { prisma } from "@/lib/prisma";
import NewProductForm from "@/components/seller/new-product-form";

export const metadata = { title: "New product · Seller" };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Add product</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        List a new part in your store.
      </p>
      <NewProductForm categories={categories} brands={brands} />
    </>
  );
}
