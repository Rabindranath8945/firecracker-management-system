"use client";

import { Boxes, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductSummaryBarProps {
  totalProducts: number;
  updatedAt?: string;
  onRefresh?: () => void;
}

export default function ProductSummaryBar({
  totalProducts,
  updatedAt = "Updated just now",
  onRefresh,
}: ProductSummaryBarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Boxes className="h-5 w-5 text-slate-600" />

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{totalProducts}</span>

          <span className="text-slate-500">Products</span>

          <span className="text-slate-300">•</span>

          <span className="text-sm text-slate-500">{updatedAt}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        className="rounded-full"
      >
        <RefreshCw className="h-5 w-5" />
      </Button>
    </div>
  );
}
