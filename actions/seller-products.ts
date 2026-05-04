"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ProductSchema = z.object({
  name: z.string().min(3),
  sku: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  brandId: z.string().optional().or(z.literal("")),
  partType: z.enum(["OEM", "AFTERMARKET", "USED", "PERFORMANCE"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  images: z.string().optional().default(""),
});

export type ProductFormState = { errors?: Record<string, string[]>; message?: string };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

export async function createProductAction(
  _prev: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
  if (!seller) return { message: "Seller profile required." };

  const parsed = ProductSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }
  const d = parsed.data;

  const slug = `${slugify(d.name)}-${Date.now().toString(36)}`;
  const images = d.images
    ? d.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
    : [];

  await prisma.product.create({
    data: {
      sellerId: seller.id,
      name: d.name,
      slug,
      sku: d.sku,
      description: d.description,
      price: d.price,
      compareAtPrice: d.compareAtPrice && d.compareAtPrice !== ("" as unknown) ? Number(d.compareAtPrice) : null,
      stock: d.stock,
      categoryId: d.categoryId,
      brandId: d.brandId ? String(d.brandId) : null,
      partType: d.partType,
      condition: d.condition,
      images,
      isActive: true,
    },
  });

  revalidatePath("/seller/products");
  redirect("/seller/products");
}
