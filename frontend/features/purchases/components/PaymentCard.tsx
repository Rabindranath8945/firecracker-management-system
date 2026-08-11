"use client";

import { CreditCard } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { PurchaseForm } from "../schemas/purchase.schema";

interface PaymentCardProps {
  grandTotal: number;
}

function getPaymentStatus(
  paid: number,
  total: number,
): "PAID" | "PARTIAL" | "DUE" {
  if (paid <= 0) return "DUE";

  if (paid >= total) return "PAID";

  return "PARTIAL";
}

export default function PaymentCard({ grandTotal }: PaymentCardProps) {
  const { control, setValue } = useFormContext<PurchaseForm>();
  const hasInvoice = grandTotal > 0;

  const paidAmount =
    useWatch({
      control,
      name: "paidAmount",
    }) ?? 0;

  const paymentStatus = getPaymentStatus(paidAmount, grandTotal);

  const dueAmount = Math.max(grandTotal - paidAmount, 0);

  return (
    <>
      {hasInvoice ? (
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          {/* Header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3">
              <CreditCard className="size-6 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Payment</h2>

              <p className="text-sm text-muted-foreground">
                Payment Information
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Status */}

            {/* Paid */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Paid Amount
              </label>
              <Controller
                control={control}
                name="paidAmount"
                render={({ field }) => (
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="Enter paid amount"
                    value={field.value === 0 ? "" : String(field.value)}
                    onChange={(e) => {
                      let value =
                        e.target.value === "" ? 0 : Number(e.target.value);

                      if (value > grandTotal) {
                        value = grandTotal;
                      }

                      field.onChange(value);
                    }}
                  />
                )}
              />
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={grandTotal <= 0}
                  variant={paidAmount >= grandTotal ? "default" : "outline"}
                  className="h-9 rounded-xl px-4 transition-all duration-200 active:scale-95"
                  onClick={() =>
                    setValue("paidAmount", grandTotal, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                >
                  Full
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={grandTotal <= 0}
                  variant={
                    paidAmount > 0 && paidAmount < grandTotal
                      ? "default"
                      : "outline"
                  }
                  className="h-9 rounded-xl px-4 transition-all duration-200 active:scale-95"
                  onClick={() =>
                    setValue(
                      "paidAmount",
                      Number((grandTotal / 2).toFixed(2)),
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      },
                    )
                  }
                >
                  50%
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant={paidAmount === 0 ? "default" : "outline"}
                  className="h-9 rounded-xl px-4 transition-all duration-200 active:scale-95"
                  onClick={() =>
                    setValue("paidAmount", 0, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-3xl border bg-muted/30 p-5">
              <span className="font-medium">Payment Status</span>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : paymentStatus === "PARTIAL"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {paymentStatus}
              </span>
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-muted/40 p-4">
              <Row label="Invoice Amount" value={grandTotal} />

              <Row label="Paid Amount" value={paidAmount} />

              <div className="my-4 border-t" />

              <div
                className={`rounded-2xl p-4 ${
                  dueAmount === 0 ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <Row
                  label="Balance Due"
                  value={dueAmount}
                  bold
                  valueClassName={
                    dueAmount === 0 ? "text-green-600" : "text-red-600"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed p-8 text-center">
          <CreditCard className="mx-auto mb-3 size-10 text-muted-foreground" />

          <h3 className="font-semibold">No Payment Required Yet</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Add products to calculate invoice payment.
          </p>
        </div>
      )}
    </>
  );
}

interface RowProps {
  label: string;
  value: number;
  bold?: boolean;
  valueClassName?: string;
}

function Row({ label, value, bold, valueClassName }: RowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>

      <span
        className={`${bold ? "text-lg font-bold" : "font-medium"} ${
          valueClassName ?? ""
        }`}
      >
        ₹
        {value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}
