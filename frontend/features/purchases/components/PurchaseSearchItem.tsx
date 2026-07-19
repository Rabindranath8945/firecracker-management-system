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
        w-full
        rounded-2xl
        border
        bg-card
        p-4
        text-left
        transition-all
        hover:border-primary
        hover:shadow-md
        active:scale-[0.98]
      "
    >
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-12 w-12 rounded-xl object-cover"
            />
          ) : (
            <Package className="size-6 text-primary" />
          )}
        </div>

        {/* Product Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">{product.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">{product.sku}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
              ₹ {product.purchasePrice}
            </span>

            <span className="rounded-full bg-muted px-2 py-1 text-xs">
              GST {product.gst}%
            </span>

            <span
              className={`rounded-full px-2 py-1 text-xs ${
                lowStock
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              Stock {product.stock}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
    </button>
  );
}
