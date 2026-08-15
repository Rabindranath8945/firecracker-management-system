"use client";

import {
  Building2,
  ChevronRight,
  CheckCircle2,
  Phone,
  Plus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Supplier {
  _id: string;
  name: string;
  mobile?: string;
  supplierCode?: string;
  openingBalance?: number;
  totalPurchases?: number;
  totalPaid?: number;
}

interface PurchaseSupplierCardProps {
  supplier: Supplier | null;

  loading?: boolean;

  onSelect: () => void;

  onAddNew: () => void;
}

function getSupplierDue(supplier: Supplier): number {
  return Math.max(
    0,
    Number(supplier.openingBalance ?? 0) +
      Number(supplier.totalPurchases ?? 0) -
      Number(supplier.totalPaid ?? 0),
  );
}

export default function PurchaseSupplierCard({
  supplier,
  loading = false,
  onSelect,
  onAddNew,
}: PurchaseSupplierCardProps) {
  const due = supplier ? getSupplierDue(supplier) : 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-card shadow-sm dark:border-emerald-500/20">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start justify-between gap-4 border-b border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-500/10 dark:bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/15">
            <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <h2 className="text-lg font-bold">Supplier</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Select supplier for this purchase
            </p>
          </div>
        </div>

        {/* Header actions */}

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={onAddNew}
            className="h-9 rounded-xl border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10"
          >
            <Plus className="mr-1.5 h-4 w-4 text-emerald-600" />
            Add
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={onSelect}
            className="h-9 rounded-xl border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10"
          >
            {supplier ? "Change" : "Select"}
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Loading                                                            */}
      {/* ------------------------------------------------------------------ */}

      {loading ? (
        <div className="p-5">
          <div className="flex items-center gap-4 rounded-2xl border bg-muted/20 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-semibold">Loading suppliers...</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please wait while suppliers are loaded.
              </p>
            </div>
          </div>
        </div>
      ) : !supplier ? (
        /* ---------------------------------------------------------------- */
        /* No supplier                                                      */
        /* ---------------------------------------------------------------- */

        <div className="space-y-3 p-5">
          {/* Select existing */}

          <button
            type="button"
            onClick={onSelect}
            className="
              group
              flex
              w-full
              items-center
              justify-between
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-background
              p-5
              text-left
              transition-all
              hover:border-emerald-400
              hover:bg-emerald-50/50
              dark:border-slate-700
              dark:hover:border-emerald-500
              dark:hover:bg-emerald-500/5
            "
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 transition-colors group-hover:bg-emerald-200 dark:bg-emerald-500/15 dark:group-hover:bg-emerald-500/25">
                <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold">Select Supplier</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Search your existing suppliers
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
          </button>

          {/* Add new */}

          <button
            type="button"
            onClick={onAddNew}
            className="
              group
              flex
              w-full
              items-center
              justify-between
              rounded-2xl
              border
              border-dashed
              border-emerald-200
              bg-emerald-50/40
              p-5
              text-left
              transition-all
              hover:border-emerald-400
              hover:bg-emerald-50
              dark:border-emerald-500/20
              dark:bg-emerald-500/5
              dark:hover:border-emerald-500
              dark:hover:bg-emerald-500/10
            "
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/15">
                <Plus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold">Add New Supplier</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Create supplier without leaving this page
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
          </button>
        </div>
      ) : (
        /* ---------------------------------------------------------------- */
        /* Selected supplier                                                */
        /* ---------------------------------------------------------------- */

        <div className="p-5">
          <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            {/* Supplier main info */}

            <div className="flex items-start justify-between gap-4 p-5">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                      {supplier.name}
                    </h3>

                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      Selected
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    {supplier.mobile && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />

                        {supplier.mobile}
                      </span>
                    )}

                    {supplier.supplierCode && (
                      <span className="font-medium">
                        {supplier.supplierCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Due */}

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Current Due
                </p>

                <p
                  className={
                    due > 0
                      ? "mt-1 text-base font-bold text-red-600 dark:text-red-400"
                      : "mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400"
                  }
                >
                  ₹{due.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Bottom action */}

            <div className="border-t border-emerald-200/70 bg-white/50 p-3 dark:border-emerald-500/10 dark:bg-black/10">
              <Button
                type="button"
                variant="ghost"
                onClick={onSelect}
                className="h-10 w-full rounded-xl text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Change Supplier
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
