"use client";

import { ChevronRight, Package } from "lucide-react";

import type { Product } from "@/features/products/types/product.types";

interface PurchaseSearchItemProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function PurchaseSearchItem({
  product,
  onSelect,
}: PurchaseSearchItemProps) {
  const lowStock = product.stock <= product.minimumStock;

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        bg-card
        px-3
        py-3
        text-left
        shadow-sm
        transition-all
        hover:border-emerald-400
        hover:bg-emerald-50/30
        hover:shadow-md
        active:scale-[0.99]
        dark:hover:border-emerald-500
        dark:hover:bg-emerald-500/5
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* Product Image                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Product Information                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{product.name}</h3>

          {lowStock && (
            <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
              Low
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {product.productCode}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          {/* Purchase Price */}

          <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
            ₹{product.purchasePrice.toLocaleString("en-IN")}
          </span>

          {/* GST */}

          <span className="text-[10px] text-muted-foreground">
            GST {product.tax}%
          </span>

          {/* Stock */}

          <span
            className={
              lowStock
                ? "text-[10px] font-medium text-red-600 dark:text-red-400"
                : "text-[10px] font-medium text-muted-foreground"
            }
          >
            Stock {product.stock}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Select Arrow                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/60 transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/15">
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
      </div>
    </button>
  );
}
