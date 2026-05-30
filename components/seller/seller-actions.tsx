"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProductAction,
  markOrderShippedAction,
} from "@/actions/seller-products";
import { toast } from "sonner";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Product deleted.");
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs text-accent-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function MarkShippedButton({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (
    currentStatus === "SHIPPED" ||
    currentStatus === "DELIVERED" ||
    currentStatus === "CANCELLED"
  ) {
    return null;
  }

  function handleShip() {
    const tracking = prompt("Enter tracking number (optional):") ?? "";
    startTransition(async () => {
      const res = await markOrderShippedAction(orderId, tracking);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Order marked as shipped.");
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleShip}
      disabled={pending}
      className="text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Updating…" : "Mark shipped"}
    </button>
  );
}
