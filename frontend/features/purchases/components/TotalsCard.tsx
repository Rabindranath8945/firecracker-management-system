"use client";

import { Calculator } from "lucide-react";

import type { PurchaseTotals } from "../utils/purchaseCalculation";

interface TotalsCardProps {
  totals: PurchaseTotals;
}

export default function TotalsCard({ totals }: TotalsCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-card shadow-sm dark:border-emerald-500/20">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
          <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div>
          <h2 className="text-base font-bold">Purchase Totals</h2>

          <p className="text-[11px] text-muted-foreground">Live calculation</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Calculation                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2.5 p-5">
        <Row label="Products" value={totals.products} plain />

        <Row label="Quantity" value={totals.quantity} plain />

        <div className="my-2 border-t" />

        <Row label="Subtotal" value={totals.subtotal} />

        <Row label="Discount" value={totals.discount} />

        <Row label="GST" value={totals.gst} />

        <Row label="Transport" value={totals.transport} />

        {/* Grand Total */}

        <div className="mt-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Grand Total
              </p>

              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Final purchase amount
              </p>
            </div>

            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{formatCurrency(totals.grandTotal)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  ROW                                       */
/* -------------------------------------------------------------------------- */

interface RowProps {
  label: string;
  value: number | string;
  plain?: boolean;
}

function Row({ label, value, plain = false }: RowProps) {
  const numericValue = Number(value);

  let displayValue: string;

  if (plain) {
    displayValue = String(value);
  } else if (label === "Discount" && numericValue === 0) {
    displayValue = "—";
  } else {
    displayValue = `₹${formatCurrency(numericValue)}`;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-sm font-semibold">{displayValue}</span>
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
