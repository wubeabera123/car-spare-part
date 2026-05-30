"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cartTotals, getOrCreateCart } from "@/lib/queries/cart";
import { initializeChapaPayment } from "@/lib/chapa";

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

  // Initialize Chapa payment
  const session2 = await auth();
  const user = session2?.user;

  // Send order confirmation email (best-effort)
  try {
    const { sendOrderConfirmationEmail } = await import("@/lib/email");
    const { formatCurrency } = await import("@/lib/utils");
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (order && user?.email) {
      await sendOrderConfirmationEmail({
        to: user.email,
        name: user.name ?? "Customer",
        orderNumber: order.orderNumber,
        total: formatCurrency(Number(order.total)),
        items: order.items.map((i) => ({
          name: i.name,
          qty: i.quantity,
          price: formatCurrency(Number(i.unitPrice)),
        })),
      });
    }
  } catch {
    /* email is best-effort */
  }
  const nameParts = (user?.name ?? "Customer").split(" ");
  const txRef = `AP-${orderId}-${Date.now().toString(36).toUpperCase()}`;

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const chapaRes = await initializeChapaPayment({
      amount: Number(totals.total),
      currency: "ETB",
      email: user?.email ?? "customer@autoparts.hub",
      first_name: nameParts[0] ?? "Customer",
      last_name: nameParts.slice(1).join(" ") || undefined,
      tx_ref: txRef,
      callback_url: `${baseUrl}/api/payment/chapa/webhook`,
      return_url: `${baseUrl}/checkout/success?orderId=${orderId}&tx_ref=${txRef}`,
      customization: {
        title: "AutoParts.Hub",
        description: `Order #${orderId}`,
      },
    });

    // Save tx_ref on order so we can verify on return
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: txRef },
    });

    revalidatePath("/cart");
    revalidatePath("/account/orders");
    redirect(chapaRes.data.checkout_url);
  } catch {
    // If Chapa is unavailable (e.g. test env without API key), fall through to success page
    revalidatePath("/cart");
    revalidatePath("/account/orders");
    redirect(`/checkout/success?orderId=${orderId}`);
  }
}

export async function cancelOrderAction(
  orderId: string,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthenticated" };

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });
  if (!order) return { error: "Order not found." };
  if (order.status !== "PENDING")
    return { error: "Only pending orders can be cancelled." };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  // Re-stock items
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await Promise.all(
    items.map((it) =>
      prisma.product.update({
        where: { id: it.productId },
        data: { stock: { increment: it.quantity } },
      }),
    ),
  );

  revalidatePath("/account/orders");
  return {};
}
