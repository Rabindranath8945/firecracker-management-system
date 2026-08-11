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
      {/* Header */}

      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-violet-100
          "
        >
          <Package2 className="h-5 w-5 text-violet-700" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {product.name}
          </h3>

          <p className="text-[11px] text-slate-500">{product.productCode}</p>
        </div>
      </div>

      {/* Price */}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xl font-black text-slate-900">
          ₹{product.sellingPrice}
        </span>

        <span
          className={`
            rounded-full
            px-2
            py-0.5
            text-[10px]
            font-semibold
            ${
              product.stock === 0
                ? "bg-red-100 text-red-700"
                : product.stock <= product.minimumStock
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
            }
          `}
        >
          {product.stock}
        </span>
      </div>

      {/* Quantity */}

      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-100 p-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 rounded-lg"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <span className="text-sm font-bold">{qty}</span>

        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 rounded-lg"
          onClick={() => setQty((q) => q + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Add */}

      <Button
        disabled={outOfStock}
        onClick={() => onAdd(product, qty)}
        className="
          mt-3
          h-8
          w-full
          rounded-xl
          bg-violet-600
          text-xs
          font-semibold
          hover:bg-violet-700
        "
      >
        {outOfStock ? "Out" : "Add"}
      </Button>
    </Card>
  );
}
