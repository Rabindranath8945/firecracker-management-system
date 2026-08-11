"use client";

import { CheckCircle2, Printer, Share2, Plus, Receipt, X } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { Sale } from "../../types/Sales.types";

interface PaymentSuccessSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  sale: Sale | null;

  /**
   * Amount collected against customer's previous due.
   *
   * This is NOT part of the new sale grandTotal.
   */
  dueCollected?: number;

  onNewSale: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export default function PaymentSuccessSheet({
  open,
  onOpenChange,
  sale,
  dueCollected = 0,
  onNewSale,
  onPrint,
  onShare,
}: PaymentSuccessSheetProps) {
  if (!sale) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Sale information                                                       */
  /* ---------------------------------------------------------------------- */

  const customerName = sale.customer?.name ?? "Walk-in Customer";

  const paymentMethod = sale.payment?.method ?? "CASH";

  /* ---------------------------------------------------------------------- */
  /* Payment calculation                                                    */
  /* ---------------------------------------------------------------------- */

  const salePaidAmount = sale.paidAmount ?? sale.grandTotal ?? 0;

  const previousDueCollected = Math.max(0, dueCollected);

  /**
   * Total money actually received from the customer.
   *
   * Example:
   *
   * New Sale       ₹218.30
   * Previous Due   ₹900.00
   * ----------------------
   * Total          ₹1118.30
   */
  const totalCollected = salePaidAmount + previousDueCollected;

  const isCredit = sale.payment?.method === "CREDIT";

  const displayAmount = isCredit ? sale.dueAmount : totalCollected;

  const displayAmountLabel = isCredit ? "Amount Due" : "Amount Collected";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          max-h-[95vh]
          overflow-y-auto
          rounded-t-[2rem]
          p-0
        "
      >
        {/* Header */}

        <div className="relative px-5 pb-4 pt-7 text-center">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="
              absolute
              right-5
              top-5
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-slate-100
              text-slate-500
              transition
              hover:bg-slate-200
            "
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Success Icon */}

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-emerald-100
              ring-8
              ring-emerald-50
            "
          >
            <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          </div>

          <h2 className="mt-5 text-2xl font-black tracking-tight">
            Payment Successful
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Invoice created successfully
          </p>
        </div>

        {/* Amount */}

        <div className="px-5">
          <Card
            className="
              overflow-hidden
              rounded-3xl
              border-0
              bg-gradient-to-br
              from-violet-600
              via-violet-500
              to-fuchsia-600
              p-6
              text-white
              shadow-xl
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/75">{displayAmountLabel}</p>

                <h3 className="mt-1 text-4xl font-black">
                  ₹{displayAmount.toLocaleString("en-IN")}
                </h3>
              </div>

              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <Receipt className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
              <div>
                <p className="text-[11px] text-white/65">Invoice No</p>

                <p className="mt-0.5 font-bold">{sale.invoiceNo}</p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-white/65">Sale No</p>

                <p className="mt-0.5 font-bold">{sale.saleNo}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sale Details */}

        <div className="space-y-3 px-5 pt-5">
          <Card className="rounded-3xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer</span>

              <span className="max-w-[60%] truncate text-right font-semibold">
                {customerName}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment</span>

              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                {paymentMethod}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Items</span>

              <span className="font-semibold">{sale.items?.length ?? 0}</span>
            </div>
          </Card>

          {/* Status */}

          <Card className="rounded-3xl border p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold">Sale Status</p>

            <div className="space-y-3">
              <StatusRow label="Payment" value="Completed" />

              <StatusRow label="Invoice" value="Created" />

              <StatusRow label="Stock" value="Updated" />
            </div>
          </Card>
        </div>

        {/* Actions */}

        <div className="space-y-3 px-5 pb-8 pt-5">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrint}
              className="h-12 rounded-2xl font-semibold"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onShare}
              className="h-12 rounded-2xl font-semibold"
            >
              <Share2 className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          <Button
            type="button"
            onClick={onNewSale}
            className="
              h-14
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              via-violet-500
              to-fuchsia-600
              text-base
              font-bold
              shadow-lg
              transition
              hover:shadow-xl
              active:scale-[0.98]
            "
          >
            <Plus className="mr-2 h-5 w-5" />
            Start New Sale
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface StatusRowProps {
  label: string;
  value: string;
}

function StatusRow({ label, value }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-emerald-100
          "
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>

        <span className="text-sm font-medium">{label}</span>
      </div>

      <span className="text-sm font-semibold text-emerald-600">{value}</span>
    </div>
  );
}
