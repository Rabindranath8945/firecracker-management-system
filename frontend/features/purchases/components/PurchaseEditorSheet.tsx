"use client";

import { Minus, Package, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Product } from "@/features/products/types/product.types";
import type { PurchaseEditorValues } from "./PurchaseProductEditor";

interface Props {
  open: boolean;

  editing: boolean;

  product: Product | null;

  values: PurchaseEditorValues;

  onClose: () => void;

  onChange: (field: keyof PurchaseEditorValues, value: number) => void;

  onAdd: () => void;
}

export default function PurchaseEditorSheet({
  open,
  editing,
  product,
  values,
  onClose,
  onChange,
  onAdd,
}: Props) {
  if (!open || !product) return null;

  const subtotal = values.quantity * values.purchasePrice;

  const discountAmount = subtotal * (values.discount / 100);

  const taxable = subtotal - discountAmount;

  const gstAmount = taxable * (values.gstRate / 100);

  const total = taxable + gstAmount;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-background shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-14 rounded-full bg-muted" />
        </div>

        <div className="px-5 pb-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <Package className="h-7 w-7 text-primary" />
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold">{product.name}</h2>

                <p className="text-sm text-muted-foreground">{product.sku}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
                    Stock {product.stock}
                  </span>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    {product.unit}
                  </span>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    GST {product.gst}%
                  </span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  onChange("quantity", Math.max(1, values.quantity - 1))
                }
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                autoFocus
                className="text-center text-lg font-bold"
                value={values.quantity}
                onChange={(e) => onChange("quantity", Number(e.target.value))}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onChange("quantity", values.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Purchase Price */}
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium">Purchase Price</label>

            <Input
              type="number"
              value={values.purchasePrice}
              className="text-lg font-semibold"
              onChange={(e) =>
                onChange("purchasePrice", Number(e.target.value))
              }
            />
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-2xl bg-muted/40 p-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span>GST</span>

              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>

              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Button */}
          <div className="sticky bottom-0 mt-6 bg-background pt-4">
            <Button
              type="button"
              className="h-14 w-full rounded-2xl text-base"
              onClick={onAdd}
            >
              <Plus className="mr-2 h-5 w-5" />
              {editing ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
