export default function ProductSkeleton() {
  return (
    <div className="border-b border-slate-200 bg-white p-4 animate-pulse">
      <div className="h-5 w-48 rounded bg-slate-200" />

      <div className="mt-2 h-3 w-24 rounded bg-slate-200" />

      <div className="mt-3 h-3 w-32 rounded bg-slate-200" />

      <div className="mt-4 flex gap-4">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>

      <div className="mt-4 h-6 w-24 rounded-full bg-slate-200" />
    </div>
  );
}
