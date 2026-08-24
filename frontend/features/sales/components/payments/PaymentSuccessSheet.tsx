"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Printer,
  Share2,
  Plus,
  Receipt,
  X,
  ChevronRight,
} from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { Sale } from "../../types/Sales.types";
import { useSaleStore } from "../../store/useSaleStore";

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

  const router = useRouter();

  const customerName = sale.customer?.name ?? "Walk-in Customer";

  const paymentMethod = sale.payment?.method ?? "CASH";

  /* ---------------------------------------------------------------------- */
  /* Payment calculation                                                    */
  /* ---------------------------------------------------------------------- */

  const salePaidAmount = sale.paidAmount ?? sale.grandTotal ?? 0;

  const previousDueCollected = Math.max(0, dueCollected);

  const totalCollected = salePaidAmount + previousDueCollected;

  const isCredit = sale.payment?.method === "CREDIT";

  const displayAmount = isCredit ? sale.dueAmount : totalCollected;

  const displayAmountLabel = isCredit ? "Amount Due" : "Amount Collected";

  const clearCart = useSaleStore((state) => state.clearCart);

  /* ---------------------------------------------------------------------- */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          max-h-[95vh]
          overflow-y-auto
          rounded-t-[2rem]
          border-0
          bg-slate-50
          p-0
        "
      >
        {/* ================================================================ */}
        {/* SUCCESS HEADER                                                   */}
        {/* ================================================================ */}

        <div className="relative px-5 pb-5 pt-7 text-center">
          <button
            type="button"
            onClick={() => {
              clearCart();
              onOpenChange(false);
              router.replace("/sales");
            }}
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
    bg-white
    text-slate-500
    shadow-sm
    ring-1
    ring-slate-200
    transition
    hover:bg-slate-50
    active:scale-95
  "
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Success icon */}

          <div className="relative mx-auto w-fit">
            <div
              className="
                flex
                h-[76px]
                w-[76px]
                items-center
                justify-center
                rounded-full
                bg-emerald-500
                shadow-lg
                shadow-emerald-200
                ring-8
                ring-emerald-50
              "
            >
              <CheckCircle2
                className="h-10 w-10 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
            Payment Successful
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Invoice created successfully
          </p>
        </div>

        {/* ================================================================ */}
        {/* AMOUNT CARD                                                       */}
        {/* ================================================================ */}

        <div className="px-5">
          <Card
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border-0
              bg-gradient-to-br
              from-violet-700
              via-violet-600
              to-fuchsia-600
              p-5
              text-white
              shadow-xl
              shadow-violet-200
            "
          >
            {/* Decorative glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-32
                w-32
                rounded-full
                bg-white/10
                blur-2xl
              "
            />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-white/70">
                    {displayAmountLabel}
                  </p>

                  <h3 className="mt-1 text-4xl font-black tracking-tight">
                    ₹{displayAmount.toLocaleString("en-IN")}
                  </h3>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/15
                    ring-1
                    ring-white/10
                    backdrop-blur
                  "
                >
                  <Receipt className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/15 pt-4">
                <div>
                  <p className="text-[10px] font-medium text-white/60">
                    Invoice No
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {sale.invoiceNo}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-medium text-white/60">
                    Sale No
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {sale.saleNo}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================================ */}
        {/* SALE SUMMARY                                                      */}
        {/* ================================================================ */}

        <div className="space-y-3 px-5 pt-4">
          <Card
            className="
              rounded-[24px]
              border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            <div className="space-y-3">
              <InfoRow label="Customer" value={customerName} />

              <InfoRow label="Payment" value={paymentMethod} badge />

              <InfoRow label="Items" value={String(sale.items?.length ?? 0)} />
            </div>
          </Card>

          {/* ============================================================ */}
          {/* STATUS                                                        */}
          {/* ============================================================ */}

          <Card
            className="
              rounded-[24px]
              border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            <p className="mb-3 text-sm font-bold text-slate-900">Sale Status</p>

            <div className="space-y-3">
              <StatusRow label="Payment" value="Completed" />

              <StatusRow label="Invoice" value="Created" />

              <StatusRow label="Stock" value="Updated" />
            </div>
          </Card>
        </div>

        {/* ================================================================ */}
        {/* ACTIONS                                                          */}
        {/* ================================================================ */}

        <div className="space-y-3 px-5 pb-8 pt-5">
          {/* Print + WhatsApp */}

          <div className="grid grid-cols-2 gap-3">
            {/* Print A4 */}

            <Button
              type="button"
              variant="outline"
              onClick={onPrint}
              className="
                group
                h-[58px]
                rounded-2xl
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                hover:border-violet-200
                hover:bg-violet-50
                hover:shadow-md
                active:scale-[0.98]
              "
            >
              <span
                className="
                  mr-2.5
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-violet-100
                  text-violet-700
                  transition
                  group-hover:bg-violet-200
                "
              >
                <Printer className="h-4 w-4" />
              </span>

              <span className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-900">
                  Print Invoice
                </span>

                <span className="text-[9px] font-medium text-slate-400">
                  A4 Format
                </span>
              </span>
            </Button>

            {/* WhatsApp */}

            <Button
              type="button"
              variant="outline"
              onClick={onShare}
              className="
                group
                h-[58px]
                rounded-2xl
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                hover:border-emerald-200
                hover:bg-emerald-50
                hover:shadow-md
                active:scale-[0.98]
              "
            >
              <span
                className="
                  mr-2.5
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100
                  text-emerald-600
                  transition
                  group-hover:bg-emerald-200
                "
              >
                <Share2 className="h-4 w-4" />
              </span>

              <span className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-900">
                  WhatsApp
                </span>

                <span className="text-[9px] font-medium text-slate-400">
                  Share Invoice
                </span>
              </span>
            </Button>
          </div>

          {/* ============================================================ */}
          {/* ADD NEW SALE                                                   */}
          {/* ============================================================ */}

          <Button
            type="button"
            onClick={onNewSale}
            className="
              group
              h-14
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              via-violet-500
              to-fuchsia-600
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-violet-200
              transition-all
              hover:shadow-xl
              hover:shadow-violet-300
              active:scale-[0.98]
            "
          >
            <span
              className="
                mr-2
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-white/15
              "
            >
              <Plus className="h-4 w-4" />
            </span>
            Add New Sale
            <ChevronRight
              className="
                ml-auto
                h-5
                w-5
                opacity-70
                transition-transform
                group-hover:translate-x-1
              "
            />
          </Button>

          {/* ============================================================ */}
          {/* GO TO SALES PAGE                                             */}
          {/* ============================================================ */}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clearCart();
              onOpenChange(false);
              router.replace("/sales");
            }}
            className="
    group
    relative
    h-12
    w-full
    justify-center
    rounded-2xl
    border-slate-200
    bg-white
    text-center
    text-sm
    font-bold
    text-slate-700
    shadow-sm
    transition-all
    hover:border-violet-200
    hover:bg-violet-50
    hover:text-violet-700
    hover:shadow-md
    active:scale-[0.98]
  "
          >
            Go To Sales Page
            <ChevronRight
              className="
    absolute
      right-4
      h-4
      w-4
      text-slate-400
      transition-transform
      group-hover:translate-x-1
      group-hover:text-violet-600
    "
            />
          </Button>

          <p className="text-center text-[9px] font-medium text-slate-400">
            Sale completed successfully
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ========================================================================== */
/* Info Row                                                                   */
/* ========================================================================== */

interface InfoRowProps {
  label: string;
  value: string;
  badge?: boolean;
}

function InfoRow({ label, value, badge = false }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-medium text-slate-500">{label}</span>

      {badge ? (
        <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold text-violet-700">
          {value}
        </span>
      ) : (
        <span className="max-w-[65%] truncate text-right text-xs font-bold text-slate-900">
          {value}
        </span>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Status Row                                                                 */
/* ========================================================================== */

interface StatusRowProps {
  label: string;
  value: string;
}

function StatusRow({ label, value }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-emerald-100
          "
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>

        <span className="text-xs font-semibold text-slate-700">{label}</span>
      </div>

      <span className="text-xs font-bold text-emerald-600">{value}</span>
    </div>
  );
}
