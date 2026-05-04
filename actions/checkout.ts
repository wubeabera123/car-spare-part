"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cartTotals, getOrCreateCart } from "@/lib/queries/cart";

const ShippingSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(3),
  line2: z.string().optional().nullable(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
});

export type CheckoutState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AP-${ts}-${rand}`;
}

export async function placeOrder(
  _prev: CheckoutState | undefined,
  formData: FormData,
): Promise<CheckoutState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const parsed = ShippingSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }
  const ship = parsed.data;

  const cart = await getOrCreateCart(session.user.id);
  if (cart.items.length === 0) {
    return { message: "Your cart is empty." };
  }
  const totals = cartTotals(cart.items);

  let orderId: string;
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Verify stock
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.product.name}`);
        }
      }

      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          fullName: ship.fullName,
          phone: ship.phone,
          line1: ship.line1,
          line2: ship.line2 ?? null,
          city: ship.city,
          state: ship.state,
          postalCode: ship.postalCode,
          country: ship.country,
        },
      });

      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          addressId: address.id,
          status: "PENDING",
          paymentStatus: "UNPAID",
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          items: {
            create: cart.items.map((it) => ({
              productId: it.product.id,
              name: it.product.name,
              sku: it.product.sku,
              image: it.product.images[0] ?? null,
              unitPrice: it.product.price,
              quantity: it.quantity,
              totalPrice: Number(it.product.price) * it.quantity,
            })),
          },
        },
      });

      // Decrement stock
      await Promise.all(
        cart.items.map((it) =>
          tx.product.update({
            where: { id: it.product.id },
            data: { stock: { decrement: it.quantity } },
          }),
        ),
      );

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });
    orderId = order.id;
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Checkout failed." };
  }

  revalidatePath("/cart");
  revalidatePath("/account/orders");
  redirect(`/checkout/success?orderId=${orderId}`);
}
