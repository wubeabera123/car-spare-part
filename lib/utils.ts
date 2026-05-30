import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine Tailwind classes with proper conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as ETB currency. */
export function formatCurrency(
  value: number | string,
  currency: string = "ETB",
) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("am-ET", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

/** Slugify a string for URLs. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate text safely. */
export function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

/** Discount percentage between price and compareAtPrice. */
export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
