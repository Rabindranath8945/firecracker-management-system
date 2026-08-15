"use client";

import {
  Banknote,
  Building2,
  Check,
  CreditCard,
  IndianRupee,
  Landmark,
  WalletCards,
} from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { PurchaseForm } from "../schemas/purchase.schema";

type PaymentMethod = "CASH" | "UPI" | "BANK" | "CARD" | "CHEQUE" | "CREDIT";

type PaymentStatus = "PAID" | "PARTIAL" | "DUE";

interface PaymentCardProps {
  supplierCurrentDue: number;
}

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  icon: typeof Banknote;
}[] = [
  {
    value: "CASH",
    label: "Cash",
    icon: Banknote,
  },
  {
    value: "UPI",
    label: "UPI",
    icon: WalletCards,
  },
  {
    value: "BANK",
    label: "Bank",
    icon: Landmark,
  },
  {
    value: "CARD",
    label: "Card",
    icon: CreditCard,
  },
  {
    value: "CHEQUE",
    label: "Cheque",
    icon: Building2,
  },
  {
    value: "CREDIT",
    label: "Credit",
    icon: CreditCard,
  },
];

/* -------------------------------------------------------------------------- */
/* PAYMENT STATUS                                                             */
/* -------------------------------------------------------------------------- */

function getPaymentStatus(paid: number, total: number): PaymentStatus {
  if (total <= 0 || paid <= 0) {
    return "DUE";
  }

  if (paid >= total) {
    return "PAID";
  }

  return "PARTIAL";
}

/* -------------------------------------------------------------------------- */
/* CURRENCY                                                                   */
/* -------------------------------------------------------------------------- */

function formatCurrency(value: number): string {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function roundCurrency(value: number): number {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/* -------------------------------------------------------------------------- */
/* GRAND TOTAL                                                                */
/* -------------------------------------------------------------------------- */

function calculateGrandTotal(
  items: PurchaseForm["items"],
  transportCharge: number,
): number {
  const itemsTotal = items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;

    const purchasePrice = Number(item.purchasePrice) || 0;

    const discount = Number(item.discount) || 0;

    const gstRate = Number(item.gstRate) || 0;

    const subtotal = Math.max(quantity * purchasePrice - discount, 0);

    const gstAmount = subtotal * (gstRate / 100);

    const itemTotal = subtotal + gstAmount;

    return total + itemTotal;
  }, 0);

  return Math.max(itemsTotal + (Number(transportCharge) || 0), 0);
}

/* -------------------------------------------------------------------------- */
/* PAYMENT CARD                                                               */
/* -------------------------------------------------------------------------- */

