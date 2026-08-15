"use client";

import { Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Product } from "@/features/products/types/product.types";

interface FrequentProductsProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function FrequentProducts({
  products,
  onSelect,
}: FrequentProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* Header */}

      <div>
        <h2 className="text-base font-semibold">Frequently Purchased</h2>

        <p className="text-xs text-muted-foreground">
          Quick add products to this purchase
        </p>
      </div>

      {/* Products */}

      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
        {products.map((product) => (
          <div
            key={product._id}
            className="
              group
              flex
              min-w-[190px]
              max-w-[190px]
              flex-col
              rounded-2xl
              border
              bg-card
              p-3
              shadow-sm
              transition-all
              hover:border-emerald-300
              hover:shadow-md
              dark:hover:border-emerald-500/30
            "
          >
            {/* Product */}

            <button
              type="button"
              onClick={() => onSelect(product)}
              className="
                flex
                min-w-0
                items-center
                gap-3
                text-left
                outline-none
              "
            >
              {/* Icon / Image */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-emerald-50
                  dark:bg-emerald-500/10
                "
              >
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

              {/* Product Info */}

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                  {product.name}
                </h3>

                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {product.productCode}
                </p>
              </div>
            </button>

            {/* Bottom */}

            <div className="mt-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Purchase</p>

                <p className="truncate text-sm font-bold">
                  ₹
                  {Number(product.purchasePrice || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <Button
                type="button"
                size="icon"
                tabIndex={-1}
                onClick={() => onSelect(product)}
                className="
                  h-8
                  w-8
                  shrink-0
                  rounded-xl
                  bg-emerald-600
                  hover:bg-emerald-700
                  active:scale-95
                "
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
