export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
