"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => {
        const next = new URLSearchParams(params.toString());
        next.set("sort", e.target.value);
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
      }}
      className="h-10 rounded-lg border border-border bg-surface px-3 text-sm focus-ring"
    >
      <option value="newest">Newest</option>
      <option value="popular">Most reviewed</option>
      <option value="rating">Top rated</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
  );
}
