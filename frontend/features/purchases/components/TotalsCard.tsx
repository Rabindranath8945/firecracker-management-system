"use client";

import { Calculator } from "lucide-react";
import type { PurchaseTotals } from "../utils/purchaseCalculation";

interface TotalsCardProps {
  totals: PurchaseTotals;
}

export default function TotalsCard({ totals }: TotalsCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3">
          <Calculator className="size-6 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Purchase Totals</h2>

          <p className="text-sm text-muted-foreground">Live calculation</p>
        </div>
      </div>

      <div className="space-y-3">
        <Row label="Products" value={totals.products} plain />

        <Row label="Quantity" value={totals.quantity} plain />

        <Row label="Subtotal" value={totals.subtotal} />

        <Row label="Discount" value={totals.discount} />

        <Row label="GST" value={totals.gst} />

        <Row label="Transport" value={totals.transport} />

        <div className="mt-3 rounded-2xl bg-primary/5 p-4">
          <Row label="Grand Total" value={totals.grandTotal} bold />
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  value: number | string;
  bold?: boolean;
  plain?: boolean;
}

function Row({ label, value, bold, plain }: RowProps) {
  const displayValue = plain
    ? value
    : label === "Discount" && value === 0
      ? "—"
      : `₹${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

  return (
    <div className="flex items-center justify-between">
      <span
        className={
          bold ? "text-base font-semibold" : "text-sm text-muted-foreground"
        }
      >
        {label}
      </span>

      <span className={bold ? "text-lg font-bold" : "font-medium"}>
        {displayValue}
      </span>
    </div>
  );
}
