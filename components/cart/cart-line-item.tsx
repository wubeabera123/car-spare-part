"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { updateCartItem, removeFromCart } from "@/actions/cart";
import { formatCurrency } from "@/lib/utils";

type Item = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  stock: number;
};

export function CartLineItem({ item }: { item: Item }) {
  const [isPending, start] = useTransition();
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <li className="flex gap-4 p-4 sm:p-6">
      <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-surface-muted">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-foreground-muted/40">No image</span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div>
            {item.brand && (
              <p className="text-xs uppercase tracking-wider text-foreground-muted">
                {item.brand}
              </p>
            )}
            <Link
              href={`/products/${item.slug}`}
              className="mt-0.5 line-clamp-2 text-sm font-medium hover:text-accent-600"
            >
              {item.name}
            </Link>
          </div>
          <p className="text-sm font-semibold whitespace-nowrap">
            {formatCurrency(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-3">
          <div className="inline-flex h-9 items-center rounded-lg border border-border">
            <button
              type="button"
              disabled={isPending || item.quantity <= 1}
              onClick={() =>
                start(() => updateCartItem(item.id, item.quantity - 1))
              }
              className="h-full px-3 disabled:opacity-30 hover:bg-surface-muted"
              aria-label="Decrease"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              disabled={isPending || item.quantity >= item.stock}
              onClick={() =>
                start(() => updateCartItem(item.id, item.quantity + 1))
              }
              className="h-full px-3 disabled:opacity-30 hover:bg-surface-muted"
              aria-label="Increase"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => start(() => removeFromCart(item.id))}
            className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-accent-600 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
