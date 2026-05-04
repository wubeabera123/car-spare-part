"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { addToCart, toggleWishlist } from "@/actions/cart";

export function AddToCartForm({
  productId,
  maxQuantity,
  disabled,
}: {
  productId: string;
  maxQuantity: number;
  disabled?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isWishPending, startWishTransition] = useTransition();

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="inline-flex h-12 items-center rounded-lg border border-border bg-surface">
        <button
          type="button"
          disabled={qty <= 1 || disabled}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-full px-4 text-lg disabled:opacity-30 hover:bg-surface-muted"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-10 text-center font-medium">{qty}</span>
        <button
          type="button"
          disabled={qty >= maxQuantity || disabled}
          onClick={() => setQty((q) => Math.min(maxQuantity, q + 1))}
          className="h-full px-4 text-lg disabled:opacity-30 hover:bg-surface-muted"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => startTransition(() => addToCart(productId, qty))}
        className="inline-flex h-12 flex-1 min-w-[180px] items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 font-medium text-white hover:bg-accent-700 transition-colors disabled:opacity-50 focus-ring"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        Add to cart
      </button>

      <button
        type="button"
        disabled={isWishPending}
        onClick={() => startWishTransition(() => toggleWishlist(productId))}
        className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border hover:bg-surface-muted transition-colors focus-ring disabled:opacity-50"
        aria-label="Add to wishlist"
      >
        {isWishPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
