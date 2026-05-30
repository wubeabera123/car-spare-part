"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(10, "Review must be at least 10 characters."),
});

export type ReviewFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createReviewAction(
  productId: string,
  productSlug: string,
  _prev: ReviewFormState | undefined,
  formData: FormData,
): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const parsed = ReviewSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors };

  // Verify the user has purchased this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: session.user.id,
        status: { in: ["DELIVERED", "SHIPPED"] },
      },
    },
  });

  if (!hasPurchased) {
    return {
      message: "You can only review products you have purchased and received.",
    };
  }

  // Check for existing review
  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId: session.user.id } },
  });
  if (existing) {
    return { message: "You have already reviewed this product." };
  }

  const d = parsed.data;
  await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      rating: d.rating,
      title: d.title || null,
      body: d.body,
      verified: true,
    },
  });

  // Update product rating and reviewCount
  const allReviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: parseFloat(avg.toFixed(2)),
      reviewCount: allReviews.length,
    },
  });

  revalidatePath(`/products/${productSlug}`);
  return { success: true };
}
