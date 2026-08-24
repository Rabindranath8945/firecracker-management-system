export default function PurchaseSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border bg-card p-5">
      <div className="mb-4 h-5 w-40 rounded bg-muted" />

      <div className="space-y-3">
        <div className="h-4 rounded bg-muted" />
        <div className="h-4 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
