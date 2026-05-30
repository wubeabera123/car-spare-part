export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-surface-muted" />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded-lg bg-surface-muted"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse space-y-2 rounded-xl border border-border bg-surface p-3"
            >
              <div className="aspect-square rounded-lg bg-surface-muted" />
              <div className="h-4 rounded bg-surface-muted" />
              <div className="h-4 w-2/3 rounded bg-surface-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
