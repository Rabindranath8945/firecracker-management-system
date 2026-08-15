"use client";

import { CalendarDays, Filter, RotateCcw } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { PaymentStatus } from "../types/purchase.types";

interface PurchaseFilterSheetProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  paymentStatus: PaymentStatus | undefined;

  onPaymentStatusChange: (value: PaymentStatus | undefined) => void;

  fromDate: string;

  toDate: string;

  onFromDateChange: (value: string) => void;

  onToDateChange: (value: string) => void;

  onReset: () => void;
}

const PAYMENT_STATUSES: {
  value: PaymentStatus;
  label: string;
}[] = [
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "PARTIAL",
    label: "Partial",
  },
  {
    value: "DUE",
    label: "Due",
  },
];

export default function PurchaseFilterSheet({
  open,
  onOpenChange,
  paymentStatus,
  onPaymentStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onReset,
}: PurchaseFilterSheetProps) {
  /* ---------------------------------------------------------------------- */
  /* Payment Status                                                         */
  /* ---------------------------------------------------------------------- */

  function handleStatus(status: PaymentStatus) {
    if (paymentStatus === status) {
      onPaymentStatusChange(undefined);
      return;
    }

    onPaymentStatusChange(status);
  }

  /* ---------------------------------------------------------------------- */
  /* Reset                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleReset() {
    onReset();
    onOpenChange(false);
  }

  /* ---------------------------------------------------------------------- */
  /* Apply                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleApply() {
    onOpenChange(false);
  }

  /* ---------------------------------------------------------------------- */
  /* Date Helpers                                                           */
  /* ---------------------------------------------------------------------- */

  function formatDate(date: Date) {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getToday() {
    return formatDate(new Date());
  }

  /* ---------------------------------------------------------------------- */
  /* Quick Dates                                                            */
  /* ---------------------------------------------------------------------- */

  function setToday() {
    const today = getToday();

    onFromDateChange(today);
    onToDateChange(today);
  }

  function setYesterday() {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    const yesterday = formatDate(date);

    onFromDateChange(yesterday);
    onToDateChange(yesterday);
  }

  function setLastSevenDays() {
    const today = new Date();

    const start = new Date(today);

    start.setDate(today.getDate() - 6);

    onFromDateChange(formatDate(start));

    onToDateChange(formatDate(today));
  }

  function setThisMonth() {
    const today = new Date();

    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    onFromDateChange(formatDate(start));

    onToDateChange(formatDate(today));
  }

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="
          max-h-[90vh]
          overflow-y-auto
          rounded-t-[30px]
          p-0
        "
      >
        {/* Header */}

        <SheetHeader
          className="
            border-b
            bg-emerald-50/70
            px-6
            py-5
            dark:bg-emerald-500/10
          "
        >
          <SheetTitle className="flex items-center gap-3 text-left">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
                dark:bg-emerald-500/20
              "
            >
              <Filter
                className="
                  h-5
                  w-5
                  text-emerald-600
                  dark:text-emerald-300
                "
              />
            </div>

            <div>
              <p className="text-lg font-semibold">Purchase Filters</p>

              <p className="text-sm font-normal text-muted-foreground">
                Refine your purchase list.
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-7 p-6">
          {/* ---------------------------------------------------------------- */}
          {/* Payment Status                                                   */}
          {/* ---------------------------------------------------------------- */}

          <section>
            <div className="mb-3">
              <h3 className="text-sm font-semibold">Payment Status</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Show purchases by payment status.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_STATUSES.map((status) => {
                const active = paymentStatus === status.value;

                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleStatus(status.value)}
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-sm font-semibold transition-all",

                      active
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "border-border bg-background hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
                    )}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Date Range                                                       */}
          {/* ---------------------------------------------------------------- */}

          <section>
            <div className="mb-3">
              <h3 className="text-sm font-semibold">Date Range</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Select the purchase date range.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* From */}

              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  From
                </p>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-emerald-500" />

                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(event) => onFromDateChange(event.target.value)}
                    className="
                      border-0
                      bg-transparent
                      p-0
                      shadow-none
                      focus-visible:ring-0
                    "
                  />
                </div>
              </div>

              {/* To */}

              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  To
                </p>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-emerald-500" />

                  <Input
                    type="date"
                    value={toDate}
                    onChange={(event) => onToDateChange(event.target.value)}
                    className="
                      border-0
                      bg-transparent
                      p-0
                      shadow-none
                      focus-visible:ring-0
                    "
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Quick Dates                                                      */}
          {/* ---------------------------------------------------------------- */}

          <section>
            <div className="mb-3">
              <h3 className="text-sm font-semibold">Quick Date</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="
                  h-11
                  rounded-2xl
                  hover:border-emerald-400
                  hover:bg-emerald-50
                "
                onClick={setToday}
              >
                Today
              </Button>

              <Button
                type="button"
                variant="outline"
                className="
                  h-11
                  rounded-2xl
                  hover:border-emerald-400
                  hover:bg-emerald-50
                "
                onClick={setYesterday}
              >
                Yesterday
              </Button>

              <Button
                type="button"
                variant="outline"
                className="
                  h-11
                  rounded-2xl
                  hover:border-emerald-400
                  hover:bg-emerald-50
                "
                onClick={setLastSevenDays}
              >
                Last 7 Days
              </Button>

              <Button
                type="button"
                variant="outline"
                className="
                  h-11
                  rounded-2xl
                  hover:border-emerald-400
                  hover:bg-emerald-50
                "
                onClick={setThisMonth}
              >
                This Month
              </Button>
            </div>
          </section>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Footer                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            sticky
            bottom-0
            flex
            gap-3
            border-t
            bg-background
            p-5
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="
              h-12
              flex-1
              rounded-2xl
              hover:border-emerald-300
              hover:bg-emerald-50
            "
          >
            <RotateCcw className="mr-2 h-4 w-4 text-emerald-600" />
            Reset
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            className="
              h-12
              flex-1
              rounded-2xl
              bg-gradient-to-r
              from-emerald-600
              to-green-500
              font-semibold
              text-white
              shadow-lg
              shadow-emerald-500/20
              hover:opacity-95
            "
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
