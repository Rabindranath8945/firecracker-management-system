"use client";

import { Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Product } from "@/features/products/types/product.types";

export interface PurchaseEditorValues {
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  discount: number;
  gstRate: number;
}

interface PurchaseProductEditorProps {
  product: Product | null;
  values: PurchaseEditorValues;
  onChange: (field: keyof PurchaseEditorValues, value: number) => void;
  onAdd: () => void;
}

export default function PurchaseProductEditor({
  product,
  values,
  onChange,
  onAdd,
}: PurchaseProductEditorProps) {
  if (!product) return null;

  const subtotal = values.quantity * values.purchasePrice;
  const discountAmount = (subtotal * values.discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * values.gstRate) / 100;
  const total = taxableAmount + gstAmount;

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
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

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{product.name}</h3>

          <p className="text-sm text-muted-foreground">
            {product.sku} • Stock {product.stock} {product.unit}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
              GST {product.gst}%
            </span>

            <span className="rounded-full bg-muted px-2 py-1 text-xs">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Quantity"
          value={values.quantity}
          onChange={(v) => onChange("quantity", v)}
        />

        <Field
          label="Purchase Price"
          value={values.purchasePrice}
          onChange={(v) => onChange("purchasePrice", v)}
        />

        <Field
          label="Selling Price"
          value={values.sellingPrice}
          onChange={(v) => onChange("sellingPrice", v)}
        />

        <Field
          label="Discount %"
          value={values.discount}
          onChange={(v) => onChange("discount", v)}
        />

        <Field
          label="GST %"
          value={values.gstRate}
          onChange={(v) => onChange("gstRate", v)}
        />
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-2xl bg-muted/40 p-4">
        <SummaryRow label="Subtotal" value={subtotal} />

        <SummaryRow label="Discount" value={discountAmount} />

        <SummaryRow label="GST" value={gstAmount} />

        <div className="mt-3 border-t pt-3">
          <SummaryRow label="Grand Total" value={total} bold />
        </div>
      </div>

      {/* Button */}
      <Button
        type="button"
        onClick={onAdd}
        className="mt-6 h-12 w-full rounded-2xl"
      >
        <Plus className="mr-2 size-4" />
        Add Product
      </Button>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: number;
  bold?: boolean;
}

function SummaryRow({ label, value, bold = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>

      <span className={bold ? "text-lg font-bold" : "font-medium"}>
        ₹{value.toFixed(2)}
      </span>
    </div>
  );
}
