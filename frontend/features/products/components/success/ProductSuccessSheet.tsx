"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Package,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ProductSuccessSheetProps {
  open: boolean;
  productName: string;
  sku: string;
  onOpenChange: (open: boolean) => void;
  onAddAnother: () => void;
}

export default function ProductSuccessSheet({
  open,
  productName,
  sku,
  onOpenChange,
  onAddAnother,
}: ProductSuccessSheetProps) {
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-8 pt-5">
        {/* Drag Handle */}

        <div className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-slate-300" />

        {/* Close */}

        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-5 top-5 rounded-full p-2 transition hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero */}

        <div className="flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-xl">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>

          <h2 className="mt-6 text-3xl font-bold">
            Product Added Successfully
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Your inventory has been updated successfully.
          </p>
        </div>

        {/* Product Summary */}

        <div className="mt-8 rounded-2xl border bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <Package className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{productName}</h3>

              <p className="text-sm text-muted-foreground">SKU : {sku}</p>
            </div>
          </div>
        </div>

        {/* Status */}

        <div className="mt-6 rounded-2xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm">Product created successfully</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm">Available for Purchase & Sales</span>
          </div>
        </div>

        {/* Recommended */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Recommended Next Step
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Create Purchase</h4>

              <p className="text-sm text-muted-foreground">
                Add stock for this product.
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-blue-700" />
          </div>
        </div>

        {/* Actions */}

        <div className="mt-8 space-y-3">
          <Button
            className="h-12 w-full rounded-2xl text-base"
            onClick={onAddAnother}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Another Product
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl"
            onClick={() => router.push("/products")}
          >
            <Package className="mr-2 h-5 w-5" />
            View Products
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl"
            onClick={() => router.push("/purchases/new")}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Create Purchase
          </Button>

          <Button
            variant="ghost"
            className="h-12 w-full rounded-2xl"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
