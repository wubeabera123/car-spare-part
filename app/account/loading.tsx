export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-border bg-surface p-5 space-y-3"
          >
            <div className="h-5 rounded bg-surface-muted" />
            <div className="h-4 w-3/4 rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
