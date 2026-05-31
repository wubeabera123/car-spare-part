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
  partType: z.enum(["OEM", "AFTERMARKET"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  images: z.string().optional().default(""),
  isActive: z.coerce.boolean().optional().default(true),
});

export type ProductFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function getSellerOrFail() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let seller = await prisma.seller.findUnique({
    where: { userId: session.user.id },
  });

  // Auto-create a seller profile for ADMIN users so they can manage products
  if (!seller && session.user.role === "ADMIN") {
    seller = await prisma.seller.create({
      data: {
        userId: session.user.id,
        storeName: "Admin Store",
        storeSlug: `admin-store-${session.user.id.slice(-6)}`,
        status: "APPROVED",
      },
    });
  }

  if (!seller) return { session, seller: null };
  return { session, seller };
}

export async function createProductAction(
  _prev: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const { seller } = await getSellerOrFail();
  if (!seller) return { message: "Seller profile required." };

  const parsed = ProductSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }
  const d = parsed.data;

  const slug = `${slugify(d.name)}-${Date.now().toString(36)}`;
  const images = d.images
    ? d.images
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  await prisma.product.create({
    data: {
      sellerId: seller.id,
      name: d.name,
      slug,
      sku: d.sku,
      description: d.description,
      price: d.price,
      compareAtPrice:
        d.compareAtPrice && d.compareAtPrice !== ("" as unknown)
          ? Number(d.compareAtPrice)
          : null,
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

export async function updateProductAction(
  productId: string,
  _prev: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const { seller } = await getSellerOrFail();
  if (!seller) return { message: "Seller profile required." };

  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: seller.id },
  });
  if (!product) return { message: "Product not found." };

  const parsed = ProductSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }
  const d = parsed.data;

  const images = d.images
    ? d.images
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : product.images;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: d.name,
      sku: d.sku,
      description: d.description,
      price: d.price,
      compareAtPrice:
        d.compareAtPrice && d.compareAtPrice !== ("" as unknown)
          ? Number(d.compareAtPrice)
          : null,
      stock: d.stock,
      categoryId: d.categoryId,
      brandId: d.brandId ? String(d.brandId) : null,
      partType: d.partType,
      condition: d.condition,
      images,
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/seller/products");
  redirect("/seller/products");
}

export async function deleteProductAction(
  productId: string,
): Promise<{ error?: string }> {
  const { seller } = await getSellerOrFail();
  if (!seller) return { error: "Seller profile required." };

  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: seller.id },
  });
  if (!product) return { error: "Product not found." };

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/seller/products");
  return {};
}

export async function markOrderShippedAction(
  orderId: string,
  trackingNumber: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthenticated" };

  const seller = await prisma.seller.findUnique({
    where: { userId: session.user.id },
  });
  if (!seller) return { error: "Seller not found." };

  // Verify the order has items from this seller
  const sellerItems = await prisma.orderItem.findFirst({
    where: { orderId, product: { sellerId: seller.id } },
  });
  if (!sellerItems) return { error: "Order not found." };

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "SHIPPED", trackingNumber: trackingNumber || null },
    include: { user: true },
  });

  if (order.user.email) {
    try {
      const { sendShippingUpdateEmail } = await import("@/lib/email");
      const { formatCurrency } = await import("@/lib/utils");
      void formatCurrency; // suppress unused warning
      await sendShippingUpdateEmail({
        to: order.user.email,
        name: order.user.name ?? "Customer",
        orderNumber: order.orderNumber,
        trackingNumber: trackingNumber || "N/A",
      });
    } catch {
      /* best-effort */
    }
  }

  revalidatePath("/seller/orders");
  return {};
}
