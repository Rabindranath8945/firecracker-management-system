"use client";

import { Filter, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PurchaseQuickActionsProps {
  onSupplierClick: () => void;
  onFilterClick: () => void;

  supplierActive?: boolean;
  filtersActive?: boolean;
}

export function PurchaseQuickActions({
  onSupplierClick,
  onFilterClick,
  supplierActive = false,
  filtersActive = false,
}: PurchaseQuickActionsProps) {
  return (
    <section className="flex items-center gap-3">
      {/* Supplier */}

      <Button
        type="button"
        variant="outline"
        onClick={onSupplierClick}
        className={`
          relative
          h-11
          rounded-2xl
          px-5
          shadow-sm
          transition-all
          ${
            supplierActive
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 dark:border-border dark:bg-card dark:hover:bg-emerald-500/10"
          }
        `}
      >
        <Truck className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        Supplier
        {supplierActive && (
          <span className="ml-2 h-2 w-2 rounded-full bg-emerald-500" />
        )}
      </Button>

      {/* Filters */}

      <Button
        type="button"
        variant="outline"
        onClick={onFilterClick}
        className={`
          relative
          h-11
          rounded-2xl
          px-5
          shadow-sm
          transition-all
          ${
            filtersActive
              ? "border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-500 dark:bg-orange-500/10 dark:text-orange-300"
              : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50 dark:border-border dark:bg-card dark:hover:bg-orange-500/10"
          }
        `}
      >
        <Filter className="mr-2 h-4 w-4 text-orange-500 dark:text-orange-400" />
        Filter
        {filtersActive && (
          <span className="ml-2 h-2 w-2 rounded-full bg-orange-500" />
        )}
      </Button>
    </section>
  );
}
