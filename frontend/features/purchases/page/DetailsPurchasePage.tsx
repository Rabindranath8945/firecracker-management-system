"use client";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Package,
  Phone,
  Receipt,
  Truck,
  User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import PurchaseService from "../service/purchase.service";

interface PurchaseDetailsProps {
  purchaseId: string;
}

function formatMoney(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getPaymentStatus(status: string) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      };

    case "PARTIAL":
      return {
        label: "Partial",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
      };

    case "DUE":
      return {
        label: "Due",
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
      };

    default:
      return {
        label: status,
        className:
          "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
      };
  }
}

export default function PurchaseDetails({ purchaseId }: PurchaseDetailsProps) {
  const {
    data: purchase,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["purchase", purchaseId],
    queryFn: () => PurchaseService.getPurchase(purchaseId),
    enabled: Boolean(purchaseId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        <div className="h-40 animate-pulse rounded-3xl bg-muted" />
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (isError || !purchase) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="flex min-h-[240px] flex-col items-center justify-center text-center">
          <Receipt className="h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-bold">Purchase Not Found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            This purchase could not be loaded.
          </p>
        </CardContent>
      </Card>
    );
  }

  const status = getPaymentStatus(purchase.paymentStatus);

  const purchaseDate = new Date(purchase.purchaseDate);

  const formattedDate = Number.isNaN(purchaseDate.getTime())
    ? "Invalid date"
    : purchaseDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const totalQuantity = purchase.items.reduce(
    (total: number, item: { quantity: number }) =>
      total + Number(item.quantity ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* ---------------------------------------------------------------- */}
      {/* PURCHASE HEADER                                                  */}
      {/* ---------------------------------------------------------------- */}

      <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Truck className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-white/70">Purchase</p>

                <h1 className="truncate text-xl font-bold">
                  {purchase.purchaseNo}
                </h1>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formattedDate}
            </span>

            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              {purchase.items.length} products
            </span>

            <span>{totalQuantity} qty</span>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* SUPPLIER                                                         */}
      {/* ---------------------------------------------------------------- */}

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <User className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Supplier</p>

              <h2 className="font-bold">
                {purchase.supplier?.name || "Unknown Supplier"}
              </h2>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-muted/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Supplier Code
              </p>

              <p className="mt-1 text-sm font-semibold">
                {purchase.supplier?.supplierCode || "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/50 p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Mobile
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                <Phone className="h-3.5 w-3.5" />
                {purchase.supplier?.mobile || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* ITEMS                                                             */}
      {/* ---------------------------------------------------------------- */}

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Purchased Items</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {purchase.items.length} products · {totalQuantity} quantity
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Package className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3">
            {purchase.items.map(
              (
                item: {
                  productName: string;
                  productCode?: string;
                  quantity: number;
                  purchasePrice: number;
                  total?: number;
                },
                index: number,
              ) => {
                const lineTotal =
                  item.total ??
                  Number(item.quantity) * Number(item.purchasePrice);

                return (
                  <div
                    key={`${item.productCode ?? item.productName}-${index}`}
                    className="rounded-2xl border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                          {item.productName}
                        </h3>

                        {item.productCode && (
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {item.productCode}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(lineTotal)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Qty{" "}
                        <strong className="text-foreground">
                          {item.quantity}
                        </strong>
                      </span>

                      <span>×</span>

                      <span>
                        Purchase Price{" "}
                        <strong className="text-foreground">
                          {formatMoney(item.purchasePrice)}
                        </strong>
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* PAYMENT SUMMARY                                                  */}
      {/* ---------------------------------------------------------------- */}

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">Payment Summary</h2>

              <p className="text-xs text-muted-foreground">
                Purchase payment information
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>

              <span className="font-medium">
                {formatMoney(purchase.subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>

              <span className="font-medium">
                - {formatMoney(purchase.discount)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST / Tax</span>

              <span className="font-medium">
                {formatMoney(purchase.gstTotal)}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold">Grand Total</span>

                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatMoney(purchase.grandTotal)}
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paid</span>

                <span className="font-semibold text-emerald-600">
                  {formatMoney(purchase.paidAmount)}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-muted-foreground">Due</span>

                <span className="font-semibold text-red-600 dark:text-red-400">
                  {formatMoney(purchase.dueAmount)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* PAYMENT CONFIRMATION                                             */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5" />
        Purchase recorded successfully
      </div>
    </div>
  );
}
