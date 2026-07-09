"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Product } from "../../types/product.types";

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const lowStock = product.stock <= product.minimumStock;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="w-full rounded-2xl border bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]">
        <div className="flex items-center gap-3">
          {/* Image */}

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-14 w-14 object-contain"
              />
            ) : (
              <span className="text-2xl">🎆</span>
            )}
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">{product.name}</h3>

            <p className="mt-1 text-xs text-slate-500">SKU : {product.sku}</p>

            <span className="mt-2 inline-flex rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
              {product.category}
            </span>
          </div>

          {/* Right */}

          <div className="flex flex-col items-end gap-2">
            <div className="text-right text-sm">
              <p>
                <span className="font-medium">Cost</span> ₹
                {product.purchasePrice}
              </p>

              <p>
                <span className="font-medium">Sale</span> ₹
                {product.sellingPrice}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                lowStock
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lowStock ? `Low ${product.stock}` : `Stock ${product.stock}`}
            </span>
          </div>

          <ChevronRight size={18} className="text-slate-400" />
        </div>
      </div>
    </Link>
  );
}
