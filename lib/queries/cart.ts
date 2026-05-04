import { prisma } from "@/lib/prisma";

export async function getCart(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { brand: true } },
        },
      },
    },
  });
}

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: { include: { product: { include: { brand: true } } } },
    },
  });
}

export function cartTotals(
  items: { quantity: number; product: { price: unknown } }[],
) {
  const subtotal = items.reduce((sum, i) => {
    const price = Number(i.product.price);
    return sum + price * i.quantity;
  }, 0);
  const shipping = subtotal > 99 ? 0 : 9.99;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), shipping, tax, total };
}
