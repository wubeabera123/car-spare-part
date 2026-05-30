"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelOrderAction } from "@/actions/checkout";
import { toast } from "sonner";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleCancel() {
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await cancelOrderAction(orderId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Order cancelled successfully.");
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleCancel}
      disabled={pending}
      className="text-xs font-medium text-accent-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Cancelling…" : "Cancel order"}
    </button>
  );
}
