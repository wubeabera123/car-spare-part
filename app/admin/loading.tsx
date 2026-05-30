export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border p-4 last:border-0"
          >
            <div className="h-4 flex-1 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
