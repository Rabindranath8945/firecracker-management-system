"use client";

import { PackagePlus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewPurchaseSearchProps {
  value: string;
  onChange: (value: string) => void;
  onAddProduct: () => void;
  loading?: boolean;
}

export default function NewPurchaseSearch({
  value,
  onChange,
  onAddProduct,
  loading = false,
}: NewPurchaseSearchProps) {
  function handleClear() {
    onChange("");
  }

  return (
    <section className="space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Purchase Items
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Search products and add them to this purchase.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />

        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={loading}
          placeholder="Search product or product code..."
          autoComplete="off"
          className="
            h-14
            rounded-2xl
            border-emerald-200
            bg-background
            pl-12
            pr-12
            text-base
            shadow-sm
            transition-all
            focus-visible:border-emerald-500
            focus-visible:ring-2
            focus-visible:ring-emerald-500/20
            dark:border-emerald-500/20
          "
        />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={loading}
            onClick={handleClear}
            className="
              absolute
              right-2
              top-1/2
              h-9
              w-9
              -translate-y-1/2
              rounded-xl
              text-muted-foreground
              hover:bg-emerald-50
              hover:text-emerald-600
              dark:hover:bg-emerald-500/10
            "
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search hint                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-muted-foreground">
          Search by product name or product code
        </p>

        {loading && (
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Loading products...
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ADD NEW PRODUCT                                                     */}
      {/* ------------------------------------------------------------------ */}

      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={onAddProduct}
        className="
          h-11
          w-full
          rounded-2xl
          border-emerald-200
          bg-emerald-50/40
          font-semibold
          text-emerald-700
          shadow-sm
          transition-all
          hover:border-emerald-400
          hover:bg-emerald-50
          hover:text-emerald-700
          dark:border-emerald-500/20
          dark:bg-emerald-500/5
          dark:text-emerald-400
          dark:hover:bg-emerald-500/10
        "
      >
        <PackagePlus className="mr-2 h-4 w-4" />
        Add New Product
      </Button>
    </section>
  );
}
