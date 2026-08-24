"use client";

import { Minus, Package, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Product } from "@/features/products/types/product.types";
import type { PurchaseEditorValues } from "./PurchaseProductEditor";

interface PurchaseEditorSheetProps {
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
}: PurchaseEditorSheetProps) {
  if (!open || !product) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* CALCULATIONS                                                            */
  /* ---------------------------------------------------------------------- */

  const quantity = Math.max(1, Number(values.quantity) || 1);

  const purchasePrice = Math.max(0, Number(values.purchasePrice) || 0);

  const sellingPrice = Math.max(0, Number(values.sellingPrice) || 0);

  const discount = Math.max(0, Number(values.discount) || 0);

  const gstRate = Math.max(0, Number(values.gstRate) || 0);

  const subtotal = quantity * purchasePrice;

  const discountAmount = subtotal * (discount / 100);

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const gstAmount = taxableAmount * (gstRate / 100);

  const total = taxableAmount + gstAmount;

  /* ---------------------------------------------------------------------- */
  /* SAFE NUMBER CHANGE                                                     */
  /* ---------------------------------------------------------------------- */

  function handleNumberChange(
    field: keyof PurchaseEditorValues,
    rawValue: string,
  ) {
    if (rawValue === "") {
      onChange(field, 0);
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      onChange(field, 0);
      return;
    }

    onChange(field, Math.max(0, value));
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* BACKDROP                                                           */}
      {/* ------------------------------------------------------------------ */}

      <button
        type="button"
        aria-label="Close product editor"
        onClick={onClose}
        className="
          fixed
          inset-0
          z-40
          bg-black/50
          backdrop-blur-sm
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* SHEET                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit purchase product" : "Add purchase product"}
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          max-h-[90vh]
          overflow-y-auto
          rounded-t-[30px]
          border-t
          bg-background
          shadow-2xl
        "
      >
        {/* Handle */}

        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-muted" />
        </div>

        <div className="mx-auto w-full max-w-2xl px-4 pb-5 sm:px-6">
          {/* ---------------------------------------------------------------- */}
          {/* HEADER                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="mb-5 flex items-start gap-3">
            {/* Product Image */}

            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>

            {/* Product Information */}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold">{product.name}</h2>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {product.productCode}
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Stock {product.stock}
                </span>

                <span className="rounded-full bg-muted px-2 py-1 text-[10px]">
                  {product.unit}
                </span>

                <span className="rounded-full bg-muted px-2 py-1 text-[10px]">
                  GST {product.tax}%
                </span>
              </div>
            </div>

            {/* Close */}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 shrink-0 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* FORM                                                             */}
          {/* ---------------------------------------------------------------- */}

          <div className="space-y-4">
            {/* Quantity */}

            <div>
              <label className="mb-2 block text-xs font-semibold">
                Quantity
              </label>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onChange("quantity", Math.max(1, quantity - 1))
                  }
                  className="h-11 w-11 shrink-0 rounded-xl"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={values.quantity}
                  onChange={(event) =>
                    handleNumberChange("quantity", event.target.value)
                  }
                  className="
                    h-11
                    rounded-xl
                    text-center
                    font-bold
                  "
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onChange("quantity", quantity + 1)}
                  className="h-11 w-11 shrink-0 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price Grid */}

            <div className="grid grid-cols-2 gap-3">
              {/* Purchase Price */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Purchase Price
                </label>

                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={values.purchasePrice}
                  onChange={(event) =>
                    handleNumberChange("purchasePrice", event.target.value)
                  }
                  className="h-11 rounded-xl font-semibold"
                />
              </div>

              {/* Selling Price */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Selling Price
                </label>

                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={values.sellingPrice}
                  onChange={(event) =>
                    handleNumberChange("sellingPrice", event.target.value)
                  }
                  className="h-11 rounded-xl font-semibold"
                />
              </div>
            </div>

            {/* Discount + GST */}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Discount %
                </label>

                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={values.discount}
                  onChange={(event) =>
                    handleNumberChange("discount", event.target.value)
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  GST %
                </label>

                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={values.gstRate}
                  onChange={(event) =>
                    handleNumberChange("gstRate", event.target.value)
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* CALCULATION SUMMARY                                              */}
            {/* ---------------------------------------------------------------- */}

            <div className="rounded-2xl bg-muted/30 p-4">
              <div className="space-y-2">
                <SummaryRow label="Subtotal" value={subtotal} />

                {discountAmount > 0 && (
                  <SummaryRow
                    label={`Discount (${discount}%)`}
                    value={-discountAmount}
                  />
                )}

                <SummaryRow label={`GST (${gstRate}%)`} value={gstAmount} />

                <div className="my-2 border-t" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>

                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* ACTION                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="sticky bottom-0 -mx-4 border-t bg-background/95 px-4 pb-1 pt-3 backdrop-blur sm:-mx-6 sm:px-6">
              <Button
                type="button"
                onClick={onAdd}
                className="
                  h-12
                  w-full
                  rounded-2xl
                  bg-emerald-600
                  font-semibold
                  shadow-sm
                  hover:bg-emerald-700
                  active:scale-[0.98]
                  dark:bg-emerald-600
                  dark:hover:bg-emerald-700
                "
              >
                <Plus className="mr-2 h-4 w-4" />

                {editing ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SUMMARY ROW                                   */
/* -------------------------------------------------------------------------- */

interface SummaryRowProps {
  label: string;
  value: number;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  const isNegative = value < 0;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>

      <span
        className={
          isNegative
            ? "font-medium text-red-600 dark:text-red-400"
            : "font-medium"
        }
      >
        {isNegative ? "- " : ""}₹{formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CURRENCY                                      */
/* -------------------------------------------------------------------------- */

function formatCurrency(value: number): string {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
