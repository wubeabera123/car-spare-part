"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateSellerStatusAction,
  updateOrderStatusAction,
  toggleUserActiveAction,
  deleteCategoryAction,
  deleteBrandAction,
  togglePromotionActiveAction,
  deletePromotionAction,
} from "@/actions/admin";

// ─── Seller Status Buttons ────────────────────────────────────────────────────

export function SellerStatusButtons({
  sellerId,
  currentStatus,
}: {
  sellerId: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function update(status: "APPROVED" | "SUSPENDED" | "REJECTED") {
    startTransition(async () => {
      const res = await updateSellerStatusAction(sellerId, status);
      if (res.error) toast.error(res.error);
      else {
        toast.success(`Seller ${status.toLowerCase()}.`);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== "APPROVED" && (
        <button
          onClick={() => update("APPROVED")}
          disabled={pending}
          className="text-xs font-medium text-emerald-600 hover:underline disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {currentStatus === "APPROVED" && (
        <button
          onClick={() => update("SUSPENDED")}
          disabled={pending}
          className="text-xs font-medium text-amber-600 hover:underline disabled:opacity-50"
        >
          Suspend
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button
          onClick={() => update("REJECTED")}
          disabled={pending}
          className="text-xs font-medium text-accent-600 hover:underline disabled:opacity-50"
        >
          Reject
        </button>
      )}
    </div>
  );
}

// ─── Order Status Select ──────────────────────────────────────────────────────

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const STATUSES = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Order status updated.");
        router.refresh();
      }
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={pending}
      className="rounded-md border border-border bg-surface px-2 py-1 text-xs focus-ring disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

// ─── User Active Toggle ───────────────────────────────────────────────────────

export function UserActiveToggle({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    startTransition(async () => {
      const res = await toggleUserActiveAction(userId, !isActive);
      if (res.error) toast.error(res.error);
      else {
        toast.success(isActive ? "User deactivated." : "User activated.");
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`text-xs font-medium hover:underline disabled:opacity-50 ${isActive ? "text-accent-600" : "text-emerald-600"}`}
    >
      {pending ? "…" : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}

// ─── Category Delete Button ───────────────────────────────────────────────────

export function DeleteCategoryButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this category?")) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Category deleted.");
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
      {pending ? "…" : "Delete"}
    </button>
  );
}

// ─── Brand Delete Button ──────────────────────────────────────────────────────

export function DeleteBrandButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this brand?")) return;
    startTransition(async () => {
      const res = await deleteBrandAction(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Brand deleted.");
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
      {pending ? "…" : "Delete"}
    </button>
  );
}

// ─── Promotion Buttons ────────────────────────────────────────────────────────

export function PromotionActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    startTransition(async () => {
      const res = await togglePromotionActiveAction(id, !active);
      if (res.error) toast.error(res.error);
      else {
        toast.success(
          active ? "Promotion deactivated." : "Promotion activated.",
        );
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this promotion?")) return;
    startTransition(async () => {
      const res = await deletePromotionAction(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Promotion deleted.");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={pending}
        className={`text-xs font-medium hover:underline disabled:opacity-50 ${active ? "text-amber-600" : "text-emerald-600"}`}
      >
        {active ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="text-xs text-accent-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
