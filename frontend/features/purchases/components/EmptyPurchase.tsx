import { PackageOpen } from "lucide-react";

export function EmptyPurchase() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center">
      <PackageOpen className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">No Purchases Found</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Create your first purchase to start tracking inventory.
      </p>
    </div>
  );
}
