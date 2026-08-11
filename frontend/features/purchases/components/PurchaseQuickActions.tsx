"use client";

import { Funnel, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PurchaseQuickActionsProps {
  onSupplierClick: () => void;
  onFilterClick: () => void;
}

export function PurchaseQuickActions({
  onSupplierClick,
  onFilterClick,
}: PurchaseQuickActionsProps) {
  return (
    <section className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onSupplierClick}
        className="
          h-11
          rounded-2xl
          border-slate-200
          bg-white
          px-5
          shadow-sm
          hover:bg-slate-50
        "
      >
        <Truck className="mr-2 h-4 w-4 text-emerald-600" />
        Supplier
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onFilterClick}
        className="
          h-11
          rounded-2xl
          border-slate-200
          bg-white
          px-5
          shadow-sm
          hover:bg-slate-50
        "
      >
        <Funnel className="mr-2 h-4 w-4 text-orange-500" />
        Filter
      </Button>
    </section>
  );
}
