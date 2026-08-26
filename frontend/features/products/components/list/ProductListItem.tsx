"use client";

import Link from "next/link";
import { Eye, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Product } from "../../types/product.types";

interface ProductListItemProps {
  product: Product;
  onDelete: (product: Product) => void;
}

export default function ProductListItem({
  product,
  onDelete,
}: ProductListItemProps) {
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= product.minimumStock;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
      <div className="flex gap-3">
        {/* Product Image */}

        <Link
          href={`/products/view?id=${product._id}`}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
        >
          <Package className="h-7 w-7 text-slate-500" />
        </Link>

        {/* Product Details */}

        <div className="min-w-0 flex-1">
          {/* Header */}

          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/view?id=${product._id}`}
              className="min-w-0 flex-1"
            >
              <h3 className="truncate text-[15px] font-semibold text-slate-900">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-1">
              <Link href={`/products/view?id=${product._id}`}>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  onDelete(product);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Code + Stock */}

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-slate-500">{product.productCode}</p>

            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                outOfStock
                  ? "bg-red-100 text-red-700"
                  : lowStock
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              📦 {product.stock}
            </span>
          </div>

          {/* Category */}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.category && (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                {product.category.name}
              </span>
            )}

            {product.subCategory && (
              <span className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700">
                {product.subCategory.name}
              </span>
            )}
          </div>

          {/* Price */}

          <div className="mt-3 flex items-end justify-between">
            <span className="text-lg font-bold text-slate-900">
              ₹{product.sellingPrice.toLocaleString("en-IN")}
            </span>

            <span className="text-xs text-slate-500">
              Cost ₹{product.purchasePrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
