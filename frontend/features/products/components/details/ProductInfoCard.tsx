"use client";

import { Card, CardContent } from "@/components/ui/card";

import type { Product } from "../../types/product.types";

interface ProductInfoCardProps {
  product: Product;
}

export default function ProductInfoCard({ product }: ProductInfoCardProps) {
  const info = [
    {
      label: "Product Code",
      value: product.productCode,
    },
    {
      label: "Category",
      value:
        typeof product.category === "string"
          ? product.category
          : (product.category?.name ?? "-"),
    },
    {
      label: "Sub Category",
      value:
        typeof product.subCategory === "string"
          ? product.subCategory
          : (product.subCategory?.name ?? "-"),
    },
    {
      label: "Brand",
      value: product.brand || "-",
    },
    {
      label: "Barcode",
      value: product.barcode || "-",
    },
    {
      label: "Unit",
      value: product.unit,
    },
    {
      label: "HSN Code",
      value: product.hsnCode || "-",
    },
    {
      label: "GST",
      value: `${product.tax}%`,
    },
    {
      label: "Description",
      value: product.description || "-",
    },
  ];

  return (
    <Card className="rounded-3xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">
          Product Information
        </h2>

        <div className="space-y-4">
          {info.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-5 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
            >
              <span className="text-sm font-medium text-slate-500">
                {item.label}
              </span>

              <span className="max-w-[60%] text-right text-sm font-semibold text-slate-900 break-words">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
