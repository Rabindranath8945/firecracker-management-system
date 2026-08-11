"use client";

import PurchaseListItem from "./PurchaseListItem";
import PurchaseSkeleton from "./PurchaseSkeleton";

import type { Purchase } from "../types/purchase.types";

interface PurchaseListProps {
  loading: boolean;
  purchases: Purchase[];
  onDelete: (purchase: Purchase) => void;
}

export default function PurchaseList({
  loading,
  purchases,
  onDelete,
}: PurchaseListProps) {
  if (loading) {
    return (
      <section className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <PurchaseSkeleton key={index} />
        ))}
      </section>
    );
  }

  if (purchases.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No Purchases Found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 pb-24">
      {purchases.map((purchase) => (
        <PurchaseListItem
          key={purchase._id}
          purchase={purchase}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
