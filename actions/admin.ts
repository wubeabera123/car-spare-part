"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") redirect("/");
  return session;
}

// ──────────────────────────── SELLERS ────────────────────────────────────────

export async function updateSellerStatusAction(
  sellerId: string,
  status: "APPROVED" | "SUSPENDED" | "REJECTED",
): Promise<{ error?: string }> {
  await requireAdmin();
  const seller = await prisma.seller.update({
    where: { id: sellerId },
    data: { status },
    include: { user: true },
  });

  if (status === "APPROVED" && seller.user.email) {
    try {
      const { sendSellerApprovalEmail } = await import("@/lib/email");
      await sendSellerApprovalEmail({
        to: seller.user.email,
        name: seller.user.name ?? "Seller",
        storeName: seller.storeName,
      });
    } catch {
      /* best-effort */
    }
  }

  revalidatePath("/admin/sellers");
  return {};
}

// ──────────────────────────── ORDERS ─────────────────────────────────────────

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
): Promise<{ error?: string }> {
  await requireAdmin();
  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });
  revalidatePath("/admin/orders");
  return {};
}

// ──────────────────────────── USERS ──────────────────────────────────────────

export async function toggleUserActiveAction(
  userId: string,
  isActive: boolean,
): Promise<{ error?: string }> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/admin/users");
  return {};
}

// ──────────────────────────── CATEGORIES ─────────────────────────────────────

const CategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export type CategoryFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createCategoryAction(
  _prev: CategoryFormState | undefined,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();
  const parsed = CategorySchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };
  const d = parsed.data;
  try {
    await prisma.category.create({
      data: {
        name: d.name,
        slug: d.slug,
        description: d.description || null,
        image: d.image || null,
        isFeatured: formData.get("isFeatured") === "on",
      },
    });
  } catch {
    return { message: "A category with this name or slug already exists." };
  }
  revalidatePath("/admin/categories");
  return { message: "" };
}

export async function deleteCategoryAction(
  id: string,
): Promise<{ error?: string }> {
  await requireAdmin();
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return { error: "Cannot delete — category has products." };
  }
  revalidatePath("/admin/categories");
  return {};
}

// ──────────────────────────── BRANDS ─────────────────────────────────────────

const BrandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logo: z.string().url().optional().or(z.literal("")),
  country: z.string().optional(),
});

export type BrandFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createBrandAction(
  _prev: BrandFormState | undefined,
  formData: FormData,
): Promise<BrandFormState> {
  await requireAdmin();
  const parsed = BrandSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };
  const d = parsed.data;
  try {
    await prisma.brand.create({
      data: {
        name: d.name,
        slug: d.slug,
        logo: d.logo || null,
        country: d.country || null,
      },
    });
  } catch {
    return { message: "A brand with this name or slug already exists." };
  }
  revalidatePath("/admin/brands");
  return { message: "" };
}

export async function deleteBrandAction(
  id: string,
): Promise<{ error?: string }> {
  await requireAdmin();
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
  return {};
}

// ──────────────────────────── PROMOTIONS ─────────────────────────────────────

const PromotionSchema = z.object({
  code: z.string().min(2).toUpperCase(),
  description: z.string().optional(),
  percentOff: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .or(z.literal("")),
  amountOff: z.coerce.number().positive().optional().or(z.literal("")),
  endsAt: z.string().optional(),
});

export type PromotionFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createPromotionAction(
  _prev: PromotionFormState | undefined,
  formData: FormData,
): Promise<PromotionFormState> {
  await requireAdmin();
  const parsed = PromotionSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };
  const d = parsed.data;
  try {
    await prisma.promotion.create({
      data: {
        code: d.code,
        description: d.description || null,
        percentOff:
          d.percentOff && d.percentOff !== ("" as unknown)
            ? Number(d.percentOff)
            : null,
        amountOff:
          d.amountOff && d.amountOff !== ("" as unknown)
            ? Number(d.amountOff)
            : null,
        endsAt: d.endsAt ? new Date(d.endsAt) : null,
        active: true,
      },
    });
  } catch {
    return { message: "A promotion with this code already exists." };
  }
  revalidatePath("/admin/promotions");
  return { message: "" };
}

export async function togglePromotionActiveAction(
  id: string,
  active: boolean,
): Promise<{ error?: string }> {
  await requireAdmin();
  await prisma.promotion.update({ where: { id }, data: { active } });
  revalidatePath("/admin/promotions");
  return {};
}

export async function deletePromotionAction(
  id: string,
): Promise<{ error?: string }> {
  await requireAdmin();
  await prisma.promotion.delete({ where: { id } });
  revalidatePath("/admin/promotions");
  return {};
}

// ──────────────────────────── SETTINGS ───────────────────────────────────────

export async function upsertSettingAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ message?: string }> {
  await requireAdmin();
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;
  if (!key) return { message: "Key is required." };
  let parsed: unknown = value;
  try {
    parsed = JSON.parse(value);
  } catch {
    /* store as string */
  }
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: parsed as never },
    update: { value: parsed as never },
  });
  revalidatePath("/admin/settings");
  return { message: "" };
}
