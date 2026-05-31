"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/actions/cart";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  initialWishlisted?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  initialWishlisted = false,
  className,
}: WishlistButtonProps) {
  const [optimistic, setOptimistic] = useOptimistic(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate if inside a Link
    startTransition(async () => {
      setOptimistic(!optimistic);
      await toggleWishlist(productId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={optimistic ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-surface/90 transition-all focus-ring",
        optimistic ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          optimistic ? "fill-accent-600 text-accent-600" : "text-foreground",
        )}
      />
    </button>
  );
}
