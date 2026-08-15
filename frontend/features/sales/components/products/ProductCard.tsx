"use client";

import { useState } from "react";
import { Minus, Plus, Package2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Product } from "@/features/products/types/product.types";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [qty, setQty] = useState(1);

  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= product.minimumStock;

  const itemTotal = product.sellingPrice * qty;

  const decreaseQty = () => {
    setQty((current) => Math.max(1, current - 1));
  };

  const increaseQty = () => {
    setQty((current) => Math.min(product.stock, current + 1));
  };

  return (
    <Card
      className="
        rounded-2xl
        border
        p-3
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Product */}

      <div className="flex items-center gap-2.5">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-violet-100
          "
        >
          <Package2 className="h-4.5 w-4.5 text-violet-700" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {product.name}
            </h3>

            <span className="shrink-0 text-base font-black text-slate-900">
              ₹{product.sellingPrice}
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-[10px]">
            <span className="font-medium text-slate-500">
              {product.productCode}
            </span>

            <span className="text-slate-300">•</span>

            <span className="text-slate-500">PCS</span>

            <span className="text-slate-300">•</span>

            <span
              className={
                outOfStock
                  ? "font-semibold text-red-600"
                  : lowStock
                    ? "font-semibold text-orange-600"
                    : "font-semibold text-emerald-600"
              }
            >
              {outOfStock
                ? "Out of Stock"
                : lowStock
                  ? `Low Stock ${product.stock}`
                  : `Stock ${product.stock}`}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Sale Controls */}

      <div className="mt-2.5 flex items-center gap-2">
        {/* Quantity */}

        <div
          className="
            flex
            h-9
            flex-1
            items-center
            justify-between
            rounded-xl
            bg-slate-100
            px-1
          "
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={qty <= 1 || outOfStock}
            onClick={decreaseQty}
            className="
              h-7
              w-7
              rounded-lg
              text-slate-600
              hover:bg-white
            "
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          <span className="text-xs font-bold text-slate-900">Qty {qty}</span>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={qty >= product.stock || outOfStock}
            onClick={increaseQty}
            className="
              h-7
              w-7
              rounded-lg
              text-slate-600
              hover:bg-white
            "
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Total */}

        <div className="min-w-[58px] text-right">
          <p className="text-[9px] text-slate-400">Total</p>

          <p className="text-sm font-black text-slate-900">₹{itemTotal}</p>
        </div>

        {/* Add */}

        <Button
          type="button"
          disabled={outOfStock}
          onClick={() => onAdd(product, qty)}
          className="
            h-9
            min-w-[62px]
            rounded-xl
            bg-violet-600
            px-3
            text-[11px]
            font-bold
            hover:bg-violet-700
          "
        >
          {outOfStock ? "Out" : "ADD"}
        </Button>
      </div>
    </Card>
  );
}
