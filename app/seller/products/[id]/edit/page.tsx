import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/seller/edit-product-form";

export const metadata = { title: "Edit Product · Seller" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seller = await prisma.seller.findUnique({
    where: { userId: session.user.id },
  });
  if (!seller) redirect("/seller/onboarding");

  const product = await prisma.product.findFirst({
    where: { id, sellerId: seller.id },
  });
  if (!product) notFound();

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Edit product</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Update listing details for <strong>{product.name}</strong>.
      </p>
      <EditProductForm
        product={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          stock: product.stock,
          categoryId: product.categoryId,
          brandId: product.brandId ?? "",
          partType: product.partType,
          condition: product.condition,
          images: product.images.join("\n"),
          isActive: product.isActive,
        }}
        categories={categories}
        brands={brands}
      />
    </>
  );
}