export default function PaymentCard({ supplierCurrentDue }: PaymentCardProps) {
  const { control, setValue } = useFormContext<PurchaseForm>();

  /* ------------------------------------------------------------------------ */
  /* WATCH PURCHASE DATA                                                      */
  /* ------------------------------------------------------------------------ */

  const items = useWatch({
    control,
    name: "items",
  });

  const transportCharge = useWatch({
    control,
    name: "transportCharge",
  });

  const paidAmount = Number(
    useWatch({
      control,
      name: "paidAmount",
    }) ?? 0,
  );

  const paymentMethod = useWatch({
    control,
    name: "paymentMethod",
  });

  /* ------------------------------------------------------------------------ */
  /* CALCULATE PURCHASE                                                       */
  /* ------------------------------------------------------------------------ */

  const grandTotal = calculateGrandTotal(
    items ?? [],
    Number(transportCharge ?? 0),
  );

  /* ------------------------------------------------------------------------ */
  /* SUPPLIER PREVIOUS DUE                                                    */
  /* ------------------------------------------------------------------------ */

  const currentDue = Math.max(Number(supplierCurrentDue || 0), 0);

  /*
   * Current purchase
   * +
   * Previous supplier due
   * =
   * Total payable
   */
  const totalPayable = roundCurrency(grandTotal + currentDue);

  /* ------------------------------------------------------------------------ */
  /* PAYMENT CALCULATIONS                                                     */
  /* ------------------------------------------------------------------------ */

  /*
   * Payment can now cover:
   *
   * 1. Current purchase
   * 2. Previous supplier due
   */
  const safePaidAmount = roundCurrency(
    Math.min(Math.max(paidAmount, 0), totalPayable),
  );

  /*
   * Amount allocated to this purchase.
   *
   * Current purchase is paid first.
   */
  const purchasePaidAmount = roundCurrency(
    Math.min(safePaidAmount, grandTotal),
  );

  /*
   * Remaining payment is allocated to previous supplier due.
   */
  const previousDuePaidAmount = roundCurrency(
    Math.min(Math.max(safePaidAmount - grandTotal, 0), currentDue),
  );

  /*
   * Remaining due of this purchase.
   */
  const purchaseDue = roundCurrency(
    Math.max(grandTotal - purchasePaidAmount, 0),
  );

  /*
   * Remaining previous supplier due.
   */
  const previousDueRemaining = roundCurrency(
    Math.max(currentDue - previousDuePaidAmount, 0),
  );

  /*
   * Final supplier due after this purchase/payment.
   */
  const newSupplierDue = roundCurrency(
    Math.max(totalPayable - safePaidAmount, 0),
  );

  /*
   * Overall payment status.
   *
   * This now considers both:
   *
   * Current Purchase + Previous Due
   */
  const paymentStatus = getPaymentStatus(safePaidAmount, totalPayable);

  /* ------------------------------------------------------------------------ */
  /* UPDATE PAID AMOUNT                                                       */
  /* ------------------------------------------------------------------------ */

  function updatePaidAmount(value: number) {
    const safeValue = roundCurrency(
      Math.max(0, Math.min(Number(value) || 0, totalPayable)),
    );

    const status = getPaymentStatus(safeValue, totalPayable);

    setValue("paidAmount", safeValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setValue("paymentStatus", status, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    /*
     * Nothing paid = credit purchase.
     */
    if (safeValue === 0) {
      setValue("paymentMethod", "CREDIT", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }

  /* ------------------------------------------------------------------------ */
  /* PAYMENT METHOD                                                           */
  /* ------------------------------------------------------------------------ */

  function selectPaymentMethod(method: PaymentMethod) {
    /*
     * Credit means:
     *
     * Paid = ₹0
     * Status = DUE
     */
    if (method === "CREDIT") {
      setValue("paidAmount", 0, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setValue("paymentMethod", "CREDIT", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setValue("paymentStatus", "DUE", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      return;
    }

    /*
     * Selecting payment method does not
     * automatically change payment amount.
     */
    setValue("paymentMethod", method, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (paidAmount === 0) {
      setValue("paymentStatus", "DUE", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }

  /* ------------------------------------------------------------------------ */
  /* NO PRODUCTS                                                              */
  /* ------------------------------------------------------------------------ */

  if (grandTotal <= 0) {
    return (
      <section className="rounded-3xl border border-dashed bg-muted/20 p-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <CreditCard className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="mt-3 text-sm font-bold">Payment</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Add products to calculate the payment amount.
        </p>
      </section>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* PAYMENT CARD                                                             */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-card shadow-sm dark:border-emerald-500/20">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
          <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div>
          <h2 className="text-base font-bold">Payment</h2>

          <p className="text-[11px] text-muted-foreground">
            Payment information
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* ---------------------------------------------------------------- */}
        {/* PURCHASE TOTAL                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Purchase Amount
            </span>

            <span className="text-lg font-bold">
              ₹{formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PAID AMOUNT                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="purchase-paid-amount"
              className="text-sm font-semibold"
            >
              Paid Amount
            </label>

            <span className="text-[10px] text-muted-foreground">
              Total ₹{formatCurrency(totalPayable)}
            </span>
          </div>

          <Controller
            control={control}
            name="paidAmount"
            render={({ field }) => (
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />

                <Input
                  id="purchase-paid-amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  max={totalPayable}
                  placeholder="0.00"
                  value={field.value === 0 ? "" : String(field.value)}
                  onChange={(event) => {
                    updatePaidAmount(Number(event.target.value));
                  }}
                  className="
                    h-12
                    rounded-2xl
                    border-emerald-200
                    pl-9
                    focus-visible:border-emerald-500
                    focus-visible:ring-emerald-500/20
                    dark:border-emerald-500/20
                  "
                />
              </div>
            )}
          />

          {/* Quick amounts */}

          <div className="mt-2.5 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={safePaidAmount === totalPayable ? "default" : "outline"}
              onClick={() => {
                updatePaidAmount(totalPayable);
              }}
              className="h-8 rounded-xl px-3 text-xs"
            >
              Full
            </Button>

            <Button
              type="button"
              size="sm"
              variant={
                safePaidAmount > 0 && safePaidAmount < totalPayable
                  ? "default"
                  : "outline"
              }
              onClick={() => {
                updatePaidAmount(Number((totalPayable / 2).toFixed(2)));
              }}
              className="h-8 rounded-xl px-3 text-xs"
            >
              50%
            </Button>

            <Button
              type="button"
              size="sm"
              variant={safePaidAmount === 0 ? "default" : "outline"}
              onClick={() => {
                updatePaidAmount(0);
              }}
              className="h-8 rounded-xl px-3 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PAYMENT METHOD                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <div className="mb-3">
            <p className="text-sm font-semibold">Payment Method</p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Select how you paid the supplier.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;

              const selected = paymentMethod === method.value;

              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => selectPaymentMethod(method.value)}
                  className={cn(
                    "relative flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 transition-all",

                    selected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border-border bg-background hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5",
                  )}
                >
                  {selected && (
                    <span className="absolute right-2 top-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </span>
                  )}

                  <Icon className="h-5 w-5" />

                  <span className="text-[11px] font-semibold">
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PAYMENT STATUS                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-between rounded-2xl border bg-muted/20 px-4 py-3">
          <div>
            <p className="text-xs font-medium">Payment Status</p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Automatically calculated from paid amount
            </p>
          </div>

          <span
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold",

              paymentStatus === "PAID" &&
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

              paymentStatus === "PARTIAL" &&
                "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

              paymentStatus === "DUE" &&
                "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
            )}
          >
            {paymentStatus}
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PURCHASE SUMMARY                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-2xl bg-muted/30 p-4">
          <PaymentRow label="Purchase Amount" value={grandTotal} />

          <PaymentRow label="Paid Now" value={safePaidAmount} />

          <PaymentRow label="Purchase Paid" value={purchasePaidAmount} />

          <PaymentRow label="Purchase Due" value={purchaseDue} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SUPPLIER BALANCE                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
          <div className="mb-3">
            <p className="text-sm font-bold">Supplier Balance</p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Balance after this purchase
            </p>
          </div>

          <PaymentRow label="Current Supplier Due" value={currentDue} />

          <PaymentRow label="Total Payable" value={totalPayable} />

          <PaymentRow label="Previous Due Paid" value={previousDuePaidAmount} />

          <PaymentRow
            label="Previous Due Remaining"
            value={previousDueRemaining}
          />

          <div className="my-3 border-t border-emerald-200 dark:border-emerald-500/20" />

          <div
            className={cn(
              "rounded-2xl p-4",

              newSupplierDue > 0
                ? "bg-red-50 dark:bg-red-500/10"
                : "bg-emerald-50 dark:bg-emerald-500/10",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold">New Supplier Due</p>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  After this payment
                </p>
              </div>

              <p
                className={cn(
                  "text-lg font-bold",

                  newSupplierDue > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400",
                )}
              >
                ₹{formatCurrency(newSupplierDue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* PAYMENT ROW                                                                */
/* -------------------------------------------------------------------------- */

interface PaymentRowProps {
  label: string;
  value: number;
}

function PaymentRow({ label, value }: PaymentRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-sm font-semibold">₹{formatCurrency(value)}</span>
    </div>
  );
}
